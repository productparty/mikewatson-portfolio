export interface HeroContent {
  headline: string;
  subheadline: string;
  badges: { icon: string; text: string; variant: "primary" | "secondary" }[];
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  floatingMetric: { label: string; value: string };
}

export interface ExperienceRole {
  id: string;
  title: string;
  company: string;
  period: string;
  industry: string;
  icon: string;
  problem: string;
  action: string;
  outcome: string;
  highlightedMetric?: string;
  isCurrent?: boolean;
}

export interface SpotlightCaseStudy {
  id: string;
  tags: string[];
  title: string;
  description: string;
  keyImpact: { label: string; value: string; context?: string };
  imageUrl: string;
  imageAlt: string;
  linkUrl?: string;
}

export interface MethodologyCard {
  id: string;
  icon: string;
  title: string;
  quote: string;
  inPractice: string;
}

export interface ServicePillar {
  id: string;
  title: string;
  bringMeIn: string;
  bullets: string[];
}

export interface ThoughtLeadershipLink {
  title: string;
  url: string;
  takeaway: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  context: string;
  whatChanged: string;
  results: string;
  featured?: boolean;
}

export interface WorkTogetherStep {
  step: number;
  title: string;
  description: string;
}

export interface PortfolioSEO {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
}
