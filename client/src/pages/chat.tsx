import { Button } from "@/components/ui/button";
import { PortfolioChat } from "@/components/portfolio-chat";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { SeoHead } from "@/components/seo-head";

export default function Chat() {
  return (
    <>
      <SeoHead
        seo={{
          title: "Ask Mike Watson | AI Portfolio Assistant",
          description:
            "Chat with an AI trained on Mike Watson's 14+ years of product management experience, 150+ newsletter posts, and project portfolio. Get authentic answers about product strategy, career advice, and more.",
          canonical: "https://mikewatson.us/chat",
        }}
      />
      <div className="min-h-screen bg-pm-background dark:bg-slate-900 flex flex-col">
        {/* Header */}
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center gap-2 text-pm-muted hover:text-pm-body">
                <ArrowLeft size={16} />
                Back to Portfolio
              </Link>
            </Button>
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/michaeljameswatson/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-pm-muted hover:text-pm-primary transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://www.productparty.us/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-pm-muted hover:text-pm-primary transition-colors"
              >
                Newsletter
              </a>
            </div>
          </div>
        </header>

        {/* Main Chat Area */}
        <main className="flex-1 container mx-auto px-4 flex flex-col min-h-0">
          <PortfolioChat />
        </main>
      </div>
    </>
  );
}
