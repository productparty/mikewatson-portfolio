import type { VercelRequest, VercelResponse } from "@vercel/node";

// ── Types ────────────────────────────────────────────────────────────────────

interface StitchTool {
  name: string;
  description?: string;
  inputSchema?: {
    properties?: Record<string, { type?: string }>;
    required?: string[];
  };
}

interface StitchRpcResult<T> {
  result?: T;
  error?: { message?: string };
}

interface ToolsListResult {
  tools?: StitchTool[];
}

interface ToolCallResult {
  content?: Array<{ text?: string }>;
}

// ── Config ───────────────────────────────────────────────────────────────────

const STITCH_MCP_URL = "https://stitch.googleapis.com/mcp";
const STITCH_TIMEOUT_MS = 5_000;
const MAX_RECOMMENDATIONS = 4;
const MIN_TEXT_LENGTH = 10;
const MAX_TEXT_LENGTH = 140;

/** Phrases that indicate Stitch returned an error as content instead of as an error field. */
const ERROR_PHRASES = [
  "not found",
  "entity was not found",
  "requested entity",
  "unauthorized",
  "permission denied",
  "access denied",
  "internal error",
  "service unavailable",
  "rate limit",
  "quota exceeded",
  "invalid request",
  "bad request",
  "method not allowed",
  "forbidden",
];

const FALLBACK_RECOMMENDATIONS = [
  "What product problems are you best at solving?",
  "Tell me about a project where AI made a measurable impact.",
  "How do you prioritize when everything feels urgent?",
  "What would your first 30 days look like in a new role?",
];

/** Starter questions from the frontend — used to dedup server-side. */
const STARTER_QUESTIONS_LOWER = new Set([
  "what's the story behind 3,000% e-notary growth?",
  "how do you approach inheriting a messy backlog?",
  "tell me about building leafed as a non-developer",
  "what's your take on ai replacing pms?",
  "what are you looking for in your next role?",
]);

// ── Warm-start cache for tools/list ──────────────────────────────────────────
// Vercel keeps warm serverless instances alive for minutes. Caching the tool
// list avoids a redundant round-trip on repeated calls within the same instance.

let cachedTool: StitchTool | null = null;
let cacheExpiry = 0;
const CACHE_TTL_MS = 5 * 60 * 1_000; // 5 minutes

// ── CORS helpers ─────────────────────────────────────────────────────────────

const ALLOWED_ORIGINS = new Set([
  "https://mikewatson.us",
  "https://www.mikewatson.us",
  "https://mikewatsonusportfolio.vercel.app",
  "http://localhost:5000",
  "http://localhost:3000",
]);

function setCorsHeaders(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
}

// ── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.STITCH_API_KEY;
  if (!apiKey) {
    return respond(res, FALLBACK_RECOMMENDATIONS, "fallback", "No API key");
  }

  const { query } = (req.body as { query?: string }) || {};
  const normalizedQuery =
    typeof query === "string" && query.trim().length > 0
      ? query.trim().slice(0, 500)
      : "Help portfolio visitors ask better questions about Mike's product and AI experience.";

  try {
    // Step 1: Resolve tool (cached when possible)
    const tool = await resolveRecommendationTool(apiKey);
    if (!tool) {
      return respond(res, FALLBACK_RECOMMENDATIONS, "fallback", "No compatible tool");
    }

    // Step 2: Call the tool
    const callResult = await stitchRpc<ToolCallResult>(
      "tools/call",
      { name: tool.name, arguments: buildArguments(tool, normalizedQuery) },
      apiKey
    );

    if (callResult.error) {
      return respond(
        res,
        FALLBACK_RECOMMENDATIONS,
        "fallback",
        callResult.error.message
      );
    }

    // Step 3: Extract, sanitize, dedup
    const rawText = (callResult.result?.content ?? [])
      .map((c) => c.text ?? "")
      .join("\n");

    // Detect error messages returned as content instead of error field
    if (looksLikeError(rawText)) {
      return respond(
        res,
        FALLBACK_RECOMMENDATIONS,
        "fallback",
        `Stitch returned error-like content: ${rawText.slice(0, 100)}`
      );
    }

    const recommendations = extractAndSanitize(rawText);

    if (recommendations.length === 0) {
      return respond(res, FALLBACK_RECOMMENDATIONS, "fallback", "Empty parse result");
    }

    return respond(res, recommendations, "stitch");
  } catch (err) {
    console.error("stitch-recommendations error:", err);
    return respond(res, FALLBACK_RECOMMENDATIONS, "fallback", "Unexpected error");
  }
}

// ── Response helper ──────────────────────────────────────────────────────────

function respond(
  res: VercelResponse,
  recommendations: string[],
  source: "stitch" | "fallback",
  reason?: string
) {
  const body: Record<string, unknown> = { recommendations, source };
  if (reason) body.reason = reason;
  return res.status(200).json(body);
}

// ── Stitch RPC with timeout ──────────────────────────────────────────────────

async function stitchRpc<T>(
  method: string,
  params: Record<string, unknown>,
  apiKey: string
): Promise<StitchRpcResult<T>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), STITCH_TIMEOUT_MS);

  try {
    const response = await fetch(STITCH_MCP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: crypto.randomUUID(),
        method,
        params,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return { error: { message: `HTTP ${response.status}` } };
    }

    return (await response.json()) as StitchRpcResult<T>;
  } catch (err) {
    const message =
      err instanceof Error && err.name === "AbortError"
        ? `Stitch timeout (${STITCH_TIMEOUT_MS}ms)`
        : "Stitch fetch failed";
    return { error: { message } };
  } finally {
    clearTimeout(timer);
  }
}

// ── Tool resolution with caching ─────────────────────────────────────────────

async function resolveRecommendationTool(
  apiKey: string
): Promise<StitchTool | null> {
  if (cachedTool && Date.now() < cacheExpiry) {
    return cachedTool;
  }

  const result = await stitchRpc<ToolsListResult>("tools/list", {}, apiKey);
  const tools = result.result?.tools;
  if (!tools?.length) return null;

  const picked = pickBestTool(tools);
  if (picked) {
    cachedTool = picked;
    cacheExpiry = Date.now() + CACHE_TTL_MS;
  }

  return picked;
}

// ── Tool selection ───────────────────────────────────────────────────────────
// Score by keywords in both name AND description.

const TOOL_KEYWORDS: Array<[string, number]> = [
  ["recommend", 5],
  ["suggest", 4],
  ["prompt", 3],
  ["query", 2],
  ["search", 1],
  ["generate", 1],
];

function pickBestTool(tools: StitchTool[]): StitchTool | null {
  let best: StitchTool | null = null;
  let bestScore = 0;

  for (const tool of tools) {
    const haystack = `${tool.name} ${tool.description ?? ""}`.toLowerCase();
    let score = 0;
    for (const [keyword, weight] of TOOL_KEYWORDS) {
      if (haystack.includes(keyword)) score += weight;
    }
    if (score > bestScore) {
      bestScore = score;
      best = tool;
    }
  }

  return bestScore > 0 ? best : null;
}

// ── Argument building ────────────────────────────────────────────────────────

const PREFERRED_FIELDS = ["query", "prompt", "text", "input", "question", "content"];

function buildArguments(
  tool: StitchTool,
  query: string
): Record<string, unknown> {
  const props = tool.inputSchema?.properties ?? {};
  const stringFields = Object.keys(props).filter(
    (k) => props[k]?.type === "string" || !props[k]?.type
  );

  const field =
    PREFERRED_FIELDS.find((f) => stringFields.includes(f)) ?? stringFields[0];

  return field ? { [field]: query } : { query };
}

// ── Error detection ──────────────────────────────────────────────────────────

/** Check if raw Stitch output looks like an error message rather than recommendations. */
function looksLikeError(text: string): boolean {
  if (!text.trim()) return true;
  const lower = text.toLowerCase().trim();
  // If the entire response is short and matches an error phrase, it's an error
  if (lower.length < 200) {
    return ERROR_PHRASES.some((phrase) => lower.includes(phrase));
  }
  return false;
}

// ── Extraction + sanitization pipeline ───────────────────────────────────────

function extractAndSanitize(rawText: string): string[] {
  if (!rawText.trim()) return [];

  // Try structured JSON first, then fall back to line-by-line
  const lines = tryParseStructured(rawText) ?? rawText.split("\n");

  const seen = new Set<string>();
  const results: string[] = [];

  for (const line of lines) {
    const cleaned = sanitize(line);
    if (!cleaned) continue;

    // Dedup by normalized key
    const key = cleaned.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (seen.has(key)) continue;

    // Skip if too similar to a starter question
    if (STARTER_QUESTIONS_LOWER.has(cleaned.toLowerCase())) continue;

    seen.add(key);
    results.push(cleaned);

    if (results.length >= MAX_RECOMMENDATIONS) break;
  }

  return results;
}

/** Attempt to extract string lines from JSON structures Stitch might return. */
function tryParseStructured(text: string): string[] | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }

  // { recommendations: [...] } or { items: [...] }
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    const obj = parsed as Record<string, unknown>;
    const arr = obj.recommendations ?? obj.items ?? obj.results ?? obj.suggestions;
    if (Array.isArray(arr)) {
      return arr
        .filter((v): v is string => typeof v === "string")
        .filter(Boolean);
    }
  }

  // [{ title: "..." }, ...] or ["...", ...]
  if (Array.isArray(parsed)) {
    return parsed.map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") {
        const obj = item as Record<string, unknown>;
        const label =
          (typeof obj.title === "string" && obj.title) ||
          (typeof obj.name === "string" && obj.name) ||
          (typeof obj.text === "string" && obj.text) ||
          "";
        return label ? `Tell me about ${label}.` : "";
      }
      return "";
    });
  }

  return null;
}

/** Clean a single recommendation line. Returns empty string if invalid. */
function sanitize(value: string): string {
  let cleaned = value
    .replace(/^\s*[-*•]\s*/, "")     // list markers
    .replace(/^\s*\d+[.)]\s*/, "")   // numbered lists
    .replace(/^["']|["']$/g, "")     // wrapping quotes
    .trim();

  // Reject JSON fragments, too-short, too-long, or error-like content
  const lower = cleaned.toLowerCase();
  if (
    cleaned.length < MIN_TEXT_LENGTH ||
    cleaned.length > MAX_TEXT_LENGTH ||
    /[{}[\]]/.test(cleaned) ||
    cleaned.includes(':"') ||
    ERROR_PHRASES.some((phrase) => lower.includes(phrase))
  ) {
    return "";
  }

  // Ensure trailing punctuation
  if (!/[.?!]$/.test(cleaned)) {
    cleaned += "?";
  }

  return cleaned;
}
