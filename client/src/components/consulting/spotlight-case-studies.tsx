import type { SpotlightCaseStudy } from "@/types/portfolio";

interface SpotlightCaseStudiesProps {
  caseStudies: SpotlightCaseStudy[];
}

export function SpotlightCaseStudies({ caseStudies }: SpotlightCaseStudiesProps) {
  return (
    <section id="case-studies" className="py-20 sm:py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header with decorative line */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 sm:mb-16 gap-6 sm:gap-8">
          <h2 className="text-3xl sm:text-4xl font-headline font-extrabold tracking-tight text-foreground">
            Case Studies &amp; Impact
          </h2>
          <div className="h-[1px] flex-grow mx-8 bg-outline-variant/20 hidden md:block" />
        </div>

        {/* Case study cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          {caseStudies.map((study) => (
            <div key={study.id} className="group">
              {/* Image with hover zoom */}
              <div className="aspect-video rounded-xl overflow-hidden bg-surface-container mb-6 relative">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${study.imageUrl}')` }}
                  role="img"
                  aria-label={study.imageAlt}
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="space-y-3">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {study.tags.map((tag, i) => (
                    <span
                      key={i}
                      className={`font-label text-[10px] uppercase tracking-widest font-bold ${
                        i === 0 ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {tag}
                      {i < study.tags.length - 1 && (
                        <span className="ml-2 text-outline-variant">&middot;</span>
                      )}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-headline font-bold text-foreground group-hover:text-primary transition-colors">
                  {study.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed font-body text-sm sm:text-base">
                  {study.description}
                </p>

                {/* Key impact callout */}
                <div className="inline-flex items-baseline gap-2 bg-primary/5 px-4 py-2 rounded-full">
                  <span className="font-headline font-bold text-lg sm:text-xl text-primary">
                    {study.keyImpact.value}
                  </span>
                  {study.keyImpact.context && (
                    <span className="text-muted-foreground text-xs sm:text-sm font-body">
                      {study.keyImpact.context}
                    </span>
                  )}
                </div>

                {/* Link */}
                {study.linkUrl && (
                  <div className="pt-2">
                    <a
                      href={study.linkUrl}
                      className="font-label text-xs font-bold tracking-widest uppercase text-primary flex items-center gap-2 group/link hover:gap-3 transition-all"
                    >
                      Read Case Study
                      <span className="material-symbols-outlined text-sm transition-transform group-hover/link:translate-x-1">
                        chevron_right
                      </span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
