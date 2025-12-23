import { ArticleCard } from "./article-card";
import type { ThoughtLeadershipLink } from "@/types/portfolio";

interface HowIThinkProps {
  articles: ThoughtLeadershipLink[];
}

export function HowIThink({ articles }: HowIThinkProps) {
  return (
    <section id="how-i-think" className="py-16 lg:py-28">
      <div className="content-container">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12 tracking-tight leading-tight">
          How I Think
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {articles.map((article, idx) => (
            <ArticleCard key={idx} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

