interface ToolsSectionProps {
  tools: {
    aiDevelopment: string[];
    productAndData: string[];
    platforms: string[];
  };
}

export function ToolsSection({ tools }: ToolsSectionProps) {
  const categories = [
    {
      title: "AI Development",
      tools: tools.aiDevelopment,
      icon: "psychology",
    },
    {
      title: "Product & Data",
      tools: tools.productAndData,
      icon: "analytics",
    },
    {
      title: "Platforms",
      tools: tools.platforms,
      icon: "cloud",
    },
  ];

  return (
    <section id="tools" className="py-16 sm:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="mb-10 sm:mb-12">
          <span className="font-label text-[10px] sm:text-xs uppercase tracking-widest text-primary font-bold mb-3 block">
            Tech Stack
          </span>
          <h2 className="text-3xl sm:text-4xl font-headline font-extrabold tracking-tight text-foreground mb-3">
            Tools I Build With
          </h2>
          <p className="text-muted-foreground font-body text-base sm:text-lg">
            Technologies and platforms I use to build and ship products.
          </p>
        </div>

        {/* Three-column cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="p-6 sm:p-8 rounded-2xl bg-card ghost-border hover:shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all duration-300"
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="size-10 sm:size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl sm:text-2xl">
                    {category.icon}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-headline font-bold text-foreground">
                  {category.title}
                </h3>
              </div>

              {/* Tool pills */}
              <div className="flex flex-wrap gap-2">
                {category.tools.map((tool, toolIndex) => (
                  <span
                    key={toolIndex}
                    className="px-3 py-1.5 font-label text-[10px] sm:text-[11px] font-bold tracking-widest uppercase rounded-full bg-surface-container-high text-muted-foreground hover:bg-primary-fixed-dim hover:text-foreground transition-colors"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
