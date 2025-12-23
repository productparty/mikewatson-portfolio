import { CaseStudyCard } from "./case-study-card";
import type { CaseStudy } from "@/types/portfolio";

interface CaseStudiesProps {
  studies: CaseStudy[];
}

export function CaseStudies({ studies }: CaseStudiesProps) {
  const featured = studies.find((s) => s.featured);
  const others = studies.filter((s) => !s.featured);

  return (
    <section id="case-studies" className="py-16 lg:py-28 bg-card/50">
      <div className="content-container">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12 tracking-tight leading-tight">
          Case Studies
        </h2>
        <div className="space-y-8">
          {featured && (
            <div>
              <CaseStudyCard caseStudy={featured} />
            </div>
          )}
          {others.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {others.map((study) => (
                <CaseStudyCard key={study.id} caseStudy={study} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

