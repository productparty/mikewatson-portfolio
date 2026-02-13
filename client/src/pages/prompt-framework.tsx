import { useEffect } from "react";
import { StickyHeader } from "@/components/consulting/sticky-header";
import { FinalCTA } from "@/components/consulting/final-cta";
import { SeoHead } from "@/components/seo-head";
import { Link } from "wouter";

const PROMPT_FRAMEWORK_SEO = {
  title: "AI Quality Assurance Framework - Mike Watson",
  description:
    "How I built a 45-test quality assurance suite to validate my portfolio AI assistant before shipping. Voice consistency, guardrails, factual accuracy, and edge case handling.",
  canonical: "https://mikewatson.us/prompt-framework",
};

const METRICS = [
  { icon: "checklist", value: "45", label: "Tests Designed" },
  { icon: "trending_up", value: "88.89%", label: "Final Pass Rate" },
  { icon: "category", value: "5", label: "Categories Evaluated" },
  { icon: "tune", value: "13", label: "Prompt Refinements" },
];

const TECH_STACK = ["promptfoo", "Claude API", "YAML", "Node.js"];

const TEST_CATEGORIES = [
  {
    name: "Voice Consistency",
    count: 8,
    description:
      "Does the AI sound like me? Conversational tone, leads with stories, avoids 15+ banned phrases, varies sentence lengths, states opinions without hedging.",
  },
  {
    name: "Guardrails",
    count: 10,
    description:
      "Redirects salary questions gracefully. Won't badmouth former employers. Transparent about being AI. Won't provide legal/financial advice. Protects confidential information.",
  },
  {
    name: "Knowledge Accuracy",
    count: 13,
    description:
      "Correctly attributes achievements to the right company. Gets metrics right (3,000% e-notary growth, 33% enrollment increase). Knows Leafed is not open source.",
  },
  {
    name: "Edge Cases",
    count: 9,
    description:
      "Handles questions outside my expertise honestly. Manages off-topic requests (banana bread recipe). Resists prompt injection. Responds appropriately to criticism.",
  },
  {
    name: "Differentiation",
    count: 5,
    description:
      "Gives opinionated career advice with personal experience, not generic pros-and-cons. References specific personal projects rather than textbook examples.",
  },
];

export default function PromptFramework() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SeoHead seo={PROMPT_FRAMEWORK_SEO} />
      <div className="min-h-screen bg-background font-display">
        <StickyHeader />

        <main>
          {/* Breadcrumb */}
          <div className="max-w-[1280px] mx-auto px-4 sm:px-10 pt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-body"
            >
              <span className="material-symbols-outlined text-lg">
                arrow_back
              </span>
              Back to Portfolio
            </Link>
          </div>

          {/* Hero Section */}
          <header className="py-16 md:py-20 px-4 sm:px-10 max-w-[1280px] mx-auto">
            <div className="max-w-4xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white mb-6">
                AI Quality Assurance Framework
              </h1>
              <p className="text-xl text-muted-foreground mb-10 font-body">
                How I validated my portfolio AI assistant before shipping it to
                real users
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {METRICS.map((metric, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined">
                          {metric.icon}
                        </span>
                      </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      {metric.value}
                    </p>
                    <p className="text-sm text-muted-foreground font-body">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2">
                {TECH_STACK.map((tech, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </header>

          {/* Challenge */}
          <section className="py-16 bg-white dark:bg-slate-800 border-y border-slate-100 dark:border-slate-700">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
                  The Problem: Most AI Features Ship on Vibes
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed font-body">
                  Most people building AI features don't validate them
                  systematically. They prompt, eyeball the output, and ship.
                  That works until it doesn't.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">
                      warning
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        What if the AI attributes my Intercom chatbot to the
                        wrong company?
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 font-body">
                        Factual errors erode credibility fast.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">
                      warning
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        What if it responds to "hi" with a 500-word monologue?
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 font-body">
                        Voice and tone matter as much as accuracy.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">
                      warning
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        What if someone asks it to badmouth a former employer?
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 font-body">
                        Guardrails aren't optional for production AI.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-slate-900 dark:text-white font-bold font-body">
                  I built an AI assistant for my portfolio. Before shipping it,
                  I needed to prove it actually works—that it sounds like me,
                  gets facts right, has appropriate guardrails, and handles
                  weird inputs gracefully. You don't ship AI products on vibes.
                </p>
              </div>
            </div>
          </section>

          {/* Test Categories */}
          <section className="py-16">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
                  45 Tests Across 5 Categories
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 font-body">
                  Each category targets a different dimension of AI quality:
                </p>

                <div className="space-y-6">
                  {TEST_CATEGORIES.map((category, index) => (
                    <div
                      key={index}
                      className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="flex-shrink-0 size-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
                          {category.count}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {category.name}
                        </h3>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 font-body">
                        {category.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-16 bg-white dark:bg-slate-800 border-y border-slate-100 dark:border-slate-700">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
                  The Iteration Journey: 75% to 89%
                </h2>
                <p className="text-lg text-muted-foreground mb-10 font-body">
                  Validation revealed gaps. Refinement fixed them.
                </p>

                <div className="space-y-8">
                  {/* Step 1 */}
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 size-12 rounded-xl bg-primary text-white text-xl font-bold flex items-center justify-center">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                        Built the AI Assistant
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 font-body">
                        38-file knowledge corpus covering my career history,
                        150+ newsletter posts, project details, and voice
                        guidelines.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 size-12 rounded-xl bg-primary text-white text-xl font-bold flex items-center justify-center">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                        Designed 45 Test Cases
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-4 font-body">
                        Each test has a specific assertion the AI must pass.
                        Used{" "}
                        <a
                          href="https://github.com/promptfoo/promptfoo"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          promptfoo
                        </a>{" "}
                        to automate evaluation with LLM-as-judge rubrics.
                      </p>
                      <div className="p-4 rounded-lg bg-slate-900 border border-slate-700 font-mono text-sm overflow-x-auto">
                        <code className="text-green-400">
                          npx promptfoo eval --no-cache
                        </code>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 size-12 rounded-xl bg-amber-500 text-white text-xl font-bold flex items-center justify-center">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                        First Run: 75.56% (34/45 passing)
                      </h3>
                      <div className="space-y-2 font-body text-slate-600 dark:text-slate-300">
                        <p>
                          <strong>What failed:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Missing education dates</li>
                          <li>
                            Intercom chatbot attributed to wrong company (said
                            Rocket Mortgage, was actually Auto Approve)
                          </li>
                          <li>Overly long responses to simple greetings</li>
                          <li>Missing Accenture SAP implementation context</li>
                          <li>Used banned phrases like "Here's what"</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 size-12 rounded-xl bg-primary text-white text-xl font-bold flex items-center justify-center">
                      4
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                        Iterative Refinement (13 changes)
                      </h3>
                      <div className="space-y-3 font-body">
                        <p className="text-slate-600 dark:text-slate-300">
                          <strong>System prompt improvements:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2 text-slate-600 dark:text-slate-300">
                          <li>
                            Added education details (Central Michigan 2010,
                            University of Phoenix 2008)
                          </li>
                          <li>
                            Clarified Intercom chatbot was at Auto Approve
                            specifically
                          </li>
                          <li>Added Accenture SAP implementation details</li>
                          <li>
                            Added response length guidelines (1-2 sentences for
                            greetings)
                          </li>
                          <li>Added special situation handling rules</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 size-12 rounded-xl bg-green-500 text-white text-xl font-bold flex items-center justify-center">
                      5
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                        Final Run: 88.89% (40/45 passing)
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 font-body">
                        13 percentage points improvement. The 5 remaining
                        failures are LLM variance issues with the smaller test
                        model (Claude Haiku)—occasionally uses forbidden
                        phrases, sometimes misses specific dates. Known model
                        limitations, not system prompt problems.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Case Study */}
          <section className="py-16">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
                  Case Study: Catching a Factual Error
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 font-body">
                  One test asked about my Intercom chatbot project. The AI
                  confidently attributed it to Rocket Mortgage. Wrong company.
                </p>

                <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Before */}
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <p className="text-sm font-bold text-red-700 dark:text-red-400 uppercase mb-3">
                        Before Fix
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 font-body">
                        <strong>Test:</strong> "Where did you launch the
                        Intercom chatbot?"
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 font-body">
                        <strong>AI Response:</strong> "At Rocket Mortgage, I
                        launched..."
                      </p>
                      <p className="text-sm text-red-600 dark:text-red-400 font-body font-bold">
                        FAIL: Wrong company attribution
                      </p>
                    </div>

                    {/* After */}
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <p className="text-sm font-bold text-green-700 dark:text-green-400 uppercase mb-3">
                        After Fix
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 font-body">
                        <strong>System prompt update:</strong> Added explicit
                        note: "Intercom chatbot was at Auto Approve, NOT Rocket
                        Mortgage"
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 font-body">
                        <strong>AI Response:</strong> "At Auto Approve, I
                        launched the Intercom chatbot..."
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400 font-body font-bold">
                        PASS: Correct attribution
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-primary/10 text-center">
                    <p className="text-lg font-bold text-primary">
                      Without systematic testing, this error would have gone
                      live.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why I Didn't Reinvent the Wheel */}
          <section className="py-16 bg-white dark:bg-slate-800 border-y border-slate-100 dark:border-slate-700">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
                  Why I Didn't Reinvent the Wheel
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed font-body">
                  My first instinct: build a custom evaluation system from
                  scratch. Then I asked—what would a good PM do?
                </p>
                <p className="text-xl font-bold text-primary mb-6">
                  Research first.
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-body">
                  I discovered{" "}
                  <a
                    href="https://github.com/promptfoo/promptfoo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-bold"
                  >
                    promptfoo
                  </a>
                  , a mature open-source evaluation framework that already
                  solved the core technical problems. Instead of spending 20
                  hours reinventing the wheel, I spent 4 hours implementing a
                  customized solution.
                </p>

                <p className="text-lg text-slate-900 dark:text-white font-bold font-body">
                  This is product thinking applied to tooling: leverage existing
                  solutions, add unique value, ship faster.
                </p>
              </div>
            </div>
          </section>

          {/* Governance Layer */}
          <section className="py-16">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
                  This Is Real AI Governance
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed font-body">
                  This isn't about my workflow—it's about a real AI product that
                  talks to real people. The portfolio AI assistant needed
                  proper governance before going live:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="material-symbols-outlined text-primary">
                      fact_check
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-body">
                      Systematic evaluation (not hope)
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="material-symbols-outlined text-primary">
                      verified_user
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-body">
                      Guardrails for sensitive topics
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="material-symbols-outlined text-primary">
                      verified
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-body">
                      Factual accuracy validation
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="material-symbols-outlined text-primary">
                      record_voice_over
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-body">
                      Voice consistency testing
                    </span>
                  </div>
                </div>

                <p className="text-lg text-slate-900 dark:text-white font-bold mb-4 font-body">
                  This is what responsible AI product development looks like.
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-300 font-body">
                  As AI becomes standard in products, PMs who can't evaluate and
                  govern AI outputs will be at a significant disadvantage. I
                  built the evaluation framework because I ship AI products that
                  need to work correctly—not just products that look impressive
                  in demos.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <FinalCTA />
        </main>

        {/* Footer */}
        <footer className="py-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-muted-foreground font-body">
          <p>
            © {new Date().getFullYear()} Mike Watson. Designed with{" "}
            <span className="text-primary">♥</span> for Product Management.
          </p>
        </footer>
      </div>
    </>
  );
}
