import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ServicePillar } from "@/types/portfolio";

interface ServiceCardProps {
  service: ServicePillar;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="h-full border border-border shadow-none bg-card">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl text-foreground tracking-tight leading-tight">
          {service.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-base md:text-lg text-foreground leading-relaxed">
          <span className="font-semibold">You bring me in when</span>{" "}
          {service.bringMeIn}
        </p>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            What this looks like:
          </p>
          <ul className="space-y-2">
            {service.bullets.map((bullet, idx) => (
              <li
                key={idx}
                className="text-base text-foreground leading-relaxed flex items-start gap-2"
              >
                <span className="text-muted-foreground mt-1.5">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

