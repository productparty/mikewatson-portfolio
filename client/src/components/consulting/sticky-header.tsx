import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X, MessageCircle } from "lucide-react";

export function StickyHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
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
      className={`sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md transition-shadow ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="px-4 sm:px-10 py-3 max-w-[1280px] mx-auto flex items-center justify-between">
        {/* Logo / Branding */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center size-8 rounded-lg bg-primary text-primary-foreground">
            <span className="material-symbols-outlined text-lg">dataset</span>
          </div>
          <Link
            href="/"
            className="text-lg font-bold leading-tight tracking-tight text-foreground font-display"
          >
            Mike Watson | Senior PM
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
          <div className="flex items-center gap-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors font-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              <MessageCircle size={16} />
              Ask AI
            </button>
            <a
              href="#experience"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#experience");
              }}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors font-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              Experience
            </a>
            <a
              href="#technical-projects"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#technical-projects");
              }}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors font-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              Projects
            </a>
            <a
              href="#case-studies"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#case-studies");
              }}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors font-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              Case Studies
            </a>
            <a
              href="#methodology"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#methodology");
              }}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors font-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              Methodology
            </a>
          </div>
          <button
            onClick={() => handleNavClick("#contact")}
            className="flex cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary hover:bg-primary/85 active:bg-primary/75 transition-colors text-primary-foreground text-sm font-bold shadow-sm font-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Let's Talk
          </button>
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
          <div className="px-4 py-4 space-y-1">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2 text-sm font-medium text-primary py-3 px-2 w-full min-h-[44px] rounded-lg hover:bg-muted transition-colors font-body"
            >
              <MessageCircle size={16} />
              Ask AI
            </button>
            <a
              href="#experience"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground py-3 px-2 min-h-[44px] rounded-lg hover:bg-muted transition-colors font-body"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#experience");
              }}
            >
              Experience
            </a>
            <a
              href="#technical-projects"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground py-3 px-2 min-h-[44px] rounded-lg hover:bg-muted transition-colors font-body"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#technical-projects");
              }}
            >
              Projects
            </a>
            <a
              href="#case-studies"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground py-3 px-2 min-h-[44px] rounded-lg hover:bg-muted transition-colors font-body"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#case-studies");
              }}
            >
              Case Studies
            </a>
            <a
              href="#methodology"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground py-3 px-2 min-h-[44px] rounded-lg hover:bg-muted transition-colors font-body"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#methodology");
              }}
            >
              Methodology
            </a>
            <button
              onClick={() => handleNavClick("#contact")}
              className="w-full flex items-center justify-center rounded-lg h-12 px-5 bg-primary hover:bg-primary/85 active:bg-primary/75 transition-colors text-primary-foreground text-sm font-bold mt-3 font-display"
            >
              Let's Talk
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
