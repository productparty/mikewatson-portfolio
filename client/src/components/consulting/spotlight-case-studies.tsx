import type { SpotlightCaseStudy } from "@/types/portfolio";

interface SpotlightCaseStudiesProps {
  caseStudies: SpotlightCaseStudy[];
}

export function SpotlightCaseStudies({ caseStudies }: SpotlightCaseStudiesProps) {
  return (
    <section id="case-studies" className="py-20 px-4 sm:px-10 max-w-[1280px] mx-auto">
      <div className="mb-16 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-3 text-foreground font-display">
          Spotlight Case Studies
        </h2>
        <p className="text-muted-foreground font-body">
          Deep dives into complex challenges. From ambiguity to shipped value.
        </p>
      </div>

      <div className="flex flex-col gap-20">
        {caseStudies.map((study, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={study.id}
              className="group grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
            >
              {/* Image — shadow-only depth */}
              <div
                className={`relative overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-muted aspect-video ${
                  isEven ? "order-2 lg:order-1" : "order-2"
                }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${study.imageUrl}')` }}
                  aria-label={study.imageAlt}
                />
                <div className="absolute inset-0 bg-foreground/5 group-hover:bg-transparent transition-colors" />
              </div>

              {/* Content */}
              <div
                className={`flex flex-col gap-4 ${
                  isEven ? "order-1 lg:order-2" : "order-1"
                }`}
              >
                {/* Tags — tertiary typography: small, tracked, uppercase */}
                <div className="flex flex-wrap gap-2">
                  {study.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                        tagIndex === 0
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight font-display">
                  {study.title}
                </h3>

                {/* Description — secondary typography */}
                <p className="text-foreground/70 leading-relaxed font-body">
                  {study.description}
                </p>

                {/* Key Impact — signature: callout echoing chat response style */}
                <div className="mt-4 p-4 bg-primary/5 border-l-2 border-primary rounded-r-lg">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 font-body">
                    {study.keyImpact.label}
                  </p>
                  <p className="text-2xl font-black text-foreground font-display">
                    {study.keyImpact.value}{" "}
                    {study.keyImpact.context && (
                      <span className="text-base font-normal text-muted-foreground">
                        {study.keyImpact.context}
                      </span>
                    )}
                  </p>
                </div>

                {/* Link */}
                {study.linkUrl && (
                  <a
                    href={study.linkUrl}
                    className="inline-flex items-center text-primary font-bold hover:underline mt-2 font-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                  >
                    Read Case Study{" "}
                    <span className="material-symbols-outlined text-sm ml-1">
                      arrow_forward
                    </span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
