import type { VercelRequest, VercelResponse } from '@vercel/node';
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

    // Email will be sent when user leaves the page (via chat-transcript endpoint)
    res.json({ success: true, leadId });
  } catch (error) {
    console.error("Chat lead error:", error);
    res.status(500).json({ error: "Failed to save lead" });
  }
}
