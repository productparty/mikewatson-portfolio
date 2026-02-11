import type { HeroContent } from "@/types/portfolio";
import { PERSONAL_INFO } from "@/lib/constants";

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

  const handlePrimaryClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const target = document.querySelector(content.primaryCta.href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="relative w-full py-16 md:py-24 lg:py-32 px-4 sm:px-10 max-w-[1280px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Content */}
        <div className="flex flex-col gap-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-3">
            {content.badges.map((badge, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                  badge.variant === "primary"
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800"
                }`}
              >
                <span className="material-symbols-outlined text-sm mr-1">
                  {badge.icon}
                </span>
                {badge.text}
              </span>
            ))}
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white font-display">
            {content.headline}
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed font-body">
            {content.subheadline}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              onClick={handlePrimaryClick}
              className="flex h-12 items-center justify-center rounded-lg px-8 bg-primary hover:bg-primary/85 text-white text-base font-bold shadow-lg shadow-primary/30 transition-transform hover:scale-[1.02] font-display"
            >
              {content.primaryCta.label}
            </button>
            <a
              href={content.secondaryCta.href}
              onClick={handleSecondaryClick}
              className="flex h-12 items-center justify-center rounded-lg px-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-900 dark:text-white text-base font-bold transition-colors font-display"
            >
              {content.secondaryCta.label}
            </a>
          </div>
        </div>

        {/* Right: Headshot with floating metric */}
        <div className="relative w-full aspect-square max-w-md mx-auto lg:ml-auto">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-sky-500/20 rounded-full blur-2xl" />

          {/* Photo container */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 ease-out">
            <img
              src={PERSONAL_INFO.avatar}
              alt="Mike Watson - Senior Product Manager"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Floating metric card */}
          <div
            className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-100 dark:border-white/5 max-w-[200px] hidden sm:block animate-bounce"
            style={{ animationDuration: "3s" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold font-body">
                  {content.floatingMetric.label}
                </p>
                <p className="text-lg font-black text-slate-900 dark:text-white font-display">
                  {content.floatingMetric.value}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
