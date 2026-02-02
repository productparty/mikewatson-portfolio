import Anthropic from "@anthropic-ai/sdk";
import { generateSystemPrompt } from "./corpus-loader";

let _anthropic: Anthropic | null = null;

function getAnthropic(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }
  if (!_anthropic) {
    _anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return _anthropic;
}

// Portfolio Chat Types
type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface ChatSession {
  messages: ChatMessage[];
  messageCount: number;
  lastMessageTime: number;
}

// Session storage with rate limiting
const chatSessions = new Map<string, ChatSession>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_MESSAGES_PER_WINDOW = 20;
const MAX_CONTEXT_MESSAGES = 10;

// Clean up old sessions periodically
setInterval(() => {
  const now = Date.now();
  Array.from(chatSessions.entries()).forEach(([sessionId, session]) => {
    if (now - session.lastMessageTime > RATE_LIMIT_WINDOW * 2) {
      chatSessions.delete(sessionId);
    }
  });
}, RATE_LIMIT_WINDOW);

function getOrCreateSession(sessionId: string): ChatSession {
  if (!chatSessions.has(sessionId)) {
    chatSessions.set(sessionId, {
      messages: [],
      messageCount: 0,
      lastMessageTime: Date.now(),
    });
  }
  return chatSessions.get(sessionId)!;
}

export function checkRateLimit(sessionId: string): { allowed: boolean; remaining: number } {
  const session = getOrCreateSession(sessionId);
  const now = Date.now();

  // Reset count if window has passed
  if (now - session.lastMessageTime > RATE_LIMIT_WINDOW) {
    session.messageCount = 0;
  }

  const remaining = MAX_MESSAGES_PER_WINDOW - session.messageCount;
  return {
    allowed: session.messageCount < MAX_MESSAGES_PER_WINDOW,
    remaining: Math.max(0, remaining),
  };
}

export async function* streamPortfolioChat(
  userMessage: string,
  sessionId: string
): AsyncGenerator<string, void, unknown> {
  const session = getOrCreateSession(sessionId);

  // Update session
  session.messages.push({ role: "user", content: userMessage });
  session.messageCount++;
  session.lastMessageTime = Date.now();

  // Keep context window manageable
  if (session.messages.length > MAX_CONTEXT_MESSAGES) {
    session.messages = session.messages.slice(-MAX_CONTEXT_MESSAGES);
  }

  const systemPrompt = generateSystemPrompt();

  try {
    const stream = getAnthropic().messages.stream({
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
        yield event.delta.text;
      }
    }

    // Store assistant response in session
    session.messages.push({ role: "assistant", content: fullResponse });
  } catch (error) {
    console.error("Portfolio chat error:", error);
    yield "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.";
  }
}

export async function generatePortfolioChatResponse(
  userMessage: string,
  sessionId: string
): Promise<string> {
  let fullResponse = "";
  for await (const chunk of streamPortfolioChat(userMessage, sessionId)) {
    fullResponse += chunk;
  }
  return fullResponse;
}

export interface GeneratePlanParams {
  prompt: string;
  testScenario: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export async function generatePlanWithClaude(
  params: GeneratePlanParams
): Promise<string> {
  const {
    prompt,
    testScenario,
    model = "claude-sonnet-4-20250514",
    temperature = 0.7,
    maxTokens = 4000,
  } = params;

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const fullPrompt = `${prompt}\n\nTest Scenario: ${testScenario}\n\nGenerate a comprehensive plan following the MCP plan format with overview, detailed plan, and todos.`;

  try {
    const message = await getAnthropic().messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      messages: [
        {
          role: "user",
          content: fullPrompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === "text") {
      return content.text;
    }

    throw new Error("Unexpected response type from Claude API");
  } catch (error) {
    console.error("Claude API error:", error);
    throw error;
  }
}
