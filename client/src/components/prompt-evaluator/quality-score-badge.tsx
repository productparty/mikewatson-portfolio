import { cn } from "@/lib/utils";

interface QualityScoreBadgeProps {
  label: string;
  score: number;
  maxScore?: number;
  className?: string;
}

export function QualityScoreBadge({
  label,
  score,
  maxScore = 5,
  className,
}: QualityScoreBadgeProps) {
  const percentage = (score / maxScore) * 100;
  const getColorClass = () => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    if (percentage >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className="font-bold">{score.toFixed(1)}/{maxScore}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full transition-all duration-500", getColorClass())}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
