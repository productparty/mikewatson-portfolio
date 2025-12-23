import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CaseStudy } from "@/types/portfolio";

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
}

export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  return (
    <Card className="border border-border shadow-none bg-card">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-xl md:text-2xl text-foreground tracking-tight leading-tight flex-1">
            {caseStudy.title}
          </CardTitle>
          {caseStudy.featured && (
            <Badge variant="secondary" className="shrink-0">
              Featured
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Context
          </p>
          <p className="text-base text-foreground leading-relaxed">
            {caseStudy.context}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            What Changed
          </p>
          <p className="text-base text-foreground leading-relaxed">
            {caseStudy.whatChanged}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Results
          </p>
          <p className="text-base text-foreground leading-relaxed">
            {caseStudy.results}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

