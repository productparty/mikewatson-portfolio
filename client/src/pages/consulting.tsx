import { StickyHeader } from "@/components/consulting/sticky-header";
import { HeroSection } from "@/components/consulting/hero-section";
import { ToolsSection } from "@/components/consulting/tools-section";
import { ExperienceTimeline } from "@/components/consulting/experience-timeline";
import { TechnicalProjects } from "@/components/consulting/technical-projects";
import { SpotlightCaseStudies } from "@/components/consulting/spotlight-case-studies";
import { MethodologyGrid } from "@/components/consulting/methodology-grid";
import { FinalCTA } from "@/components/consulting/final-cta";
import { SeoHead } from "@/components/seo-head";
import { StructuredData } from "@/components/structured-data";
import {
  HERO_CONTENT,
  TOOLS_BUILD_WITH,
  EXPERIENCE_TIMELINE,
  TECHNICAL_PROJECTS,
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
          <ToolsSection tools={TOOLS_BUILD_WITH} />
          <ExperienceTimeline roles={EXPERIENCE_TIMELINE} />
          <TechnicalProjects projects={TECHNICAL_PROJECTS} />
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
