import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { PERSONAL_INFO } from "@/lib/constants";
import { CONTACT_INFO } from "@/lib/portfolio-content";

const NAV_LINKS = [
  { label: "Work", href: "#portfolio-content" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#technical-projects" },
  { label: "About", href: "#methodology" },
  { label: "Contact", href: "#contact" },
] as const;

export function StickyHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Determine active section based on scroll position
      const sections = NAV_LINKS.map((link) =>
        document.querySelector(link.href)
      ).filter(Boolean) as Element[];

      let current = "";
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100) {
          current = `#${section.id}`;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full glass-nav transition-shadow duration-300 ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 sm:px-8 h-20">
        {/* Logo — text only */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-xl font-extrabold text-primary font-headline tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
        >
          Mike Watson
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className={`font-headline font-bold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm ${
                activeSection === link.href
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href={CONTACT_INFO.resumePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-cta text-primary-foreground px-6 py-2.5 rounded-full font-label text-xs uppercase tracking-widest transition-opacity hover:opacity-90 active:scale-95 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Download CV
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-6 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`flex items-center text-sm font-headline font-bold py-3 px-3 min-h-[44px] rounded-lg transition-colors ${
                  activeSection === link.href
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href={CONTACT_INFO.resumePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center rounded-full h-12 px-5 gradient-cta text-primary-foreground text-sm font-bold mt-3 font-label uppercase tracking-widest"
            >
              Download CV
            </a>
            <button
              onClick={() => handleNavClick("#contact")}
              className="w-full flex items-center justify-center rounded-lg h-12 px-5 bg-foreground text-background text-sm font-bold mt-2 font-headline hover:bg-primary transition-colors"
            >
              Let's Talk
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
