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
    <section id="tools" className="py-20 bg-background">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-3 text-foreground font-display">
            Tools I Build With
          </h2>
          <p className="text-muted-foreground font-body">
            Technologies and platforms I use to build and ship products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="p-6 rounded-xl bg-card shadow-sm"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">
                    {category.icon}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground font-display">
                  {category.title}
                </h3>
              </div>

              {/* Tools List */}
              <div className="flex flex-wrap gap-2">
                {category.tools.map((tool, toolIndex) => (
                  <span
                    key={toolIndex}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg bg-muted text-foreground/70"
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
