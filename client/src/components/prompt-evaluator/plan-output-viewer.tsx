import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PlanOutputViewerProps {
  planOutput: string;
  className?: string;
}

export function PlanOutputViewer({
  planOutput,
  className,
}: PlanOutputViewerProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Generated Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{planOutput}</ReactMarkdown>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
