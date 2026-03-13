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

function PlatformBadge({ platform }: { platform: string }) {
  const iconMap: Record<string, string> = {
    iOS: "phone_iphone",
    Android: "android",
    Chrome: "extension",
  };

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full bg-primary/10 text-primary">
      <span className="material-symbols-outlined text-sm">
        {iconMap[platform] || "devices"}
      </span>
      {platform}
    </span>
  );
}

export function BuiltAndShipped() {
  return (
    <section id="built-and-shipped" className="py-20 bg-card">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-3 text-foreground font-display">
            Built &amp; Shipped
          </h2>
          <p className="text-muted-foreground font-body">
            Privacy-first apps I designed, built, and shipped using React
            Native, Cursor, and Claude.
          </p>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible md:pb-0">
          {SHIPPED_APPS.map((app) => (
            <div
              key={app.name}
              className="min-w-[300px] md:min-w-0 snap-start flex flex-col p-8 rounded-xl bg-background shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              {/* App name */}
              <h3 className="text-xl font-bold text-foreground font-display mb-2">
                {app.name}
              </h3>

              {/* Platform badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {app.platforms.map((platform) => (
                  <PlatformBadge key={platform} platform={platform} />
                ))}
              </div>

              {/* Description */}
              <p className="text-foreground/70 leading-relaxed font-body mb-6 flex-1">
                {app.description}
              </p>

              {/* Links */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                {app.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary font-bold hover:underline text-sm font-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                  >
                    {link.label}
                    <span className="material-symbols-outlined text-sm">
                      open_in_new
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
