import type { ExperienceRole } from "@/types/portfolio";

interface ExperienceTimelineProps {
  roles: ExperienceRole[];
}

export function ExperienceTimeline({ roles }: ExperienceTimelineProps) {
  return (
    <section
      id="experience"
      className="py-20 bg-card"
    >
      <div className="max-w-[960px] mx-auto px-4 sm:px-10">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-3 text-foreground font-display">
            Places I've Worked
          </h2>
          <p className="text-muted-foreground font-body">
            A timeline of problems solved and value delivered.
          </p>
        </div>

        <div className="relative border-l-2 border-border ml-4 md:ml-6 space-y-12">
          {roles.map((role) => (
            <div key={role.id} className="relative pl-8 md:pl-12 group">
              {/* Timeline dot */}
              <div
                className={`absolute -left-[9px] top-0 size-4 rounded-full border-4 transition-colors ${
                  role.isCurrent
                    ? "bg-card border-primary"
                    : "bg-border group-hover:bg-primary group-hover:border-primary group-hover:bg-card border-transparent"
                }`}
              />

              {/* Role card — shadow-only depth, no border */}
              <div className="bg-background p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-default">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground font-display">
                      {role.title}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground font-body">
                      {role.company} · {role.period}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold tracking-wide uppercase bg-muted text-muted-foreground whitespace-nowrap">
                    {role.industry}
                  </span>
                </div>

                {/* Bullets or Problem/Action/Outcome — signature: conversational structure */}
                {role.bullets ? (
                  <ul className="space-y-2 font-body">
                    {role.bullets.map((bullet, idx) => (
                      <li key={idx} className="text-sm text-foreground/70 flex gap-2">
                        <span className="text-primary mt-1 shrink-0">·</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="space-y-3 font-body">
                    <div className="flex gap-3 text-sm">
                      <span className="font-bold min-w-[70px] text-muted-foreground tracking-wide uppercase text-xs pt-0.5">
                        Problem
                      </span>
                      <span className="text-foreground/70">
                        {role.problem}
                      </span>
                    </div>
                    <div className="flex gap-3 text-sm">
                      <span className="font-bold min-w-[70px] text-muted-foreground tracking-wide uppercase text-xs pt-0.5">
                        Action
                      </span>
                      <span className="text-foreground/70">
                        {role.action}
                      </span>
                    </div>
                    {/* Outcome — signature callout echoing the chat response style */}
                    <div className="mt-2 p-3 bg-primary/5 rounded-lg border-l-2 border-primary">
                      <span className="font-bold text-xs tracking-wide uppercase text-primary block mb-1">
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
