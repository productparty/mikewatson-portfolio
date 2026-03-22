interface ShippedApp {
  name: string;
  description: string;
  platforms: string[];
  links: { label: string; url: string; icon: string }[];
}

const SHIPPED_APPS: ShippedApp[] = [
  {
    name: "Leafed",
    description:
      "Privacy-first book tracking app. No accounts, no tracking, no ads. Scan bookshelves, import from Goodreads, track reading goals. Everything stored on-device.",
    platforms: ["iOS", "Android"],
    links: [
      {
        label: "App Store",
        url: "https://apps.apple.com/us/app/leafed-private-book-tracker/id6754466418",
        icon: "phone_iphone",
      },
      {
        label: "Google Play",
        url: "https://play.google.com/store/apps/details?id=com.leafedapp.leafed&hl=en_US",
        icon: "android",
      },
      {
        label: "Website",
        url: "https://leafed.app/",
        icon: "language",
      },
    ],
  },
  {
    name: "LossLog",
    description:
      "Document water damage in seconds, generate insurance-ready PDF reports. GPS-stamped, timestamped evidence capture with guided checklists. Works offline.",
    platforms: ["iOS"],
    links: [
      {
        label: "App Store",
        url: "https://apps.apple.com/us/app/losslog-water-damage-docs/id6758919407",
        icon: "phone_iphone",
      },
    ],
  },
  {
    name: "Pesticide Mix Calculator",
    description:
      "Fast, accurate pesticide dilution calculations for pest control technicians. Three calculation modes, real-time results, works fully offline. No accounts, no ads.",
    platforms: ["iOS"],
    links: [
      {
        label: "App Store",
        url: "https://apps.apple.com/us/app/pest-calculator/id6759580852",
        icon: "phone_iphone",
      },
    ],
  },
  {
    name: "HVAC Load Calculator",
    description:
      "Manual J BTU sizing calculator for HVAC contractors. Quick load calculations in the field.",
    platforms: ["iOS"],
    links: [
      {
        label: "App Store",
        url: "https://apps.apple.com/us/app/hvac-load-calculator-manual-j/id6758120488",
        icon: "phone_iphone",
      },
    ],
  },
  {
    name: "AI Chat Anchor",
    description:
      "Open source browser extension to bookmark, pin, and organize AI chat conversations across ChatGPT and other platforms.",
    platforms: ["Chrome"],
    links: [
      {
        label: "Chrome Web Store",
        url: "https://chromewebstore.google.com/detail/bookmark-chatgpt-pin-ai-r/pajpbfoakdmkgccoghfhjlgboibdnfgc",
        icon: "extension",
      },
    ],
  },
];

const PLATFORM_ICON_MAP: Record<string, string> = {
  iOS: "phone_iphone",
  Android: "android",
  Chrome: "extension",
};

export function BuiltAndShipped() {
  return (
    <section id="built-and-shipped" className="py-20 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <header className="mb-12 sm:mb-16">
          <span className="font-label text-[10px] sm:text-xs uppercase tracking-widest text-primary font-bold mb-3 sm:mb-4 block">
            Shipped Products
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Built &amp; Shipped
          </h2>
          <p className="text-muted-foreground font-body text-base sm:text-lg max-w-xl">
            Privacy-first apps I designed, built, and shipped using React
            Native, Cursor, and Claude.
          </p>
        </header>

        {/* App cards — bento grid with featured first item */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SHIPPED_APPS.map((app, index) => {
            const isFeatured = index === 0;

            return (
              <div
                key={app.name}
                className={`bg-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 ghost-border hover:shadow-[0_20px_40px_rgba(28,28,26,0.05)] transition-all duration-300 flex flex-col group ${
                  isFeatured ? "md:col-span-2 lg:col-span-2 sm:p-10" : ""
                }`}
              >
                {/* App name */}
                <h3
                  className={`font-headline font-extrabold text-foreground mb-3 ${
                    isFeatured ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
                  }`}
                >
                  {app.name}
                </h3>

                {/* Platform badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {app.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="inline-flex items-center gap-1.5 px-3 py-1 font-label text-[10px] font-bold uppercase tracking-widest rounded-full bg-primary/10 text-primary"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {PLATFORM_ICON_MAP[platform] || "devices"}
                      </span>
                      {platform}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p
                  className={`text-muted-foreground leading-relaxed font-body flex-1 mb-6 ${
                    isFeatured ? "text-base sm:text-lg max-w-2xl" : "text-sm sm:text-base"
                  }`}
                >
                  {app.description}
                </p>

                {/* Links */}
                <div className="pt-4 sm:pt-6 border-t border-outline-variant/10">
                  <div className="flex flex-wrap gap-4">
                    {app.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-label text-xs font-bold tracking-widest uppercase text-primary flex items-center gap-2 group/link hover:gap-3 transition-all"
                      >
                        {link.label}
                        <span className="material-symbols-outlined text-sm transition-transform group-hover/link:translate-x-1">
                          open_in_new
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
