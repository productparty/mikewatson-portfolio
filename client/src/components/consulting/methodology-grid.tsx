import type { MethodologyCard } from "@/types/portfolio";
import { SiGithub, SiBuymeacoffee } from "react-icons/si";
import { ExternalLink } from "lucide-react";

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
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold mb-3 text-foreground font-headline">
              How I Work
            </h2>
            <p className="text-muted-foreground font-body">
              My toolkit for navigating ambiguity and delivering outcomes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://buymeacoffee.com/Productparty"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFDD00]/10 text-yellow-600 dark:text-[#FFDD00] hover:bg-[#FFDD00]/20 transition-colors text-sm font-medium"
            >
              <SiBuymeacoffee className="text-lg" />
              Buy Me a Coffee
            </a>
            <a
              href="https://github.com/productparty/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
            >
              <SiGithub className="text-lg" />
              GitHub
            </a>
            <a
              href="https://www.passionfroot.me/productparty"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 hover:bg-sky-200 dark:hover:bg-sky-900/50 transition-colors text-sm font-medium"
            >
              <ExternalLink className="size-4" />
              Sponsor / Ads
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="p-8 rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              {/* Title */}
              <h3 className="text-xl font-bold mb-2 text-foreground font-headline">
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
