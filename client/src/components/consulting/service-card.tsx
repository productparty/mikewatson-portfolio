import { Card, CardContent } from "@/components/ui/card";
import { Target, Zap, Settings } from "lucide-react";
import type { ServicePillar } from "@/types/portfolio";

interface ServiceCardProps {
  service: ServicePillar;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "product-leadership": Target,
  "delivery-execution": Zap,
  "product-operations": Settings,
};

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = iconMap[service.id] || Target;

  return (
    <Card className="h-full border border-border shadow-none bg-card hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
            <Icon className="h-6 w-6 text-foreground" />
          </div>
          <div className="flex-1 space-y-3">
            <h3 className="text-lg font-semibold text-foreground tracking-tight leading-tight">
              {service.title}
            </h3>
            <ul className="space-y-2">
              {service.bullets.map((bullet, idx) => (
                <li
                  key={idx}
                  className="text-sm text-foreground leading-relaxed flex items-start gap-2"
                >
                  <span className="text-muted-foreground mt-1.5">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

