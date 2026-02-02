import OpenAI from "openai";
import { generatePlanWithClaude } from "./anthropic";

let _openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

export interface EvaluationRequest {
  prompt: string;
  testScenario: string;
  providers: ("claude" | "openai")[];
  variationName?: string;
}

export interface QualityScores {
  structure: number; // 0-5
  completeness: number; // 0-5
  clarity: number; // 0-5
}

export interface Assertions {
  hasOverview: boolean;
  hasPlan: boolean;
  hasTodos: boolean;
  validMarkdown: boolean;
}

export interface EvaluationResult {
  provider: "claude" | "openai";
  model: string;
  planOutput: string;
  qualityScores: QualityScores;
  assertions: Assertions;
  feedback: string;
}

async function generatePlanWithOpenAI(
  prompt: string,
  testScenario: string,
  model: string = "gpt-4o-mini"
): Promise<string> {
  const fullPrompt = `${prompt}\n\nTest Scenario: ${testScenario}\n\nGenerate a comprehensive plan following the MCP plan format with overview, detailed plan, and todos.`;

  const response = await getOpenAI().chat.completions.create({
    model,
    messages: [
      {
        role: "user",
        content: fullPrompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  return response.choices[0].message.content || "";
}

function evaluateStructure(planOutput: string): {
  score: number;
  assertions: Assertions;
  feedback: string;
} {
  const assertions: Assertions = {
    hasOverview: false,
    hasPlan: false,
    hasTodos: false,
    validMarkdown: false,
  };

  let score = 0;
  const feedback: string[] = [];

  // Check for valid markdown structure
  const hasMarkdownHeaders = /^#+\s/.test(planOutput) || /##\s/.test(planOutput);
  assertions.validMarkdown = hasMarkdownHeaders;
  if (hasMarkdownHeaders) {
    score += 1;
  } else {
    feedback.push("Missing proper markdown headers");
  }

  // Check for Overview section
  const hasOverview =
    /#+\s*overview/i.test(planOutput) ||
    /##\s*overview/i.test(planOutput);
  assertions.hasOverview = hasOverview;
  if (hasOverview) {
    score += 1;
  } else {
    feedback.push("Missing Overview section");
  }

  // Check for Plan section
  const hasPlan =
    /#+\s*plan/i.test(planOutput) ||
    /##\s*plan/i.test(planOutput) ||
    /#+\s*implementation/i.test(planOutput);
  assertions.hasPlan = hasPlan;
  if (hasPlan) {
    score += 1;
  } else {
    feedback.push("Missing Plan/Implementation section");
  }

  // Check for Todos section
  const hasTodos =
    /#+\s*todos?/i.test(planOutput) ||
    /##\s*todos?/i.test(planOutput) ||
    /- \[ \]/.test(planOutput) ||
    /- \[x\]/.test(planOutput) ||
    /\*\s*\[ \]/.test(planOutput);
  assertions.hasTodos = hasTodos;
  if (hasTodos) {
    score += 1;
  } else {
    feedback.push("Missing Todos section or checklist format");
  }

  // Check for file references (good practice)
  const hasFileReferences = /\[.*\]\(.*\.(ts|tsx|js|jsx|py|md|json|yaml|yml)\)/.test(
    planOutput
  );
  if (hasFileReferences) {
    score += 0.5;
    feedback.push("✓ Includes file references");
  }

  // Check for code blocks (good practice)
  const hasCodeBlocks = /```/.test(planOutput);
  if (hasCodeBlocks) {
    score += 0.5;
    feedback.push("✓ Includes code examples");
  }

  return {
    score: Math.min(5, score),
    assertions,
    feedback: feedback.length > 0 ? feedback.join("; ") : "All structure checks passed",
  };
}

async function evaluateCompleteness(
  planOutput: string,
  testScenario: string
): Promise<{ score: number; feedback: string }> {
  // Use LLM to evaluate if plan covers all requirements
  const evaluationPrompt = `Evaluate if the following plan comprehensively covers all requirements from the test scenario.

Test Scenario:
${testScenario}

Generated Plan:
${planOutput}

Rate the completeness on a scale of 0-5 where:
- 5: Plan covers all requirements comprehensively with clear actionable steps
- 4: Plan covers most requirements with minor gaps
- 3: Plan covers main requirements but misses some details
- 2: Plan covers basic requirements but misses important aspects
- 1: Plan covers only a few requirements
- 0: Plan does not address the requirements

Respond with ONLY a JSON object in this format:
{
  "score": <number 0-5>,
  "feedback": "<brief explanation of what's covered and what's missing>"
}`;

  try {
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: evaluationPrompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      score: Math.min(5, Math.max(0, result.score || 0)),
      feedback: result.feedback || "No feedback provided",
    };
  } catch (error) {
    console.error("Completeness evaluation error:", error);
    // Fallback: basic keyword matching
    const scenarioKeywords = testScenario.toLowerCase().split(/\s+/);
    const planLower = planOutput.toLowerCase();
    const matches = scenarioKeywords.filter((keyword) =>
      planLower.includes(keyword)
    ).length;
    const basicScore = Math.min(5, (matches / scenarioKeywords.length) * 5);

    return {
      score: basicScore,
      feedback: "Basic keyword matching (LLM evaluation failed)",
    };
  }
}

async function evaluateClarity(
  planOutput: string
): Promise<{ score: number; feedback: string }> {
  // Use LLM to evaluate clarity and actionability
  const evaluationPrompt = `Evaluate the clarity and actionability of the following plan.

Plan:
${planOutput}

Rate the clarity on a scale of 0-5 where:
- 5: Extremely clear, specific, actionable tasks with proper file references
- 4: Clear and mostly actionable with minor ambiguities
- 3: Generally clear but some tasks are vague
- 2: Somewhat unclear, tasks need more specificity
- 1: Unclear, tasks are too vague to execute
- 0: Very unclear, cannot determine what needs to be done

Respond with ONLY a JSON object in this format:
{
  "score": <number 0-5>,
  "feedback": "<brief explanation of clarity strengths and weaknesses>"
}`;

  try {
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: evaluationPrompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      score: Math.min(5, Math.max(0, result.score || 0)),
      feedback: result.feedback || "No feedback provided",
    };
  } catch (error) {
    console.error("Clarity evaluation error:", error);
    // Fallback: check for specific indicators
    const hasSpecificTasks = /- \[ \]|1\.|2\.|3\./.test(planOutput);
    const hasFilePaths = /\[.*\]\(.*\/.*\)/.test(planOutput);
    const hasCodeExamples = /```/.test(planOutput);

    let fallbackScore = 2;
    if (hasSpecificTasks) fallbackScore += 1;
    if (hasFilePaths) fallbackScore += 1;
    if (hasCodeExamples) fallbackScore += 0.5;

    return {
      score: Math.min(5, fallbackScore),
      feedback: "Basic structure analysis (LLM evaluation failed)",
    };
  }
}

export async function runEvaluation(
  request: EvaluationRequest
): Promise<EvaluationResult[]> {
  const results: EvaluationResult[] = [];

  for (const provider of request.providers) {
    try {
      let planOutput: string;
      let model: string;

      if (provider === "claude") {
        model = "claude-sonnet-4-20250514";
        planOutput = await generatePlanWithClaude({
          prompt: request.prompt,
          testScenario: request.testScenario,
          model,
        });
      } else {
        model = "gpt-4o-mini";
        planOutput = await generatePlanWithOpenAI(
          request.prompt,
          request.testScenario,
          model
        );
      }

      // Evaluate structure
      const structureEval = evaluateStructure(planOutput);

      // Evaluate completeness
      const completenessEval = await evaluateCompleteness(
        planOutput,
        request.testScenario
      );

      // Evaluate clarity
      const clarityEval = await evaluateClarity(planOutput);

      const qualityScores: QualityScores = {
        structure: structureEval.score,
        completeness: completenessEval.score,
        clarity: clarityEval.score,
      };

      const combinedFeedback = [
        `Structure: ${structureEval.feedback}`,
        `Completeness: ${completenessEval.feedback}`,
        `Clarity: ${clarityEval.feedback}`,
      ].join("\n\n");

      results.push({
        provider,
        model,
        planOutput,
        qualityScores,
        assertions: structureEval.assertions,
        feedback: combinedFeedback,
      });
    } catch (error) {
      console.error(`Error evaluating with ${provider}:`, error);
      results.push({
        provider,
        model: provider === "claude" ? "claude-sonnet-4-20250514" : "gpt-4o-mini",
        planOutput: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        qualityScores: {
          structure: 0,
          completeness: 0,
          clarity: 0,
        },
        assertions: {
          hasOverview: false,
          hasPlan: false,
          hasTodos: false,
          validMarkdown: false,
        },
        feedback: `Evaluation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  }

  return results;
}
