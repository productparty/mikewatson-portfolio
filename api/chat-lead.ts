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
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { sessionId, name, email, messages } = req.body || {};

  if (!sessionId || !name || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Basic validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not configured");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // Insert lead
    const leadResult = await sql`
      INSERT INTO chat_leads (session_id, name, email, created_at)
      VALUES (${sessionId}, ${name}, ${email}, NOW())
      ON CONFLICT (session_id) DO UPDATE SET
        name = ${name},
        email = ${email}
      RETURNING id
    `;

    const leadId = leadResult[0]?.id;

    // Insert or update transcript
    if (messages && Array.isArray(messages) && messages.length > 0) {
      await sql`
        INSERT INTO chat_transcripts (session_id, lead_id, messages, updated_at)
        VALUES (${sessionId}, ${leadId}, ${JSON.stringify(messages)}, NOW())
        ON CONFLICT (session_id) DO UPDATE SET
          lead_id = ${leadId},
          messages = ${JSON.stringify(messages)},
          updated_at = NOW()
      `;
    }

    // Send email notification to Mike
    await sendEmailNotification(name, email, sessionId, messages);

    res.json({ success: true, leadId });
  } catch (error) {
    console.error("Chat lead error:", error);
    res.status(500).json({ error: "Failed to save lead" });
  }
}

async function sendEmailNotification(
  name: string,
  email: string,
  sessionId: string,
  messages: Array<{ role: string; content: string }> | undefined
) {
  // If RESEND_API_KEY is not configured, skip email
  if (!process.env.RESEND_API_KEY) {
    console.log("RESEND_API_KEY not configured, skipping email notification");
    return;
  }

  const transcript = messages
    ?.map((m) => `**${m.role === "user" ? name : "Mike's AI"}:**\n${m.content}`)
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
        subject: `New Portfolio Chat Lead: ${name}`,
        html: `
          <h2>New Lead from Portfolio AI Chat</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Session ID:</strong> ${sessionId}</p>

          <h3>Conversation Transcript</h3>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; white-space: pre-wrap; font-family: system-ui;">
            ${transcript || "No messages yet"}
          </div>

          <p style="margin-top: 20px; color: #666;">
            Reply directly to this email to reach ${name} at ${email}
          </p>
        `,
        reply_to: email,
      }),
    });

    if (!response.ok) {
      console.error("Failed to send email:", await response.text());
    }
  } catch (error) {
    console.error("Email send error:", error);
  }
}
