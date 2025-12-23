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
          Michael Watson
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
          <a
            href="#case-studies"
            className="text-sm text-foreground hover:text-primary hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Case Studies
          </a>
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
            <a
              href="#case-studies"
              className="block text-sm text-foreground hover:text-primary hover:underline underline-offset-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Case Studies
            </a>
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

