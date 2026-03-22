import type { MethodologyCard } from "@/types/portfolio";
import { SiGithub, SiBuymeacoffee } from "react-icons/si";
import { ExternalLink } from "lucide-react";

interface MethodologyGridProps {
  cards: MethodologyCard[];
}

const METHODOLOGY_ICONS: Record<string, string> = {
  "framework-first": "architecture",
  "data-informed": "query_stats",
  "alignment-driven": "hub",
  "first-principles": "emergency",
};

export function MethodologyGrid({ cards }: MethodologyGridProps) {
  return (
    <section id="methodology" className="bg-primary py-20 sm:py-24 text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-12 sm:mb-20 space-y-4 sm:space-y-6">
          <span className="font-label text-[10px] text-primary-fixed uppercase tracking-[0.3em] font-bold">
            The Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-extrabold tracking-tight">
            A framework for clarity.
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {cards.map((card, index) => {
            // Alternate wide (2-col) and narrow (1-col)
            const isWide = index % 3 === 0;
            const icon = METHODOLOGY_ICONS[card.id] || "lightbulb";

            return (
              <div
                key={card.id}
                className={`p-8 sm:p-10 rounded-xl space-y-4 sm:space-y-6 ${
                  isWide
                    ? "md:col-span-2 bg-primary-container/80"
                    : "bg-primary-container"
                }`}
              >
                <span
                  className="material-symbols-outlined text-3xl sm:text-4xl text-primary-fixed"
                >
                  {icon}
                </span>
                <h4 className="text-xl sm:text-2xl font-headline font-bold">
                  {card.title}
                </h4>
                <p className="text-primary-foreground/70 leading-relaxed font-body text-sm sm:text-base">
                  {card.quote}
                </p>
                {/* In Practice callout */}
                <div className="text-sm bg-primary-foreground/5 p-4 rounded-lg border-l-2 border-primary-fixed font-body">
                  <span className="font-label text-[10px] tracking-widest uppercase text-primary-fixed block mb-1 font-bold">
                    In Practice
                  </span>
                  <span className="text-primary-foreground/60">
                    {card.inPractice}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Social links row */}
        <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://buymeacoffee.com/Productparty"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 transition-colors font-label text-xs uppercase tracking-widest"
          >
            <SiBuymeacoffee className="text-lg" />
            Buy Me a Coffee
          </a>
          <a
            href="https://github.com/productparty/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 transition-colors font-label text-xs uppercase tracking-widest"
          >
            <SiGithub className="text-lg" />
            GitHub
          </a>
          <a
            href="https://www.passionfroot.me/productparty"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 transition-colors font-label text-xs uppercase tracking-widest"
          >
            <ExternalLink className="size-4" />
            Sponsor / Ads
          </a>
        </div>
      </div>
    </section>
  );
}
