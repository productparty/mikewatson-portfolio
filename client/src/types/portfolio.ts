export interface HeroContent {
  headline: string;
  body: string;
  scaleLine?: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
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

