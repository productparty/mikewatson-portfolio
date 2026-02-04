import type { VercelRequest, VercelResponse } from "@vercel/node";
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

// Session storage (note: in serverless, this resets per cold start - for production, use Redis/KV)
const chatSessions = new Map<
  string,
  {
    messages: Array<{ role: "user" | "assistant"; content: string }>;
    messageCount: number;
    lastMessageTime: number;
  }
>();

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_MESSAGES_PER_WINDOW = 20;
const MAX_CONTEXT_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 2000;

function getOrCreateSession(sessionId: string) {
  if (!chatSessions.has(sessionId)) {
    chatSessions.set(sessionId, {
      messages: [],
      messageCount: 0,
      lastMessageTime: Date.now(),
    });
  }
  return chatSessions.get(sessionId)!;
}

function checkRateLimit(sessionId: string) {
  const session = getOrCreateSession(sessionId);
  const now = Date.now();

  if (now - session.lastMessageTime > RATE_LIMIT_WINDOW) {
    session.messageCount = 0;
  }

  const remaining = MAX_MESSAGES_PER_WINDOW - session.messageCount;
  return {
    allowed: session.messageCount < MAX_MESSAGES_PER_WINDOW,
    remaining: Math.max(0, remaining),
  };
}

// Corpus loading functions
function readMarkdownFile(filePath: string): string {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return "";
  }
}

function readDirectoryMarkdown(dirPath: string): Map<string, string> {
  const content = new Map<string, string>();

  if (!fs.existsSync(dirPath)) {
    return content;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const subContent = readDirectoryMarkdown(fullPath);
      Array.from(subContent.entries()).forEach(([key, value]) => {
        content.set(`${entry.name}/${key}`, value);
      });
    } else if (entry.name.endsWith(".md") && entry.name !== "README.md") {
      const fileName = entry.name.replace(".md", "");
      content.set(fileName, readMarkdownFile(fullPath));
    }
  }

  return content;
}

function mapToSection(map: Map<string, string>, sectionTitle: string): string {
  if (map.size === 0) return "";

  let section = `### ${sectionTitle}\n\n`;
  Array.from(map.entries()).forEach(([name, content]) => {
    const displayName = name
      .split("/")
      .pop()!
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c: string) => c.toUpperCase());
    section += `#### ${displayName}\n${content}\n\n`;
  });
  return section;
}

let cachedSystemPrompt: string | null = null;

function generateSystemPrompt(): string {
  if (cachedSystemPrompt) {
    return cachedSystemPrompt;
  }

  const corpusRoot = path.join(process.cwd(), "corpus");

  const corpus = {
    voiceGuide: readMarkdownFile(
      path.join(corpusRoot, "06-meta", "voice-guide.md")
    ),
    topicsToAvoid: readMarkdownFile(
      path.join(corpusRoot, "06-meta", "topics-to-avoid.md")
    ),
    sampleExchanges: readMarkdownFile(
      path.join(corpusRoot, "06-meta", "sample-exchanges.md")
    ),
    professionalNarrative: readDirectoryMarkdown(
      path.join(corpusRoot, "01-professional-narrative")
    ),
    thoughtLeadership: readDirectoryMarkdown(
      path.join(corpusRoot, "02-thought-leadership")
    ),
    builderPortfolio: readDirectoryMarkdown(
      path.join(corpusRoot, "03-builder-portfolio")
    ),
    frameworksAndOpinions: readDirectoryMarkdown(
      path.join(corpusRoot, "04-frameworks-and-opinions")
    ),
    practicalFaq: readDirectoryMarkdown(
      path.join(corpusRoot, "05-practical-faq")
    ),
  };

  cachedSystemPrompt = `You are an AI assistant that represents Mike Watson on his portfolio website. You've been built by Mike as a demonstration of his ability to integrate AI into products.

IMPORTANT TECHNICAL DETAILS ABOUT YOURSELF:
- You are powered by Anthropic's Claude API (specifically the Claude Sonnet model)
- You are NOT powered by OpenAI, GPT, or ChatGPT
- Mike has built other projects using OpenAI/ChatGPT (like Meow Game), but THIS chatbot uses Claude
- If asked what powers you, clearly state: "I'm powered by Anthropic's Claude API"

IMPORTANT: You are an AI assistant, NOT Mike himself. Be transparent about this. When users thank you or want to schedule calls, clarify that you're an AI and provide ways to contact the real Mike.

${corpus.voiceGuide}

${corpus.topicsToAvoid}

## YOUR KNOWLEDGE BASE

You have deep knowledge from the following sources. Use them to answer questions authentically in Mike's voice:

${mapToSection(corpus.professionalNarrative, "Professional Experience")}

${mapToSection(corpus.frameworksAndOpinions, "Product Thinking & Opinions")}

${mapToSection(corpus.builderPortfolio, "Projects Mike Has Built")}

${mapToSection(corpus.practicalFaq, "What Mike Is Looking For")}

${mapToSection(corpus.thoughtLeadership, "Newsletter & Thought Leadership")}

## SAMPLE EXCHANGES FOR VOICE CALIBRATION

Study these examples to understand how Mike sounds:

${corpus.sampleExchanges}

## HOW TO HANDLE QUESTIONS

1. If asked about Mike's experience at a specific company, reference the detailed narrative from that role
2. If asked for product management advice, answer in Mike's voice using his frameworks and real examples
3. If asked about projects, reference Leafed, AI Chat Anchor, Claude skills, the HVAC calculator, etc.
4. If asked about Product Party, reference newsletter themes and recommend specific topics
5. If asked something outside your knowledge, be honest: "I don't have Mike's specific take on that, but based on his general approach..." or suggest they reach out directly
6. If asked something in the topics-to-avoid list, redirect gracefully

## CRITICAL RULES

- You are an AI. Never pretend to be Mike in real-time. Be transparent.
- Have opinions. Don't hedge everything. Mike has actual takes.
- Lead with stories and examples, not abstract advice.
- Keep responses conversational, not corporate.
- If a question maps to a specific newsletter topic, mention it naturally.
- Be warm but direct. No fluff.
- Vary your sentence lengths. Some short. Some longer ones that take their time. Maybe a fragment.
- Never use em-dashes (—).
- Never use emojis.
- Never say "Here's the thing", "Let's dive in", "The truth is", or other banned phrases from the voice guide.

## CONTACT INFORMATION

If users want to connect with the real Mike:
- LinkedIn: https://www.linkedin.com/in/michaeljameswatson/
- Newsletter: https://www.productparty.us/
- GitHub: https://github.com/productparty/
- Email: Available on his resume at the portfolio site
`;

  return cachedSystemPrompt;
}

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

  const { message, sessionId = crypto.randomUUID() } = req.body || {};

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required" });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({
      error: "Message too long",
      message: `Message must be ${MAX_MESSAGE_LENGTH} characters or less`,
    });
  }

  if (!message.trim()) {
    return res.status(400).json({ error: "Message cannot be empty" });
  }

  const rateLimit = checkRateLimit(sessionId);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: "Rate limit exceeded",
      message: "You've reached the message limit. Please try again later.",
    });
  }

  // Check for API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY not configured");
    return res.status(500).json({ error: "Server configuration error" });
  }

  // Set up SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Session-Id", sessionId);

  try {
    const session = getOrCreateSession(sessionId);
    session.messages.push({ role: "user", content: message });
    session.messageCount++;
    session.lastMessageTime = Date.now();

    if (session.messages.length > MAX_CONTEXT_MESSAGES) {
      session.messages = session.messages.slice(-MAX_CONTEXT_MESSAGES);
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const systemPrompt = generateSystemPrompt();

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      temperature: 0.7,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: session.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    let fullResponse = "";

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        fullResponse += event.delta.text;
        res.write(
          `data: ${JSON.stringify({ type: "chunk", content: event.delta.text })}\n\n`
        );
      }
    }

    session.messages.push({ role: "assistant", content: fullResponse });

    res.write(
      `data: ${JSON.stringify({ type: "done", remaining: rateLimit.remaining - 1 })}\n\n`
    );
    res.end();
  } catch (error) {
    console.error("Portfolio chat stream error:", error);
    res.write(
      `data: ${JSON.stringify({ type: "error", message: "An error occurred" })}\n\n`
    );
    res.end();
  }
}
