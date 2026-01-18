import type {
  HeroContent,
  ExperienceRole,
  SpotlightCaseStudy,
  MethodologyCard,
  PortfolioSEO,
  ThoughtLeadershipLink,
  TechnicalProject,
} from "@/types/portfolio";

export const HERO_CONTENT: HeroContent = {
  headline: "Building products and systems that ship.",
  subheadline:
    "Senior Product Manager who builds and ships. I create working products using React and AI development tools (Cursor, Claude), design automation systems that eliminate manual work, and turn stalled initiatives into launched products. 10+ years in fintech and enterprise software.",
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
      "Established end-to-end product intake system where none existed—creating epic/feature/story framework, automated reporting dashboard, and stakeholder alignment process. Took over company's #1 strategic priority (customer data modernization affecting 18M customers) after it stalled, coordinating 7 cross-functional teams to pilot deployment.",
    outcome:
      "Currently managing 5 of top 10 company initiatives; eliminated manual status reporting; piloted customer data modernization project",
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
      'Led "Test Drive" pilot with A/B testing methodology; modernized Oracle CRM; transformed multiple waterfall teams to Agile by rolling out Jira.',
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
      "Deployed Intercom chat and AI chatbot platforms; refined e-notary UI/UX addressing technical barriers; unified 3 vendor backlogs into single Jira system.",
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
    bullets: [
      "Built demand measurement into LOS, uncovering 300% more Hispanic market leads than expected—leading to 50-person bilingual sales team within 6 months",
      "Scaled speech analytics from 1% manual review to analyzing 10,000 daily call hours, enabling compliance insights and 10-member quality team formation",
      "Led Salesforce migration strategy affecting 5,000 team members across 20+ legacy applications, delivering first MVP within 1 month",
    ],
  },
  {
    id: "accenture",
    title: "Consulting Analyst",
    company: "Accenture",
    period: "Jan 2011 - Jun 2013",
    industry: "Enterprise",
    icon: "corporate_fare",
    bullets: [
      "Designed and launched global scheduling platform for Fortune 500 client with 250,000+ employees, establishing 15-person India call center with complete training framework",
      "Automated Excel-based workflows for 15-workstream SAP implementation, saving 1,000+ hours through file consolidation and process standardization",
      "Created project reporting dashboards in SharePoint enabling real-time C-suite visibility across 300-person SAP project",
    ],
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
      "Uncovered hidden demand by creating measurement capabilities into the LOS. Championed business case that revealed 300% higher volume than expected, leading to dedicated 50-person Sales team within 6 months.",
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

export const TECHNICAL_PROJECTS: TechnicalProject[] = [
  {
    id: "leafed",
    icon: "phone_iphone",
    title: "Leafed - Mobile App",
    description:
      "Built and shipped privacy-first book tracking app to Google Play Store and Apple App Store using React, Cursor, and Claude. Managed full product lifecycle from concept through development, testing, and store deployment.",
    stack: ["React", "Cursor", "Claude", "RevenueCat", "Custom API"],
    links: [
      { label: "Google Play", url: "https://play.google.com/store/apps/details?id=app.leafed" },
      { label: "Apple App Store", url: "https://apps.apple.com/app/leafed" },
    ],
  },
  {
    id: "prompt-evaluation",
    icon: "psychology",
    title: "AI Development Quality Framework",
    description:
      "Custom promptfoo implementation for systematic evaluation of AI-assisted development prompts. Ensures consistent, high-quality code generation before shipping features.",
    stack: ["promptfoo", "Claude API", "YAML", "Python", "Cursor"],
    links: [{ label: "View Case Study", url: "/prompt-framework" }],
  },
];

export const METHODOLOGY_CARDS: MethodologyCard[] = [
  {
    id: "build-to-learn",
    icon: "construction",
    title: "Build to Learn",
    quote: '"I build things to find out what\'s true, not just to ship features."',
    inPractice:
      "When I'm uncertain about what users actually need, I don't schedule another round of interviews—I build something lightweight that measures what they do. Surveys tell you what people think they want. Instrumented systems show you what they really need. It's faster, it's clearer, and it keeps you honest about whether you're solving the right problem.",
  },
  {
    id: "agile-delivery",
    icon: "rocket_launch",
    title: "Agile Delivery",
    quote: '"Ship the smallest thing that teaches you the most."',
    inPractice:
      "Big initiatives don't fail because the plan was wrong—they fail because we waited too long to test it. I've found the best approach is breaking things into the smallest shippable increment that proves the concept. Get it in front of users, watch what happens, adjust. A working MVP in production beats a perfect PRD gathering dust.",
  },
  {
    id: "automation-first",
    icon: "automation",
    title: "Automation First",
    quote: '"If I\'m doing it manually twice, I automate it."',
    inPractice:
      "The second time I find myself doing repetitive work, I build the thing that does it for me. Status updates become dashboards. Analysis becomes pipelines. One-off requests become self-service tools. It's not about being lazy—it's about scaling yourself so you can focus on the problems that actually need a human.",
  },
  {
    id: "systems-over-slides",
    icon: "dashboard",
    title: "Systems Over Slides",
    quote: '"I\'d rather build a dashboard than sit in a status meeting."',
    inPractice:
      "I'd rather spend an hour building a dashboard than an hour explaining what's happening. When stakeholders have real-time visibility into the work, they stop asking for updates and start making decisions. The goal isn't to look busy—it's to make the work transparent enough that everyone can move faster.",
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
  title: "Mike Watson - Senior Product Manager",
  description:
    "Senior Product Manager building products that solve real problems. 14+ years in fintech and enterprise software. Data-driven strategy, user-centric design.",
  canonical: "https://mikewatson.us/consulting",
};

export const TOOLS_BUILD_WITH = {
  aiDevelopment: ["Cursor", "Claude", "ChatGPT"],
  productAndData: ["React", "Python", "APIs", "JIRA", "Notion", "Figma"],
  platforms: ["Salesforce", "Oracle", "Intercom", "Google Analytics"],
};

export const CONTACT_INFO = {
  email: "mwatson1983@gmail.com",
  linkedin: "https://www.linkedin.com/in/michaeljameswatson/",
  resumePdf: "https://mikewatson.us/Michael_Watson_Resume_January_2026.pdf",
  ctaHeadline: "Ready to solve complex problems together?",
  ctaSubheadline:
    "Senior Product Manager who builds and ships. Deployed mobile apps, created automation systems, and rescued stalled initiatives across fintech and enterprise software.",
};
