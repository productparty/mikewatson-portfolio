import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";

export function ProjectGrid() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"]
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl bg-card shadow-sm animate-pulse">
            <div className="h-48 bg-muted rounded-t-xl" />
            <div className="h-32 p-6" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects?.map((project) => (
        <div key={project.id} className="rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-bold text-foreground font-display mb-2">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                {project.title}
              </a>
            </h3>
            <p className="text-foreground/70 mb-4 leading-relaxed font-body">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium rounded-lg bg-muted text-foreground/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
