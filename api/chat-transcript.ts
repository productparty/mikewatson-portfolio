import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  const allowedOrigins = [
    "https://mikewatson.us",
    "https://www.mikewatson.us",
    "https://mikewatsonusportfolio.vercel.app",
    "http://localhost:5000",
    "http://localhost:3000",
  ];

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Handle both JSON and text bodies (sendBeacon sends as text/plain)
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Invalid JSON" });
    }
  }

  const { sessionId, messages } = body || {};

  if (!sessionId || !messages) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not configured");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // Check if there's a lead for this session
    const leadResult = await sql`
      SELECT id, name, email, email_sent FROM chat_leads
      WHERE session_id = ${sessionId}
    `;

    const lead = leadResult[0];

    // Update or insert transcript
    await sql`
      INSERT INTO chat_transcripts (session_id, lead_id, messages, updated_at)
      VALUES (${sessionId}, ${lead?.id || null}, ${JSON.stringify(messages)}, NOW())
      ON CONFLICT (session_id) DO UPDATE SET
        messages = ${JSON.stringify(messages)},
        updated_at = NOW()
    `;

    // Send final email if lead exists and email hasn't been sent yet
    if (lead && !lead.email_sent && process.env.RESEND_API_KEY) {
      await sendFinalTranscript(lead.name, lead.email, sessionId, messages);

      // Mark email as sent
      await sql`
        UPDATE chat_leads SET email_sent = true WHERE id = ${lead.id}
      `;
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Chat transcript error:", error);
    res.status(500).json({ error: "Failed to save transcript" });
  }
}

async function sendFinalTranscript(
  name: string,
  email: string,
  sessionId: string,
  messages: Array<{ role: string; content: string }>
) {
  const transcript = messages
    .map((m) => `**${m.role === "user" ? name : "Mike's AI"}:**\n${m.content}`)
    .join("\n\n---\n\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "Portfolio AI <onboarding@resend.dev>",
        to: process.env.NOTIFICATION_EMAIL || "mwatson1983@gmail.com",
        subject: `Complete Chat Transcript: ${name}`,
        html: `
          <h2>Complete Chat Transcript</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Session ID:</strong> ${sessionId}</p>
          <p><strong>Messages:</strong> ${messages.length}</p>

          <h3>Full Conversation</h3>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; white-space: pre-wrap; font-family: system-ui;">
            ${transcript}
          </div>

          <p style="margin-top: 20px; color: #666;">
            Reply directly to this email to reach ${name} at ${email}
          </p>
        `,
        reply_to: email,
      }),
    });

    if (!response.ok) {
      console.error("Failed to send final transcript:", await response.text());
    }
  } catch (error) {
    console.error("Email send error:", error);
  }
}
