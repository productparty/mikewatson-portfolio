import type { WorkTogetherStep } from "@/types/portfolio";

interface HowWeWorkProps {
  steps: WorkTogetherStep[];
}

export function HowWeWork({ steps }: HowWeWorkProps) {
  return (
    <section className="py-16 lg:py-28">
      <div className="content-container">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12 tracking-tight leading-tight">
          How We Work Together
        </h2>
        <div className="max-w-3xl mx-auto space-y-8">
          {steps.map((step) => (
            <div key={step.step} className="flex gap-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted text-foreground flex items-center justify-center font-bold text-lg border border-border">
                {step.step}
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight leading-tight">
                  {step.title}
                </h3>
                <p className="text-base md:text-lg text-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

