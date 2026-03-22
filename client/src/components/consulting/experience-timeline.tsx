import type { ExperienceRole } from "@/types/portfolio";

interface ExperienceTimelineProps {
  roles: ExperienceRole[];
}

export function ExperienceTimeline({ roles }: ExperienceTimelineProps) {
  return (
    <section id="experience" className="bg-surface-container-low py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="mb-12 sm:mb-16 space-y-3 sm:space-y-4">
          <span className="font-label text-[10px] text-primary uppercase tracking-[0.3em] font-bold">
            The Journey
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-foreground">
            Professional Trajectory
          </h2>
        </div>

        {/* Compact role rows */}
        <div className="space-y-3">
          {roles.map((role) => (
            <div
              key={role.id}
              className="group bg-card px-6 sm:px-8 py-5 sm:py-6 rounded-xl ghost-border flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 hover:shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all duration-300"
            >
              {/* Period */}
              <div className="font-label text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest shrink-0 sm:w-40">
                {role.period}
              </div>

              {/* Title + Company */}
              <div className="flex-1 min-w-0">
                <div className="font-headline font-bold text-base sm:text-lg text-foreground">
                  {role.title}
                  <span className="text-primary">, {role.company}</span>
                </div>
              </div>

              {/* Industry badge */}
              <span className="inline-flex self-start sm:self-center px-3 py-1 rounded-full text-[10px] font-label font-bold uppercase tracking-widest bg-surface-container-high text-muted-foreground shrink-0">
                {role.industry}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
