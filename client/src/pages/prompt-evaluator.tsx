import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PromptVariationCard } from "@/components/prompt-evaluator/prompt-variation-card";
import { EvaluationHistory } from "@/components/prompt-evaluator/evaluation-history";
import { SeoHead } from "@/components/seo-head";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PROMPT_EVALUATOR_SEO = {
  title: "Prompt Evaluator - Test Plan Generation Prompts",
  description:
    "Evaluate and compare how well different prompts generate MCP-style plans. Test prompts against Claude and OpenAI to improve your prompting skills.",
  canonical: "https://mikewatson.us/prompt-evaluator",
};

interface EvaluationResult {
  provider: "claude" | "openai";
  model: string;
  planOutput: string;
  qualityScores: {
    structure: number;
    completeness: number;
    clarity: number;
  };
  assertions: {
    hasOverview: boolean;
    hasPlan: boolean;
    hasTodos: boolean;
    validMarkdown: boolean;
  };
  feedback: string;
  variationName?: string;
}

export default function PromptEvaluator() {
  const [prompt, setPrompt] = useState("");
  const [testScenario, setTestScenario] = useState("");
  const [providers, setProviders] = useState<("claude" | "openai")[]>(["claude", "openai"]);
  const [variationName, setVariationName] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const { toast } = useToast();

  const handleProviderToggle = (provider: "claude" | "openai") => {
    setProviders((prev) =>
      prev.includes(provider)
        ? prev.filter((p) => p !== provider)
        : [...prev, provider]
    );
  };

  const handleRunEvaluation = async () => {
    if (!prompt.trim() || !testScenario.trim()) {
      toast({
        title: "Missing fields",
        description: "Please provide both a prompt and test scenario.",
        variant: "destructive",
      });
      return;
    }

    if (providers.length === 0) {
      toast({
        title: "No providers selected",
        description: "Please select at least one provider (Claude or OpenAI).",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    setResults([]);

    try {
      const response = await fetch("/api/prompt-evaluator/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          testScenario,
          providers,
          variationName: variationName || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to run evaluation");
      }

      const data = await response.json();
      const formattedResults: EvaluationResult[] = data.map((item: any) => ({
        provider: item.provider,
        model: item.model,
        planOutput: item.result.planOutput,
        qualityScores: item.result.qualityScores,
        assertions: item.result.assertions,
        feedback: item.result.feedback,
        variationName: item.variationName || variationName || undefined,
      }));

      setResults(formattedResults);
      toast({
        title: "Evaluation complete",
        description: `Successfully evaluated ${formattedResults.length} prompt variation(s).`,
      });
    } catch (error) {
      console.error("Evaluation error:", error);
      toast({
        title: "Evaluation failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <>
      <SeoHead seo={PROMPT_EVALUATOR_SEO} />
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Prompt Evaluator</h1>
            <p className="text-muted-foreground">
              Test and compare how well different prompts generate MCP-style
              plans. Evaluate structure, completeness, and clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle>Evaluation Setup</CardTitle>
                <CardDescription>
                  Configure your prompt and test scenario
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">Prompt</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Enter your prompt here... (e.g., 'Create a plan for building a user authentication system')"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scenario">Test Scenario</Label>
                  <Textarea
                    id="scenario"
                    placeholder="Describe the task or requirement... (e.g., 'Build a user authentication system with login, signup, and password reset')"
                    value={testScenario}
                    onChange={(e) => setTestScenario(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="variation">Variation Name (Optional)</Label>
                  <Textarea
                    id="variation"
                    placeholder="A, B, C, etc."
                    value={variationName}
                    onChange={(e) => setVariationName(e.target.value)}
                    rows={1}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Providers</Label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="claude"
                        checked={providers.includes("claude")}
                        onCheckedChange={() => handleProviderToggle("claude")}
                      />
                      <Label htmlFor="claude" className="cursor-pointer">
                        Claude
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="openai"
                        checked={providers.includes("openai")}
                        onCheckedChange={() => handleProviderToggle("openai")}
                      />
                      <Label htmlFor="openai" className="cursor-pointer">
                        OpenAI
                      </Label>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleRunEvaluation}
                  disabled={isRunning}
                  className="w-full"
                  size="lg"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Running Evaluation...
                    </>
                  ) : (
                    "Run Evaluation"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>
                  Understanding the evaluation process
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Evaluation Criteria</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>
                      <strong>Structure (0-5):</strong> Valid markdown, proper
                      sections (overview, plan, todos), correct format
                    </li>
                    <li>
                      <strong>Completeness (0-5):</strong> Covers all
                      requirements from test scenario, actionable todos
                    </li>
                    <li>
                      <strong>Clarity (0-5):</strong> Clear language, specific
                      tasks, proper file references
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Assertions</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Valid Markdown structure</li>
                    <li>Has Overview section</li>
                    <li>Has Plan/Implementation section</li>
                    <li>Has Todos section</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-muted p-3 text-sm">
                  <strong>Tip:</strong> Try multiple prompt variations to see
                  which produces the best plans. Compare results side-by-side
                  to improve your prompting skills.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results and History */}
          <Tabs defaultValue="results" className="space-y-6">
            <TabsList>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="space-y-6">
              {results.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {results.map((result, index) => (
                    <PromptVariationCard
                      key={`${result.provider}-${index}`}
                      {...result}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  No results yet. Run an evaluation to see results here.
                </div>
              )}
            </TabsContent>

            <TabsContent value="history">
              <EvaluationHistory />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
