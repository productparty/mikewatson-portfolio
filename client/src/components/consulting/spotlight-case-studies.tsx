import type { SpotlightCaseStudy } from "@/types/portfolio";

interface SpotlightCaseStudiesProps {
  caseStudies: SpotlightCaseStudy[];
}

export function SpotlightCaseStudies({ caseStudies }: SpotlightCaseStudiesProps) {
  return (
    <section id="case-studies" className="py-20 px-4 sm:px-10 max-w-[1280px] mx-auto">
      <div className="mb-16 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white font-display">
          Spotlight Case Studies
        </h2>
        <p className="text-pm-muted dark:text-slate-400 font-body">
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
              {/* Image */}
              <div
                className={`relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-slate-100 dark:bg-white/5 aspect-video ${
                  isEven ? "order-2 lg:order-1" : "order-2"
                }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${study.imageUrl}')` }}
                  aria-label={study.imageAlt}
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors" />
              </div>

              {/* Content */}
              <div
                className={`flex flex-col gap-4 ${
                  isEven ? "order-1 lg:order-2" : "order-1"
                }`}
              >
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {study.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                        tagIndex === 0
                          ? "bg-pm-primary/10 text-pm-primary"
                          : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight font-display">
                  {study.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                  {study.description}
                </p>

                {/* Key Impact */}
                <div className="mt-4 p-4 bg-pm-primary/5 dark:bg-white/5 border-l-4 border-pm-primary rounded-r-lg">
                  <p className="text-sm font-bold text-pm-muted uppercase mb-1 font-body">
                    {study.keyImpact.label}
                  </p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white font-display">
                    {study.keyImpact.value}{" "}
                    {study.keyImpact.context && (
                      <span className="text-base font-normal text-slate-500 dark:text-slate-400">
                        {study.keyImpact.context}
                      </span>
                    )}
                  </p>
                </div>

                {/* Link */}
                {study.linkUrl && (
                  <a
                    href={study.linkUrl}
                    className="inline-flex items-center text-pm-primary font-bold hover:underline mt-2 font-body"
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
