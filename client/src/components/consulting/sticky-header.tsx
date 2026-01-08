import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { HERO_CONTENT } from "@/lib/portfolio-content";

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
      className={`sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-pm-background/90 dark:bg-slate-900/90 backdrop-blur-md transition-shadow ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="px-4 sm:px-10 py-3 max-w-[1280px] mx-auto flex items-center justify-between">
        {/* Logo / Branding */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center size-8 rounded-lg bg-pm-primary text-white">
            <span className="material-symbols-outlined text-lg">dataset</span>
          </div>
          <Link
            href="/"
            className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white font-display"
          >
            Mike Watson | Senior PM
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
          <div className="flex items-center gap-6">
            <a
              href="#experience"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#experience");
              }}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-pm-primary transition-colors font-body"
            >
              Experience
            </a>
            <a
              href="#case-studies"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#case-studies");
              }}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-pm-primary transition-colors font-body"
            >
              Case Studies
            </a>
            <a
              href="#methodology"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#methodology");
              }}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-pm-primary transition-colors font-body"
            >
              Methodology
            </a>
          </div>
          <button
            onClick={() => handleNavClick("#contact")}
            className="flex cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-pm-primary hover:bg-pm-primary-dark transition-colors text-white text-sm font-bold shadow-sm shadow-pm-primary/20 font-display"
          >
            Let's Talk
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-900 dark:text-white"
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
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-pm-background dark:bg-slate-900">
          <div className="px-4 py-4 space-y-3">
            <a
              href="#experience"
              className="block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-pm-primary py-2 font-body"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#experience");
              }}
            >
              Experience
            </a>
            <a
              href="#case-studies"
              className="block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-pm-primary py-2 font-body"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#case-studies");
              }}
            >
              Case Studies
            </a>
            <a
              href="#methodology"
              className="block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-pm-primary py-2 font-body"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#methodology");
              }}
            >
              Methodology
            </a>
            <button
              onClick={() => handleNavClick("#contact")}
              className="w-full flex items-center justify-center rounded-lg h-12 px-5 bg-pm-primary hover:bg-pm-primary-dark transition-colors text-white text-sm font-bold mt-4 font-display"
            >
              Let's Talk
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
