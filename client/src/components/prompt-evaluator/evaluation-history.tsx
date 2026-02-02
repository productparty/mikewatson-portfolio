import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface EvaluationHistoryItem {
  id: number;
  promptText: string;
  provider: string;
  model: string;
  testScenario: string;
  variationName: string | null;
  createdAt: string;
  results: Array<{
    qualityScores: {
      structure: number;
      completeness: number;
      clarity: number;
    };
  }>;
}

export function EvaluationHistory() {
  const [history, setHistory] = useState<EvaluationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/prompt-evaluator/history?limit=20");
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evaluation History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            Loading history...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evaluation History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            No evaluations yet. Run your first evaluation to see history here.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evaluation History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {history.map((item) => {
              const avgScore =
                item.results.length > 0
                  ? item.results.reduce((acc, result) => {
                      const scores = result.qualityScores;
                      const avg =
                        (scores.structure +
                          scores.completeness +
                          scores.clarity) /
                        3;
                      return acc + avg;
                    }, 0) / item.results.length
                  : 0;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          className={
                            item.provider === "claude"
                              ? "bg-purple-500"
                              : "bg-green-500"
                          }
                        >
                          {item.provider}
                        </Badge>
                        {item.variationName && (
                          <Badge variant="outline">
                            {item.variationName}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(item.createdAt), "MMM d, yyyy HH:mm")}
                        </span>
                      </div>
                      <p className="text-sm font-medium line-clamp-1">
                        {item.promptText.substring(0, 100)}
                        {item.promptText.length > 100 ? "..." : ""}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {item.testScenario.substring(0, 80)}
                        {item.testScenario.length > 80 ? "..." : ""}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold">
                        {avgScore.toFixed(1)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Avg Score
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
