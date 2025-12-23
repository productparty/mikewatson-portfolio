import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import type { ThoughtLeadershipLink } from "@/types/portfolio";

interface ArticleCardProps {
  article: ThoughtLeadershipLink;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="h-full border border-border shadow-none bg-card hover:border-primary/50 transition-colors">
      <CardContent className="p-6 space-y-3">
        {/* Article title - secondary, muted */}
        <p className="text-xs md:text-sm text-muted-foreground mb-3 uppercase tracking-wide">
          {article.title}
        </p>

        {/* Takeaway - visually dominant */}
        <p className="text-lg md:text-xl text-foreground leading-relaxed font-medium">
          {article.takeaway}
        </p>

        {/* Link - subtle */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-primary hover:underline inline-flex items-center gap-1 mt-4 transition-colors"
        >
          Read article
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardContent>
    </Card>
  );
}

