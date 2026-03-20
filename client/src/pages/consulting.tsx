import { StickyHeader } from "@/components/consulting/sticky-header";
import { AIHeroSection } from "@/components/consulting/ai-hero-section";
import { ToolsSection } from "@/components/consulting/tools-section";
import { ExperienceTimeline } from "@/components/consulting/experience-timeline";
import { TechnicalProjects } from "@/components/consulting/technical-projects";
import { SpotlightCaseStudies } from "@/components/consulting/spotlight-case-studies";
import { BuiltAndShipped } from "@/components/consulting/built-and-shipped";
import { MethodologyGrid } from "@/components/consulting/methodology-grid";
import { FinalCTA } from "@/components/consulting/final-cta";
import { SeoHead } from "@/components/seo-head";
import { StructuredData } from "@/components/structured-data";
import { PERSONAL_INFO } from "@/lib/constants";
import {
  TOOLS_BUILD_WITH,
  EXPERIENCE_TIMELINE,
  TECHNICAL_PROJECTS,
  SPOTLIGHT_CASE_STUDIES,
  METHODOLOGY_CARDS,
  PORTFOLIO_SEO,
} from "@/lib/portfolio-content";

const FOOTER_LINKS = [
  { label: "LinkedIn", href: PERSONAL_INFO.social.linkedin },
  { label: "Bluesky", href: PERSONAL_INFO.social.bluesky },
  { label: "GitHub", href: PERSONAL_INFO.social.github },
  { label: "Newsletter", href: PERSONAL_INFO.social.newsletter },
] as const;

export default function Consulting() {
  return (
    <>
      <SeoHead seo={PORTFOLIO_SEO} />
      <StructuredData />
      <div className="min-h-screen bg-background font-body">
        <StickyHeader />

        {/* Spacer for fixed nav */}
        <main className="pt-20">
          {/* AI Chat Hero - Primary experience above the fold */}
          <AIHeroSection />

          {/* Portfolio Content - Below the fold */}
          <div id="portfolio-content" className="scroll-mt-20">
            <ToolsSection tools={TOOLS_BUILD_WITH} />
            <ExperienceTimeline roles={EXPERIENCE_TIMELINE} />
            <TechnicalProjects projects={TECHNICAL_PROJECTS} />
            <SpotlightCaseStudies caseStudies={SPOTLIGHT_CASE_STUDIES} />
            <BuiltAndShipped />
            <MethodologyGrid cards={METHODOLOGY_CARDS} />
            <FinalCTA />
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full py-12 border-t border-outline-variant/15 bg-background">
          <div className="flex flex-col md:flex-row justify-between items-center px-6 sm:px-8 max-w-7xl mx-auto gap-8">
            <p className="font-label text-[10px] uppercase tracking-widest text-muted-foreground">
              &copy; {new Date().getFullYear()} Mike Watson. Built with
              Architectural Precision.
            </p>
            <div className="flex items-center gap-8 sm:gap-12">
              {FOOTER_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-label text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-label text-[10px] uppercase tracking-widest text-muted-foreground">
                Available for consulting
              </span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
