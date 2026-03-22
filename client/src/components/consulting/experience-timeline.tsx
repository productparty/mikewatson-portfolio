import type { ExperienceRole } from "@/types/portfolio";

interface ExperienceTimelineProps {
  roles: ExperienceRole[];
}

export function ExperienceTimeline({ roles }: ExperienceTimelineProps) {
  return (
    <section id="experience" className="bg-surface-container-low py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 gap-6 sm:gap-8">
          <div className="space-y-3 sm:space-y-4">
            <span className="font-label text-[10px] text-primary uppercase tracking-[0.3em] font-bold">
              The Journey
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-foreground">
              Professional Trajectory
            </h2>
          </div>
          <div className="max-w-md text-muted-foreground text-base sm:text-lg leading-relaxed font-body">
            Scaling products from zero-to-one and optimizing systems at enterprise scale.
          </div>
        </div>

        {/* Experience cards */}
        <div className="space-y-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className="group bg-card p-6 sm:p-8 rounded-xl ghost-border flex flex-col md:grid md:grid-cols-12 gap-4 sm:gap-8 items-start hover:shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all duration-300"
            >
              {/* Left column: period + title */}
              <div className="md:col-span-3">
                <div className="font-label text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  {role.period}
                </div>
                <div className="font-headline font-bold text-lg sm:text-xl text-primary">
                  {role.title}, {role.company}
                </div>
                <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-label font-bold uppercase tracking-widest bg-surface-container-high text-muted-foreground">
                  {role.industry}
                </span>
              </div>

              {/* Middle column: content */}
              <div className="md:col-span-7 space-y-3">
                {role.bullets ? (
                  <ul className="space-y-2 font-body">
                    {role.bullets.map((bullet, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-foreground/70 flex gap-2.5 leading-relaxed"
                      >
                        <span className="text-primary mt-1 shrink-0">·</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <>
                    <h4 className="text-lg sm:text-xl font-headline font-bold text-foreground">
                      {role.problem}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed font-body text-sm sm:text-base">
                      {role.action}
                    </p>
                    {/* Outcome callout */}
                    <div className="mt-2 p-3 bg-primary/5 rounded-lg border-l-2 border-primary">
                      <span className="font-label text-[10px] tracking-widest uppercase text-primary block mb-1 font-bold">
                        Outcome
                      </span>
                      <span className="font-semibold text-sm text-foreground">
                        {role.highlightedMetric ? (
                          <>
                            {role.outcome.split(role.highlightedMetric)[0]}
                            <span className="text-primary">
                              {role.highlightedMetric}
                            </span>
                            {role.outcome.split(role.highlightedMetric)[1]}
                          </>
                        ) : (
                          role.outcome
                        )}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Right column: arrow */}
              <div className="md:col-span-2 hidden md:flex md:justify-end">
                <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">
                  north_east
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
