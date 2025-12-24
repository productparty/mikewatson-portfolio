import { StickyHeader } from "@/components/consulting/sticky-header";
import { HeroSection } from "@/components/consulting/hero-section";
import { ServicePillars } from "@/components/consulting/service-pillars";
import { HowIThink } from "@/components/consulting/how-i-think";
import { WhyWorkWithMe } from "@/components/consulting/why-work-with-me";
import { HowWeWork } from "@/components/consulting/how-we-work";
import { FinalCTA } from "@/components/consulting/final-cta";
import { SeoHead } from "@/components/seo-head";
import { StructuredData } from "@/components/structured-data";
import {
  HERO_CONTENT,
  SERVICE_PILLARS,
  THOUGHT_LEADERSHIP,
  WORK_TOGETHER_STEPS,
  PORTFOLIO_SEO,
} from "@/lib/portfolio-content";

export default function Consulting() {
  return (
    <>
      <SeoHead seo={PORTFOLIO_SEO} />
      <StructuredData />
      <div className="min-h-screen bg-background">
        <StickyHeader />
        <main>
          <HeroSection content={HERO_CONTENT} />
          <ServicePillars services={SERVICE_PILLARS} />
          <HowIThink articles={THOUGHT_LEADERSHIP} />
          <WhyWorkWithMe />
          <HowWeWork steps={WORK_TOGETHER_STEPS} />
          <FinalCTA />
        </main>
      </div>
    </>
  );
}

