import { StickyHeader } from "@/components/consulting/sticky-header";
import { FinalCTA } from "@/components/consulting/final-cta";
import { SeoHead } from "@/components/seo-head";
import { Link } from "wouter";

const PROMPT_FRAMEWORK_SEO = {
  title: "AI Development Quality Framework - Mike Watson",
  description:
    "Custom promptfoo implementation for systematic evaluation of AI-assisted development prompts. Learn how systematic prompt evaluation ensures consistent, high-quality code generation.",
  canonical: "https://mikewatson.us/prompt-framework",
};

const METRICS = [
  { icon: "analytics", value: "40+", label: "Prompts Evaluated" },
  { icon: "trending_up", value: "4.6/5", label: "Avg Quality (up from 3.4)" },
  { icon: "schedule", value: "2.7 hrs", label: "Saved Per Feature" },
  { icon: "speed", value: "8%", label: "Drift (down from 35%)" },
];

const TECH_STACK = ["promptfoo", "Claude API", "YAML", "Python", "Cursor"];

export default function PromptFramework() {
  return (
    <>
      <SeoHead seo={PROMPT_FRAMEWORK_SEO} />
      <div className="min-h-screen bg-pm-background dark:bg-slate-900 font-display">
        <StickyHeader />

        <main>
          {/* Breadcrumb */}
          <div className="max-w-[1280px] mx-auto px-4 sm:px-10 pt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-pm-muted dark:text-slate-400 hover:text-pm-primary transition-colors font-body"
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
                AI Development Quality Framework
              </h1>
              <p className="text-xl text-pm-muted dark:text-slate-400 mb-10 font-body">
                Systematic prompt evaluation for AI-assisted product development
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {METRICS.map((metric, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="size-10 rounded-lg bg-pm-primary/10 text-pm-primary flex items-center justify-center">
                        <span className="material-symbols-outlined">
                          {metric.icon}
                        </span>
                      </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      {metric.value}
                    </p>
                    <p className="text-sm text-pm-muted dark:text-slate-400 font-body">
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
                  Problem with AI-Assisted Development
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed font-body">
                  AI development tools like Cursor and Claude are powerful—but
                  probabilistic. The same prompt can produce wildly different
                  code quality:
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <span className="material-symbols-outlined text-green-600 dark:text-green-400">
                      check_circle
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        Run 1:
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 font-body">
                        Clean, production-ready React component
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">
                      warning
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        Run 2:
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 font-body">
                        Missing error handling, crashes on null values
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <span className="material-symbols-outlined text-red-600 dark:text-red-400">
                      error
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        Run 3:
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 font-body">
                        Uses deprecated patterns, needs complete refactor
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-slate-600 dark:text-slate-300 mb-4 leading-relaxed font-body">
                  Without systematic evaluation, you're gambling every time you
                  ship. This became critical while building{" "}
                  <strong>Leafed</strong>, where bad prompts meant bad code
                  shipped to users.
                </p>
                <p className="text-lg text-slate-900 dark:text-white font-bold font-body">
                  The core issue: LLM outputs drift. What works today might fail
                  tomorrow. What produces quality code 7 times might fail
                  catastrophically 3 times.
                </p>
              </div>
            </div>
          </section>

          {/* Solution */}
          <section className="py-16">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
                  Why I Didn't Reinvent the Wheel
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed font-body">
                  My first instinct: build a custom evaluation system from
                  scratch. Then I asked—what would a good PM do?
                </p>
                <p className="text-xl font-bold text-pm-primary mb-6">
                  Research first.
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-body">
                  I discovered{" "}
                  <a
                    href="https://github.com/promptfoo/promptfoo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pm-primary hover:underline font-bold"
                  >
                    promptfoo
                  </a>
                  , a mature open-source evaluation framework that already
                  solved the core technical problems. Instead of spending 20
                  hours reinventing the wheel, I spent 4 hours implementing a
                  customized solution.
                </p>

                <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-8">
                  <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                    What I Built:
                  </h3>
                  <ol className="space-y-3 font-body">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 size-6 rounded-full bg-pm-primary text-white text-sm font-bold flex items-center justify-center">
                        1
                      </span>
                      <span className="text-slate-600 dark:text-slate-300">
                        Custom evaluation configs for common PM tasks (React
                        components, API integration, content creation)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 size-6 rounded-full bg-pm-primary text-white text-sm font-bold flex items-center justify-center">
                        2
                      </span>
                      <span className="text-slate-600 dark:text-slate-300">
                        Pre-built test suites with opinionated quality criteria
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 size-6 rounded-full bg-pm-primary text-white text-sm font-bold flex items-center justify-center">
                        3
                      </span>
                      <span className="text-slate-600 dark:text-slate-300">
                        Integrated workflow that runs before I use prompts in
                        production
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 size-6 rounded-full bg-pm-primary text-white text-sm font-bold flex items-center justify-center">
                        4
                      </span>
                      <span className="text-slate-600 dark:text-slate-300">
                        Results tracking to learn what prompt patterns work best
                      </span>
                    </li>
                  </ol>
                </div>

                <p className="text-lg text-slate-900 dark:text-white font-bold font-body">
                  This is product thinking applied to tooling: leverage existing
                  solutions, add unique value, ship faster.
                </p>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-16 bg-white dark:bg-slate-800 border-y border-slate-100 dark:border-slate-700">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
                  My Evaluation Workflow
                </h2>
                <p className="text-lg text-pm-muted dark:text-slate-400 mb-10 font-body">
                  Before Building a Leafed Feature:
                </p>

                <div className="space-y-8">
                  {/* Step 1 */}
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 size-12 rounded-xl bg-pm-primary text-white text-xl font-bold flex items-center justify-center">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                        Write Prompt Variations
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-4 font-body">
                        Write 2-3 different ways to ask for the same feature.
                      </p>
                      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-sm">
                        <p className="text-slate-500 dark:text-slate-400 mb-2">
                          Example:
                        </p>
                        <p className="text-slate-700 dark:text-slate-300">
                          <span className="text-pm-primary font-bold">
                            Version A:
                          </span>{" "}
                          "Create a BookCard component"
                        </p>
                        <p className="text-slate-700 dark:text-slate-300">
                          <span className="text-pm-primary font-bold">
                            Version B:
                          </span>{" "}
                          "Build a BookCard component following existing
                          patterns from ReadingList.jsx"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 size-12 rounded-xl bg-pm-primary text-white text-xl font-bold flex items-center justify-center">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                        Run Evaluation
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-4 font-body">
                        System runs each prompt 5 times, evaluates outputs
                        against quality criteria.
                      </p>
                      <div className="p-4 rounded-lg bg-slate-900 border border-slate-700 font-mono text-sm overflow-x-auto">
                        <code className="text-green-400">
                          promptfoo eval -c react-component.yaml
                        </code>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 size-12 rounded-xl bg-pm-primary text-white text-xl font-bold flex items-center justify-center">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                        Review Results
                      </h3>
                      <div className="space-y-2 font-mono text-sm">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">
                            warning
                          </span>
                          <span className="text-slate-700 dark:text-slate-300">
                            Prompt A: 3.2/5 quality, 35% drift
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                          <span className="material-symbols-outlined text-green-600 dark:text-green-400">
                            check_circle
                          </span>
                          <span className="text-slate-700 dark:text-slate-300">
                            Prompt B: 4.7/5 quality, 8% drift
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                          <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">
                            info
                          </span>
                          <span className="text-slate-700 dark:text-slate-300">
                            Prompt C: 4.1/5 quality, 18% drift
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 size-12 rounded-xl bg-pm-primary text-white text-xl font-bold flex items-center justify-center">
                      4
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                        Pick Winner
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 font-body">
                        Use Prompt B in Cursor with confidence.
                      </p>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 size-12 rounded-xl bg-pm-primary text-white text-xl font-bold flex items-center justify-center">
                      5
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                        Ship Better Code
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 font-body">
                        Avoid 4+ hours of debugging bad outputs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Real Results */}
          <section className="py-16">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
                  What I Learned Through 40+ Evaluations
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 font-body">
                  After evaluating 40+ prompts across 6 months, clear patterns
                  emerged:
                </p>

                {/* Pattern Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                  <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-2xl font-black text-pm-primary">47%</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-body">
                      more consistent with example code
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-2xl font-black text-pm-primary">62%</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-body">
                      drift reduction with "follow existing patterns"
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-2xl font-black text-pm-primary">0.3</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-body">
                      optimal temperature for code (vs 0.7 for content)
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-2xl font-black text-pm-primary">23%</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-body">
                      quality improvement with explicit component names
                    </p>
                  </div>
                </div>

                {/* Case Study */}
                <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">
                    Case Study: Leafed Bookmark Sync Feature
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Before */}
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <p className="text-sm font-bold text-red-700 dark:text-red-400 uppercase mb-3">
                        Before Evaluation
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 font-body">
                        <strong>Prompt:</strong> "Create bookmark sync
                        functionality"
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 font-body">
                        <strong>Quality:</strong> 3.1/5, Drift: 35%
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 font-body">
                        <strong>Result:</strong> 4 hours debugging state
                        management issues
                      </p>
                    </div>

                    {/* After */}
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <p className="text-sm font-bold text-green-700 dark:text-green-400 uppercase mb-3">
                        After Evaluation
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 font-body">
                        <strong>Prompt:</strong> "Create bookmark sync using
                        existing DataSync pattern from ReadingProgress.jsx.
                        Handle offline state, conflicts, and API errors."
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 font-body">
                        <strong>Quality:</strong> 4.8/5, Drift: 6%
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 font-body">
                        <strong>Result:</strong> 90 minutes start to finish,
                        shipped first try
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-pm-primary/10 text-center">
                    <p className="text-2xl font-black text-pm-primary">
                      Time saved: 2.5 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Prompt Patterns */}
          <section className="py-16 bg-white dark:bg-slate-800 border-y border-slate-100 dark:border-slate-700">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold mb-10 text-slate-900 dark:text-white">
                  Knowledge Base
                </h2>

                <div className="space-y-8">
                  {/* React Components */}
                  <div className="p-6 rounded-xl bg-pm-background dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-3">
                      <span className="material-symbols-outlined text-pm-primary">
                        code
                      </span>
                      For React Components
                    </h3>
                    <div className="space-y-2 font-body">
                      <p className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <span className="material-symbols-outlined text-sm">
                          check
                        </span>
                        Always specify functional vs class component
                      </p>
                      <p className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <span className="material-symbols-outlined text-sm">
                          check
                        </span>
                        Reference existing component as template
                      </p>
                      <p className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <span className="material-symbols-outlined text-sm">
                          check
                        </span>
                        List edge cases to handle
                      </p>
                      <p className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <span className="material-symbols-outlined text-sm">
                          check
                        </span>
                        Include exact prop types
                      </p>
                      <p className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <span className="material-symbols-outlined text-sm">
                          close
                        </span>
                        Avoid vague requests like "make it good"
                      </p>
                    </div>
                  </div>

                  {/* API Integration */}
                  <div className="p-6 rounded-xl bg-pm-background dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-3">
                      <span className="material-symbols-outlined text-pm-primary">
                        api
                      </span>
                      For API Integration
                    </h3>
                    <div className="space-y-2 font-body">
                      <p className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <span className="material-symbols-outlined text-sm">
                          check
                        </span>
                        Provide API documentation snippet
                      </p>
                      <p className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <span className="material-symbols-outlined text-sm">
                          check
                        </span>
                        Specify error handling requirements
                      </p>
                      <p className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <span className="material-symbols-outlined text-sm">
                          check
                        </span>
                        Include authentication context
                      </p>
                      <p className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <span className="material-symbols-outlined text-sm">
                          check
                        </span>
                        Show expected response format
                      </p>
                    </div>
                  </div>

                  {/* Content Creation */}
                  <div className="p-6 rounded-xl bg-pm-background dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-3">
                      <span className="material-symbols-outlined text-pm-primary">
                        edit_note
                      </span>
                      For Content Creation
                    </h3>
                    <div className="space-y-2 font-body">
                      <p className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <span className="material-symbols-outlined text-sm">
                          check
                        </span>
                        Provide 1-2 example outputs
                      </p>
                      <p className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <span className="material-symbols-outlined text-sm">
                          check
                        </span>
                        Specify tone and audience
                      </p>
                      <p className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <span className="material-symbols-outlined text-sm">
                          check
                        </span>
                        Set word count ranges
                      </p>
                      <p className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <span className="material-symbols-outlined text-sm">
                          check
                        </span>
                        Define success criteria
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why This Matters */}
          <section className="py-16">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
                  Governance Layer
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed font-body">
                  This isn't just about my workflow—it demonstrates
                  understanding of <strong>LLM governance</strong>, the emerging
                  discipline that separates reliable AI products from unreliable
                  ones.
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-body">
                  Companies like Anthropic emphasize that production AI
                  requires:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="material-symbols-outlined text-pm-primary">
                      fact_check
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-body">
                      Systematic evaluation (not hope)
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="material-symbols-outlined text-pm-primary">
                      trending_down
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-body">
                      Drift detection (catching degradation)
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="material-symbols-outlined text-pm-primary">
                      verified
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-body">
                      Quality baselines (knowing what "good" means)
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="material-symbols-outlined text-pm-primary">
                      monitoring
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-body">
                      Continuous monitoring (not one-time testing)
                    </span>
                  </div>
                </div>

                <p className="text-lg text-slate-900 dark:text-white font-bold mb-4 font-body">
                  This framework shows I understand how to build AI products
                  that don't break in production.
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-300 font-body">
                  As AI becomes standard in product development, PMs who can't
                  evaluate and govern AI outputs will be at a significant
                  disadvantage.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
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
