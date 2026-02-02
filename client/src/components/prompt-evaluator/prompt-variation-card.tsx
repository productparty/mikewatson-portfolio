import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QualityScoreBadge } from "./quality-score-badge";
import { PlanOutputViewer } from "./plan-output-viewer";
import { CheckCircle2, XCircle } from "lucide-react";

interface Assertions {
  hasOverview: boolean;
  hasPlan: boolean;
  hasTodos: boolean;
  validMarkdown: boolean;
}

interface QualityScores {
  structure: number;
  completeness: number;
  clarity: number;
}

interface PromptVariationCardProps {
  provider: "claude" | "openai";
  model: string;
  planOutput: string;
  qualityScores: QualityScores;
  assertions: Assertions;
  feedback: string;
  variationName?: string;
}

export function PromptVariationCard({
  provider,
  model,
  planOutput,
  qualityScores,
  assertions,
  feedback,
  variationName,
}: PromptVariationCardProps) {
  const averageScore =
    (qualityScores.structure +
      qualityScores.completeness +
      qualityScores.clarity) /
    3;

  const getProviderBadgeColor = () => {
    return provider === "claude" ? "bg-purple-500" : "bg-green-500";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>
              {variationName ? `Variation ${variationName}` : "Evaluation"}
            </CardTitle>
            <Badge className={getProviderBadgeColor()}>
              {provider === "claude" ? "Claude" : "OpenAI"}
            </Badge>
            <Badge variant="outline">{model}</Badge>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {averageScore.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Avg Score</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quality Scores */}
        <div className="space-y-3">
          <QualityScoreBadge
            label="Structure"
            score={qualityScores.structure}
          />
          <QualityScoreBadge
            label="Completeness"
            score={qualityScores.completeness}
          />
          <QualityScoreBadge label="Clarity" score={qualityScores.clarity} />
        </div>

        {/* Assertions */}
        <div className="rounded-lg border p-3 space-y-2">
          <div className="text-sm font-semibold">Assertions</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              {assertions.validMarkdown ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span>Valid Markdown</span>
            </div>
            <div className="flex items-center gap-2">
              {assertions.hasOverview ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span>Has Overview</span>
            </div>
            <div className="flex items-center gap-2">
              {assertions.hasPlan ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span>Has Plan</span>
            </div>
            <div className="flex items-center gap-2">
              {assertions.hasTodos ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span>Has Todos</span>
            </div>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="rounded-lg border p-3 bg-muted/50">
            <div className="text-sm font-semibold mb-2">Feedback</div>
            <div className="text-xs text-muted-foreground whitespace-pre-wrap">
              {feedback}
            </div>
          </div>
        )}

        {/* Plan Output */}
        <PlanOutputViewer planOutput={planOutput} />
      </CardContent>
    </Card>
  );
}
