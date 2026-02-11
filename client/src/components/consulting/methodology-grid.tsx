import type { MethodologyCard } from "@/types/portfolio";

interface MethodologyGridProps {
  cards: MethodologyCard[];
}

export function MethodologyGrid({ cards }: MethodologyGridProps) {
  return (
    <section
      id="methodology"
      className="py-20 bg-background"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-3 text-foreground font-display">
            How I Work
          </h2>
          <p className="text-muted-foreground font-body">
            My toolkit for navigating ambiguity and delivering outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="p-8 rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              {/* Title */}
              <h3 className="text-xl font-bold mb-2 text-foreground font-display">
                {card.title}
              </h3>

              {/* Quote */}
              <p className="text-foreground/70 mb-4 italic font-body">
                {card.quote}
              </p>

              {/* In Practice — signature: callout echoing chat response style */}
              <div className="text-sm bg-primary/5 p-4 rounded-lg border-l-2 border-primary font-body">
                <span className="font-bold text-primary text-xs tracking-wide uppercase block mb-1">
                  In Practice
                </span>
                <span className="text-foreground/70">{card.inPractice}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
