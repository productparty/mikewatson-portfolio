import { Button } from "@/components/ui/button";
import type { HeroContent } from "@/types/portfolio";

interface HeroSectionProps {
  content: HeroContent;
}

export function HeroSection({ content }: HeroSectionProps) {
  const handleSecondaryClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.querySelector(content.secondaryCta.href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="py-11 lg:py-20">
      <div className="content-container">
        <div className="max-w-[65ch] mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
            {content.headline}
          </h1>

          <div className="space-y-4">
            {content.body.split("\n\n").map((paragraph, idx) => (
              <p
                key={idx}
                className="text-lg md:text-xl text-foreground leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {content.scaleLine && (
            <p className="text-sm md:text-base text-muted-foreground italic">
              {content.scaleLine}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="min-w-[200px]">
              <a href={content.primaryCta.href}>
                {content.primaryCta.label}
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[200px]"
            >
              <a href={content.secondaryCta.href} onClick={handleSecondaryClick}>
                {content.secondaryCta.label}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

