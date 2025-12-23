import { ServiceCard } from "./service-card";
import type { ServicePillar } from "@/types/portfolio";

interface ServicePillarsProps {
  services: ServicePillar[];
}

export function ServicePillars({ services }: ServicePillarsProps) {
  return (
    <section id="services" className="py-16 lg:py-28 bg-card/50">
      <div className="content-container">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12 tracking-tight leading-tight">
          Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}

