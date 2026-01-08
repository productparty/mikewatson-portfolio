import type {
  HeroContent,
  ExperienceRole,
  SpotlightCaseStudy,
  MethodologyCard,
  PortfolioSEO,
  ThoughtLeadershipLink,
} from "@/types/portfolio";

export const HERO_CONTENT: HeroContent = {
  headline: "Building products that solve real problems.",
  subheadline:
    "Senior Product Manager specialized in data-driven strategy and user-centric design. I help companies turn complex ambiguity into clear, revenue-generating roadmaps.",
  badges: [
    { icon: "verified", text: "14+ Years Experience", variant: "primary" },
    { icon: "trending_up", text: "Fintech & Enterprise", variant: "secondary" },
  ],
  primaryCta: {
    label: "Let's Talk",
    href: "#contact",
  },
  secondaryCta: {
    label: "View Work",
    href: "#case-studies",
  },
  floatingMetric: {
    label: "Business Impact",
    value: "$15M+",
  },
};

export const EXPERIENCE_TIMELINE: ExperienceRole[] = [
  {
    id: "pet-supplies-plus",
    title: "Senior Product Manager",
    company: "Pet Supplies Plus",
    period: "Apr 2025 - Present",
    industry: "Retail",
    icon: "storefront",
    problem:
      "Strategic initiatives stalled across multiple teams with no structured delivery framework in place.",
    action:
      "Implementing structured delivery frameworks across 6 teams, realigning stalled initiatives and establishing cross-functional coordination.",
    outcome: "Delivery framework adoption across 6 teams",
    isCurrent: true,
  },
  {
    id: "credit-acceptance",
    title: "Senior Product Owner",
    company: "Credit Acceptance",
    period: "Sep 2022 - Mar 2025",
    industry: "Fintech",
    icon: "payments",
    problem:
      "Low enrollment in underperforming states; outdated Oracle CRM hurting 450-person sales team productivity.",
    action:
      'Led "Test Drive" pilot with A/B testing methodology; modernized Oracle CRM; transformed multiple waterfall teams to Agile with Jira implementation.',
    outcome:
      "33% enrollment increase, nationwide rollout to 450+ dealerships; 10% satisfaction improvement",
  },
  {
    id: "auto-approve",
    title: "Senior Product Manager",
    company: "Auto Approve",
    period: "Jul 2021 - Sep 2022",
    industry: "Fintech",
    icon: "directions_car",
    problem:
      "Overwhelming customer inquiries draining support resources; minimal e-notary adoption at just 10 uses/month.",
    action:
      "Launched Intercom chat and AI chatbot platforms; refined e-notary UI/UX addressing technical barriers; unified 3 vendor backlogs into single Jira system.",
    outcome:
      "Reduced 2,500+ calls/month; 3,000%+ e-notary adoption growth in 3 months",
  },
  {
    id: "newrez",
    title: "Digital Product Manager",
    company: "Newrez",
    period: "Nov 2020 - Jul 2021",
    industry: "Fintech",
    icon: "home",
    problem:
      "Low lead conversions across 20+ loan brands; high BBB complaints for platform serving 800K users.",
    action:
      "Refined form design with analytics-driven improvements; introduced advanced analytics for portal pain point identification; coordinated compliance updates across 20+ companies.",
    outcome: "10% conversion increase; 33% reduction in BBB complaints",
  },
  {
    id: "rocket-mortgage",
    title: "Product Owner",
    company: "Rocket Mortgage",
    period: "Jun 2013 - Nov 2020",
    industry: "Fintech",
    icon: "rocket_launch",
    problem:
      "Unknown Hispanic market lead demand; limited compliance insights from 1% manual call review coverage.",
    action:
      "Built demand measurement capabilities into LOS; scaled speech analytics from 1% to 10,000+ daily call hours; developed Salesforce migration strategy for 400 team members.",
    outcome:
      "300% more Hispanic market leads with dedicated 50-person team; formed 10-member QA team",
  },
  {
    id: "accenture",
    title: "Consulting Analyst",
    company: "Accenture",
    period: "Jan 2011 - Jun 2013",
    industry: "Enterprise",
    icon: "corporate_fare",
    problem:
      "Global scheduling complexity for 250,000+ employee Fortune 500 company; manual Excel workflows consuming hundreds of hours.",
    action:
      "Designed and launched global scheduling platform with 15-person India call center; automated SAP project workflows and reporting dashboards in SharePoint.",
    outcome:
      "Saved 1,000+ hours on SAP project; enabled C-suite video conferencing globally",
  },
];

export const SPOTLIGHT_CASE_STUDIES: SpotlightCaseStudy[] = [
  {
    id: "e-notary-transformation",
    tags: ["Discovery", "UX/UI"],
    title: "E-Notary Adoption Transformation",
    description:
      "Identified that minimal adoption (10 uses/month) stemmed from UX friction, not product-market fit. Led UX research and iterative refinements to address technical barriers and streamline the notarization flow.",
    keyImpact: {
      label: "Key Impact",
      value: "3,000%+ Growth",
      context: "in 3 months",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    imageAlt: "Dashboard analytics interface showing growth metrics",
  },
  {
    id: "dealer-test-drive",
    tags: ["Delivery", "A/B Testing"],
    title: "Dealer Test Drive Pilot",
    description:
      "Diagnosed underperforming state enrollment through data analysis. Designed A/B test methodology to optimize enrollment flows and identify state-specific barriers, leading to nationwide adoption.",
    keyImpact: {
      label: "Key Impact",
      value: "33% Enrollment Increase",
      context: "450+ dealerships",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    imageAlt: "Mobile app interface showing enrollment dashboard",
  },
  {
    id: "hispanic-market-initiative",
    tags: ["Stakeholder Mgmt", "Scale"],
    title: "Hispanic Market Growth Initiative",
    description:
      "Uncovered hidden demand by building measurement capabilities into the LOS. Championed business case that revealed 300% higher volume than expected, leading to dedicated 50-person Sales team within 6 months.",
    keyImpact: {
      label: "Key Impact",
      value: "300% Lead Increase",
      context: "50-person team formed",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    imageAlt: "Team collaborating around whiteboard with sticky notes",
  },
];

export const METHODOLOGY_CARDS: MethodologyCard[] = [
  {
    id: "discovery-first",
    icon: "search",
    title: "Discovery First",
    quote: '"I don\'t guess, I validate."',
    inPractice:
      "Before launching the Hispanic Market Growth Initiative, I built measurement into the LOS to quantify actual demand rather than relying on assumptions. The data revealed 300% higher volume than expected.",
  },
  {
    id: "agile-delivery",
    icon: "rocket_launch",
    title: "Agile Delivery",
    quote: '"Shipping value, not just code."',
    inPractice:
      "At Credit Acceptance, I transformed multiple waterfall teams to Agile by migrating backlogs, implementing Jira, and refining sprint workflows. Delivery timelines improved within the first quarter.",
  },
  {
    id: "data-informed",
    icon: "analytics",
    title: "Data Informed",
    quote: '"Data tells me what, qualitative tells me why."',
    inPractice:
      "At Newrez, I introduced advanced analytics to identify portal pain points. When BBB complaints spiked, the data showed exactly where users struggled, enabling targeted fixes that reduced complaints by 33%.",
  },
  {
    id: "stakeholder-alignment",
    icon: "groups",
    title: "Stakeholder Alignment",
    quote: '"No surprises, clear trade-offs."',
    inPractice:
      "The Rocket Mortgage Salesforce migration required buy-in from 400 team members across 20+ legacy apps. Weekly syncs and transparent roadmaps kept stakeholders aligned through a 6-month transition.",
  },
];

export const THOUGHT_LEADERSHIP: ThoughtLeadershipLink[] = [
  {
    title: "Why Users Ignore Your Best Features",
    url: "https://www.productparty.us/p/why-users-ignore-your-best-features",
    takeaway:
      "Adoption isn't a launch problem—it's usually a 'we built something no one asked for' problem.",
  },
  {
    title: "The Anti-Pattern Playbook",
    url: "https://www.productparty.us/p/the-anti-pattern-playbook",
    takeaway:
      "Expensive delivery failures have early signals; most teams ignore them until it's too late.",
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
      "Invisible coordination work compounds until builders spend half their time managing instead of building.",
  },
  {
    title: '"It Depends" Isn\'t a Cop-Out',
    url: "https://www.productparty.us/p/it-depends-isnt-a-cop-out",
    takeaway:
      "Context beats dogma; good decisions are defensible tradeoffs, not framework compliance.",
  },
];

export const PORTFOLIO_SEO: PortfolioSEO = {
  title: "Senior Product Manager",
  description:
    "Senior Product Manager building products that solve real problems. 14+ years in fintech and enterprise software. Data-driven strategy, user-centric design.",
  canonical: "https://mikewatson.us/consulting",
};

export const CONTACT_INFO = {
  email: "mwatson1983@gmail.com",
  linkedin: "https://www.linkedin.com/in/michaeljameswatson/",
  resumePdf: "https://mikewatson.us/Michael_Watson_Resume_January_2026.pdf",
  ctaHeadline: "Ready to solve complex problems together?",
  ctaSubheadline:
    "I'm currently open to Senior Product Manager roles and strategic consulting engagements across any industry. Let's discuss how I can help your organization ship better products.",
};
