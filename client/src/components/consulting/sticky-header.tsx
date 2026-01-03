import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
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

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <nav className="content-container flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold text-foreground">
          Mike Watson
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="#how-i-think"
            className="text-sm text-foreground hover:text-primary hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            How I Think
          </a>
          <a
            href="#services"
            className="text-sm text-foreground hover:text-primary hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Services
          </a>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <a
              href="https://mikewatson.us/Michael_Watson_Resume_January_2026.PDF"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Resume (PDF)
            </a>
            <span className="text-muted-foreground/50">|</span>
            <a
              href="https://mikewatson.us/Michael_Watson_Resume_January_2026.docx"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Resume (Word)
            </a>
          </div>
          <Button asChild size="sm" className="ml-2">
            <a href={HERO_CONTENT.primaryCta.href}>
              {HERO_CONTENT.primaryCta.label}
            </a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="content-container py-4 space-y-3">
            <a
              href="#how-i-think"
              className="block text-sm text-foreground hover:text-primary hover:underline underline-offset-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How I Think
            </a>
            <a
              href="#services"
              className="block text-sm text-foreground hover:text-primary hover:underline underline-offset-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </a>
            <div className="pt-2 border-t border-border space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Resume</p>
              <a
                href="https://mikewatson.us/Michael_Watson_Resume_January_2026.PDF"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Download PDF
              </a>
              <a
                href="https://mikewatson.us/Michael_Watson_Resume_January_2026.docx"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Download Word
              </a>
            </div>
            <Button asChild className="w-full mt-4">
              <a href={HERO_CONTENT.primaryCta.href}>
                {HERO_CONTENT.primaryCta.label}
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

