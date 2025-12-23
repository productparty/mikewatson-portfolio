import type {
  HeroContent,
  ServicePillar,
  ThoughtLeadershipLink,
  CaseStudy,
  WorkTogetherStep,
  PortfolioSEO,
} from "@/types/portfolio";

export const HERO_CONTENT: HeroContent = {
  headline: "Your team knows what to build. They just can't seem to ship it.",
  body: "The problem usually isn't talent or effort. It's the invisible friction between strategy and delivery—handoffs that break, context that gets lost, and coordination work that quietly compounds until shipping anything feels heavier than it should.\n\nI help product and engineering leaders identify what's slowing teams down and remove it—without adding process, ceremony, or permanent headcount.",
  scaleLine:
    "I'm most useful to teams that have outgrown founder-led product but haven't yet built durable product operations.",
  primaryCta: {
    label: "Book a 30-minute intro",
    href: "mailto:mwatson1983@gmail.com?subject=Consulting%20Inquiry",
  },
  secondaryCta: {
    label: "Read how I think",
    href: "#how-i-think",
  },
};

export const SERVICE_PILLARS: ServicePillar[] = [
  {
    id: "product-leadership",
    title: "Product Leadership & Direction",
    bringMeIn:
      "You bring me in when priorities compete, stakeholders aren't aligned, or the roadmap exists but no one believes it.",
    bullets: [
      "Roadmaps that survive contact with reality",
      "Stakeholders who agree on what \"done\" means",
      "Teams who know what's next and why it matters",
    ],
  },
  {
    id: "delivery-execution",
    title: "Delivery & Execution",
    bringMeIn:
      "You bring me in when sprints slip, dependencies multiply, or \"we'll ship next week\" has become a running joke.",
    bullets: [
      "Releases that actually happen",
      "Fewer surprises, less scrambling",
      "A plan teams trust because it's based on reality",
    ],
  },
  {
    id: "product-operations",
    title: "Product Operations & Scale",
    bringMeIn:
      "You bring me in when headcount goes up but velocity goes down—or when \"how we work\" has become the work.",
    bullets: [
      "Decisions that don't require six people in a room",
      "Visibility without status-update theater",
      "Systems that help teams move faster, not slower",
    ],
  },
];

export const THOUGHT_LEADERSHIP: ThoughtLeadershipLink[] = [
  {
    title: "Why Users Ignore Your Best Features",
    url: "https://www.productparty.us/p/why-users-ignore-your-best-features",
    takeaway:
      "Adoption isn't a launch problem; it's usually a clarity and relevance problem.",
  },
  {
    title: "The Anti-Pattern Playbook",
    url: "https://www.productparty.us/p/the-anti-pattern-playbook",
    takeaway:
      "Expensive delivery failures have early signals; most teams ignore them.",
  },
  {
    title: "You Should Join the Feature Diet",
    url: "https://www.productparty.us/p/you-should-join-the-feature-diet",
    takeaway:
      "Roadmap restraint is a competitive advantage, not a lack of ambition.",
  },
  {
    title: "Why Your Power Users Are Your Biggest…",
    url: "https://www.productparty.us/p/why-your-power-users-are-your-biggest",
    takeaway:
      "Power users can distort priorities and quietly tax the mainstream experience.",
  },
  {
    title: "Are You Paying the Shadow Work Tax?",
    url: "https://www.productparty.us/p/are-you-paying-the-shadow-work-tax",
    takeaway:
      "Invisible coordination work compounds until builders spend half their time managing.",
  },
  {
    title: "\"It Depends\" Isn't a Cop-Out",
    url: "https://www.productparty.us/p/it-depends-isnt-a-cop-out",
    takeaway:
      "Context beats dogma; good decisions are defensible tradeoffs.",
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "stalled-initiative",
    title: "Stalled initiative → predictable delivery",
    context:
      "Multi-team, cross-system program with competing priorities",
    whatChanged:
      "Clarified scope, defined decision rights, reduced coordination overhead, rebuilt stakeholder trust",
    results:
      "Improved predictability, fewer escalations, clearer ownership",
    featured: true,
  },
];

export const WORK_TOGETHER_STEPS: WorkTogetherStep[] = [
  {
    step: 1,
    title: "We start with a 30-minute intro",
    description:
      "You share the challenge, I ask questions, we decide if there's a fit.",
  },
  {
    step: 2,
    title: "I diagnose the friction",
    description:
      "I observe how work flows (or doesn't), identify bottlenecks, and map where context gets lost.",
  },
  {
    step: 3,
    title: "We remove what's slowing you down",
    description:
      "Together, we fix the real problems—not add process. You ship faster, teams feel lighter.",
  },
];

export const PORTFOLIO_SEO: PortfolioSEO = {
  title: "Michael Watson | Product & Delivery Expert for Hire",
  description:
    "I help product and engineering leaders identify what's slowing teams down and remove it—without adding process, ceremony, or permanent headcount.",
  canonical: "https://mikewatsonusportfolio.vercel.app/",
};

