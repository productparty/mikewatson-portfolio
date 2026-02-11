import type { CaseStudy } from "@/types/portfolio";

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
}

export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  return (
    <div className="p-8 rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="text-xl md:text-2xl font-bold text-foreground font-display leading-tight flex-1">
          {caseStudy.title}
        </h3>
        {caseStudy.featured && (
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-primary/10 text-primary shrink-0">
            Featured
          </span>
        )}
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 font-body">
            Context
          </p>
          <p className="text-foreground/70 leading-relaxed font-body">
            {caseStudy.context}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 font-body">
            What Changed
          </p>
          <p className="text-foreground/70 leading-relaxed font-body">
            {caseStudy.whatChanged}
          </p>
        </div>
        {/* Results — signature teal callout */}
        <div className="mt-4 p-4 bg-primary/5 border-l-2 border-primary rounded-r-lg">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 font-body">
            Results
          </p>
          <p className="text-foreground leading-relaxed font-body font-medium">
            {caseStudy.results}
          </p>
        </div>
      </div>
    </div>
  );
}
