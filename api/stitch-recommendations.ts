import type { VercelRequest, VercelResponse } from "@vercel/node";

interface StitchTool {
  name: string;
  inputSchema?: {
    properties?: Record<string, { type?: string }>;
    required?: string[];
  };
}

interface StitchRpcResponse<T> {
  result?: T;
  error?: { message?: string };
}

const STITCH_MCP_URL = "https://stitch.googleapis.com/mcp";
const MAX_RECOMMENDATIONS = 4;

const fallbackRecommendations = [
  "What product problems are you best at solving?",
  "Tell me about a project where AI made a measurable impact.",
  "How do you prioritize when everything feels urgent?",
  "What would your first 30 days look like in a new role?",
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

  const stitchApiKey = process.env.STITCH_API_KEY;
  if (!stitchApiKey) {
    return res.status(200).json({
      recommendations: fallbackRecommendations,
      source: "fallback",
      reason: "STITCH_API_KEY missing",
    });
  }

  const { query } = req.body || {};
  const normalizedQuery =
    typeof query === "string" && query.trim().length > 0
      ? query.trim().slice(0, 500)
      : "Help portfolio visitors ask better questions about Mike's product and AI experience.";

  try {
    const toolsList = await callStitchRpc<{ tools?: StitchTool[] }>(
      "tools/list",
      {},
      stitchApiKey
    );

    if (toolsList.error || !toolsList.result?.tools?.length) {
      return res.status(200).json({
        recommendations: fallbackRecommendations,
        source: "fallback",
        reason: toolsList.error?.message || "No tools returned from Stitch",
      });
    }

    const selectedTool = pickRecommendationTool(toolsList.result.tools);
    if (!selectedTool) {
      return res.status(200).json({
        recommendations: fallbackRecommendations,
        source: "fallback",
        reason: "No recommendation-compatible Stitch tool found",
      });
    }

    const toolArguments = buildToolArguments(selectedTool, normalizedQuery);
    const toolCall = await callStitchRpc<{ content?: Array<{ text?: string }> }>(
      "tools/call",
      {
        name: selectedTool.name,
        arguments: toolArguments,
      },
      stitchApiKey
    );

    if (toolCall.error) {
      return res.status(200).json({
        recommendations: fallbackRecommendations,
        source: "fallback",
        reason: toolCall.error.message || "Stitch tool call failed",
      });
    }

    const rawText = toolCall.result?.content?.map((item) => item.text || "").join("\n");
    const recommendations = extractRecommendations(rawText).slice(0, MAX_RECOMMENDATIONS);

    if (recommendations.length === 0) {
      return res.status(200).json({
        recommendations: fallbackRecommendations,
        source: "fallback",
        reason: "Unable to parse recommendations from Stitch output",
      });
    }

    return res.status(200).json({
      recommendations,
      source: "stitch",
    });
  } catch (error) {
    console.error("stitch-recommendations error:", error);
    return res.status(200).json({
      recommendations: fallbackRecommendations,
      source: "fallback",
      reason: "Unexpected error while calling Stitch",
    });
  }
}

async function callStitchRpc<T>(
  method: string,
  params: Record<string, unknown>,
  apiKey: string
): Promise<StitchRpcResponse<T>> {
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
  });

  if (!response.ok) {
    return { error: { message: `HTTP ${response.status}` } };
  }

  const json = (await response.json()) as StitchRpcResponse<T>;
  return json;
}

function pickRecommendationTool(tools: StitchTool[]): StitchTool | null {
  const weightedTool = tools
    .map((tool) => {
      const name = tool.name.toLowerCase();
      const score =
        (name.includes("recommend") ? 4 : 0) +
        (name.includes("suggest") ? 3 : 0) +
        (name.includes("query") ? 2 : 0) +
        (name.includes("search") ? 1 : 0);
      return { tool, score };
    })
    .sort((a, b) => b.score - a.score)[0];

  // Only use Stitch tools that look recommendation-oriented.
  // Falling back to an arbitrary tool can return unrelated structured data.
  return weightedTool && weightedTool.score > 0 ? weightedTool.tool : null;
}

function buildToolArguments(tool: StitchTool, query: string): Record<string, unknown> {
  const properties = tool.inputSchema?.properties || {};
  const propertyNames = Object.keys(properties);
  const stringFields = propertyNames.filter(
    (key) => properties[key]?.type === "string" || !properties[key]?.type
  );

  const preferredFieldNames = [
    "query",
    "prompt",
    "text",
    "input",
    "question",
    "content",
  ];

  const preferredField =
    preferredFieldNames.find((name) => stringFields.includes(name)) || stringFields[0];

  if (preferredField) {
    return { [preferredField]: query };
  }

  return { query };
}

function extractRecommendations(rawText?: string): string[] {
  if (!rawText) {
    return [];
  }

  const parsedArray = safeParseJson<Array<Record<string, unknown>>>(rawText);
  if (Array.isArray(parsedArray) && parsedArray.length > 0) {
    const fromTitles = parsedArray
      .map((item) => {
        const title =
          (typeof item.title === "string" && item.title) ||
          (typeof item.name === "string" && item.name) ||
          "";
        return title ? `Tell me about ${title}.` : "";
      })
      .filter(Boolean);

    if (fromTitles.length > 0) {
      return fromTitles;
    }
  }

  const parsedJson = safeParseJson<{ recommendations?: string[]; items?: string[] }>(rawText);
  if (parsedJson?.recommendations?.length) {
    return parsedJson.recommendations
      .filter(Boolean)
      .map((item) => sanitizeRecommendation(item))
      .filter(Boolean);
  }
  if (parsedJson?.items?.length) {
    return parsedJson.items
      .filter(Boolean)
      .map((item) => sanitizeRecommendation(item))
      .filter(Boolean);
  }

  return rawText
    .split("\n")
    .map((line) => sanitizeRecommendation(line))
    .filter(Boolean)
    .slice(0, MAX_RECOMMENDATIONS);
}

function sanitizeRecommendation(value: string): string {
  const cleaned = value
    .replace(/^\s*[-*•]\s*/, "")
    .replace(/^\s*\d+[\.\)]\s*/, "")
    .trim();

  if (
    cleaned.length < 8 ||
    cleaned.includes("{") ||
    cleaned.includes("}") ||
    cleaned.includes(":\"") ||
    cleaned.startsWith("[")
  ) {
    return "";
  }

  return cleaned;
}

function safeParseJson<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}
