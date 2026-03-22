import type { TechnicalProject } from "@/types/portfolio";
import { Link } from "wouter";

interface TechnicalProjectsProps {
  projects: TechnicalProject[];
}

export function TechnicalProjects({ projects }: TechnicalProjectsProps) {
  return (
    <section id="technical-projects" className="py-20 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <header className="mb-12 sm:mb-20">
          <span className="font-label text-[10px] sm:text-xs uppercase tracking-widest text-primary font-bold mb-3 sm:mb-4 block">
            Selected Works
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Products built from concept to code.
          </h2>
        </header>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">
          {projects.map((project, index) => {
            // First project gets featured treatment (2 cols)
            const isFeatured = index === 0;

            return (
              <div
                key={project.id}
                className={`bg-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 ghost-border hover:shadow-[0_20px_40px_rgba(28,28,26,0.05)] transition-all duration-300 flex flex-col group ${
                  isFeatured ? "lg:col-span-2 lg:row-span-2 sm:p-10" : ""
                }`}
              >
                {/* Icon */}
                <div
                  className={`rounded-xl sm:rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-105 transition-transform ${
                    isFeatured ? "size-14 sm:size-16" : "size-12"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined ${
                      isFeatured ? "text-3xl" : "text-2xl"
                    }`}
                  >
                    {project.icon}
                  </span>
                </div>

                {/* Stack pills */}
                <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                  {project.stack.slice(0, isFeatured ? 6 : 3).map((tech, i) => (
                    <span
                      key={i}
                      className="bg-primary/5 text-primary px-3 sm:px-4 py-1 sm:py-1.5 rounded-full font-label text-[10px] sm:text-[11px] font-bold tracking-widest uppercase"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <h3
                    className={`font-headline font-extrabold text-foreground ${
                      isFeatured
                        ? "text-2xl sm:text-3xl md:text-4xl"
                        : "text-xl sm:text-2xl"
                    }`}
                  >
                    {project.title}
                  </h3>
                  {project.isComingSoon && (
                    <span className="px-3 py-1 text-[10px] font-label font-bold uppercase tracking-widest rounded-full bg-surface-container-high text-muted-foreground">
                      Coming Soon
                    </span>
                  )}
                </div>

                {/* Description */}
                <p
                  className={`text-muted-foreground leading-relaxed font-body flex-1 mb-6 ${
                    isFeatured ? "text-base sm:text-xl max-w-2xl" : "text-sm sm:text-base"
                  }`}
                >
                  {project.description}
                </p>

                {/* Links */}
                {project.links && project.links.length > 0 && (
                  <div className="pt-4 sm:pt-6 border-t border-outline-variant/10">
                    <div className="flex flex-wrap gap-4">
                      {project.links.map((link, i) => {
                        const isInternal = link.url.startsWith("/");
                        const className =
                          "font-label text-xs font-bold tracking-widest uppercase text-primary flex items-center gap-2 group/link hover:gap-3 transition-all";

                        if (isInternal) {
                          return (
                            <Link
                              key={i}
                              href={link.url}
                              className={className}
                            >
                              {link.label}
                              <span className="material-symbols-outlined text-sm transition-transform group-hover/link:translate-x-1">
                                chevron_right
                              </span>
                            </Link>
                          );
                        }
                        return (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={className}
                          >
                            {link.label}
                            <span className="material-symbols-outlined text-sm transition-transform group-hover/link:translate-x-1">
                              open_in_new
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
