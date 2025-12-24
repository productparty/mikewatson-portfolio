import type { WorkTogetherStep } from "@/types/portfolio";
import { ArrowRight } from "lucide-react";

interface HowWeWorkProps {
  steps: WorkTogetherStep[];
}

const durations = ["30 min", "2-3 weeks", "4-12 weeks"];

export function HowWeWork({ steps }: HowWeWorkProps) {
  return (
    <section className="py-11 lg:py-20">
      <div className="content-container">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12 tracking-tight leading-tight">
          How We Work Together
        </h2>
        <div className="max-w-5xl mx-auto">
          {/* Desktop Timeline */}
          <div className="hidden md:flex items-start relative">
            {steps.map((step, idx) => (
              <div key={step.step} className="flex-1 relative">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-muted text-foreground flex items-center justify-center font-bold text-xl border-2 border-border mb-4 relative z-10">
                    {step.step}
                  </div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    {durations[idx]}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground tracking-tight leading-tight text-center mb-3 px-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-foreground leading-relaxed text-center px-2">
                    {step.description}
                  </p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="absolute top-8 right-0 translate-x-1/2 z-0">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Stack */}
          <div className="md:hidden space-y-8">
            {steps.map((step, idx) => (
              <div key={step.step} className="flex gap-4">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-muted text-foreground flex items-center justify-center font-bold text-lg border-2 border-border">
                    {step.step}
                  </div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center mt-2">
                    {durations[idx]}
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold text-foreground tracking-tight leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

