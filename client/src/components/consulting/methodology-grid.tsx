import type { MethodologyCard } from "@/types/portfolio";

interface MethodologyGridProps {
  cards: MethodologyCard[];
}

export function MethodologyGrid({ cards }: MethodologyGridProps) {
  return (
    <section
      id="methodology"
      className="py-20 bg-pm-background dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white font-display">
            How I Work
          </h2>
          <p className="text-pm-muted dark:text-slate-400 font-body">
            My toolkit for navigating ambiguity and delivering outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="p-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="size-12 rounded-lg bg-sky-100 dark:bg-sky-900/20 text-sky-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">
                  {card.icon}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white font-display">
                {card.title}
              </h3>

              {/* Quote */}
              <p className="text-slate-600 dark:text-slate-300 mb-4 italic font-body">
                {card.quote}
              </p>

              {/* In Practice */}
              <div className="text-sm bg-pm-background dark:bg-slate-900 p-4 rounded-lg border border-slate-100 dark:border-slate-700 font-body">
                <span className="font-bold text-pm-primary block mb-1">
                  In Practice:
                </span>
                {card.inPractice}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
