import { Button } from "@/components/ui/button";
import { HERO_CONTENT } from "@/lib/portfolio-content";

export function FinalCTA() {
  return (
    <section className="py-16 lg:py-28 bg-card/50">
      <div className="content-container">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight">
            Ready to ship faster?
          </h2>
          <p className="text-lg md:text-xl text-foreground leading-relaxed">
            Let's talk about what's slowing your team down—and how to remove it.
          </p>
          <div className="pt-4">
            <Button asChild size="lg" className="min-w-[200px]">
              <a href={HERO_CONTENT.primaryCta.href}>
                {HERO_CONTENT.primaryCta.label}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

