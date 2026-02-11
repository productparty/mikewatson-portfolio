import { CaseStudyCard } from "./case-study-card";
import type { CaseStudy } from "@/types/portfolio";

interface CaseStudiesProps {
  studies: CaseStudy[];
}

export function CaseStudies({ studies }: CaseStudiesProps) {
  const featured = studies.find((s) => s.featured);
  const others = studies.filter((s) => !s.featured);

  return (
    <section id="case-studies" className="py-20 px-4 sm:px-10 max-w-[1280px] mx-auto">
      <div>
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-3 text-foreground font-display">
            Case Studies
          </h2>
          <p className="text-muted-foreground font-body">
            Real outcomes from strategic product work.
          </p>
        </div>
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
      </div>
    </section>
  );
}

