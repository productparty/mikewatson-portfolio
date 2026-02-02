import type { TechnicalProject } from "@/types/portfolio";
import { Link } from "wouter";

interface TechnicalProjectsProps {
  projects: TechnicalProject[];
}

export function TechnicalProjects({ projects }: TechnicalProjectsProps) {
  return (
    <section
      id="technical-projects"
      className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white font-display">
            Technical Projects
          </h2>
          <p className="text-pm-muted dark:text-slate-400 font-body">
            Products I've built and shipped using modern development tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-8 rounded-xl bg-pm-background dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="size-12 rounded-lg bg-pm-primary/10 text-pm-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">
                  {project.icon}
                </span>
              </div>

              {/* Title */}
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  {project.title}
                </h3>
                {project.isComingSoon && (
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                    Coming Soon
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed font-body">
                {project.description}
              </p>

              {/* Stack */}
              <div className="mb-4">
                <p className="text-xs font-bold text-pm-muted uppercase mb-2 font-body">
                  Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              {project.links && project.links.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  {project.links.map((link, index) => {
                    const isInternal = link.url.startsWith("/");
                    if (isInternal) {
                      return (
                        <Link
                          key={index}
                          href={link.url}
                          className="inline-flex items-center gap-2 text-pm-primary font-bold hover:underline text-sm font-body"
                        >
                          {link.label}
                          <span className="material-symbols-outlined text-sm">
                            arrow_forward
                          </span>
                        </Link>
                      );
                    }
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-pm-primary font-bold hover:underline text-sm font-body"
                      >
                        {link.label}
                        <span className="material-symbols-outlined text-sm">
                          open_in_new
                        </span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
