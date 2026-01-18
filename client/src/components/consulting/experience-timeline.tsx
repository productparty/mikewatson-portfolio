import type { ExperienceRole } from "@/types/portfolio";

interface ExperienceTimelineProps {
  roles: ExperienceRole[];
}

export function ExperienceTimeline({ roles }: ExperienceTimelineProps) {
  return (
    <section
      id="experience"
      className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800"
    >
      <div className="max-w-[960px] mx-auto px-4 sm:px-10">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-3 text-slate-900 dark:text-white font-display">
            <span className="material-symbols-outlined text-pm-primary text-4xl">
              work_history
            </span>
            Places I've Worked
          </h2>
          <p className="text-pm-muted dark:text-slate-400 font-body">
            A timeline of problems solved and value delivered.
          </p>
        </div>

        <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 md:ml-6 space-y-12">
          {roles.map((role, index) => (
            <div key={role.id} className="relative pl-8 md:pl-12 group">
              {/* Timeline dot */}
              <div
                className={`absolute -left-[9px] top-0 size-4 rounded-full border-4 transition-colors ${
                  role.isCurrent
                    ? "bg-white dark:bg-slate-900 border-pm-primary"
                    : "bg-slate-300 dark:bg-slate-600 group-hover:bg-pm-primary border-transparent group-hover:border-pm-primary group-hover:bg-white dark:group-hover:bg-slate-900"
                }`}
              />

              {/* Role card */}
              <div className="bg-pm-background dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:-translate-y-1 hover:border-pm-primary transition-all duration-300 cursor-default">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-lg bg-white dark:bg-white/5 shadow-sm border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-white">
                      <span className="material-symbols-outlined text-2xl">
                        {role.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                        {role.title}
                      </h3>
                      <p className="text-sm font-medium text-pm-muted font-body">
                        {role.company} • {role.period}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 whitespace-nowrap">
                    {role.industry}
                  </span>
                </div>

                {/* Bullets or Problem/Action/Outcome */}
                {role.bullets ? (
                  <ul className="space-y-2 font-body">
                    {role.bullets.map((bullet, idx) => (
                      <li key={idx} className="text-sm text-slate-600 dark:text-slate-300 flex gap-2">
                        <span className="text-pm-primary mt-1">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="space-y-3 font-body">
                    <div className="flex gap-3 text-sm">
                      <span className="font-bold min-w-[70px] text-pm-muted">
                        Problem:
                      </span>
                      <span className="text-slate-600 dark:text-slate-300">
                        {role.problem}
                      </span>
                    </div>
                    <div className="flex gap-3 text-sm">
                      <span className="font-bold min-w-[70px] text-pm-muted">
                        Action:
                      </span>
                      <span className="text-slate-600 dark:text-slate-300">
                        {role.action}
                      </span>
                    </div>
                    <div className="flex gap-3 text-sm pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span className="font-bold min-w-[70px] text-pm-primary">
                        Outcome:
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {role.highlightedMetric ? (
                          <>
                            {role.outcome.split(role.highlightedMetric)[0]}
                            <span className="text-pm-primary">
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
