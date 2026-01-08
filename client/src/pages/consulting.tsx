import { StickyHeader } from "@/components/consulting/sticky-header";
import { HeroSection } from "@/components/consulting/hero-section";
import { ExperienceTimeline } from "@/components/consulting/experience-timeline";
import { SpotlightCaseStudies } from "@/components/consulting/spotlight-case-studies";
import { MethodologyGrid } from "@/components/consulting/methodology-grid";
import { FinalCTA } from "@/components/consulting/final-cta";
import { SeoHead } from "@/components/seo-head";
import { StructuredData } from "@/components/structured-data";
import {
  HERO_CONTENT,
  EXPERIENCE_TIMELINE,
  SPOTLIGHT_CASE_STUDIES,
  METHODOLOGY_CARDS,
  PORTFOLIO_SEO,
} from "@/lib/portfolio-content";

export default function Consulting() {
  return (
    <>
      <SeoHead seo={PORTFOLIO_SEO} />
      <StructuredData />
      <div className="min-h-screen bg-pm-background dark:bg-slate-900 font-display">
        <StickyHeader />
        <main>
          <HeroSection content={HERO_CONTENT} />
          <ExperienceTimeline roles={EXPERIENCE_TIMELINE} />
          <SpotlightCaseStudies caseStudies={SPOTLIGHT_CASE_STUDIES} />
          <MethodologyGrid cards={METHODOLOGY_CARDS} />
          <FinalCTA />
        </main>
        {/* Footer */}
        <footer className="py-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-pm-muted dark:text-slate-500 font-body">
          <p>
            © {new Date().getFullYear()} Mike Watson. Designed with{" "}
            <span className="text-pm-primary">♥</span> for Product Management.
          </p>
        </footer>
      </div>
    </>
  );
}
