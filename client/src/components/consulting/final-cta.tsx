import { CONTACT_INFO } from "@/lib/portfolio-content";

export function FinalCTA() {
  return (
    <section id="contact" className="py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="bg-primary/5 rounded-2xl sm:rounded-[2rem] p-8 sm:p-12 ghost-border relative overflow-hidden">
          {/* Content */}
          <div className="max-w-2xl relative z-10">
            <h3 className="font-headline text-2xl sm:text-3xl font-bold mb-4 text-foreground">
              {CONTACT_INFO.ctaHeadline}
            </h3>
            <p className="text-muted-foreground mb-8 font-body text-base sm:text-lg leading-relaxed">
              {CONTACT_INFO.ctaSubheadline}
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              {/* Email — gradient CTA */}
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="gradient-cta text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-full font-headline font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity min-h-[44px] shadow-sm"
              >
                <span className="material-symbols-outlined text-xl">mail</span>
                Get in Touch
              </a>
              {/* LinkedIn — ghost border */}
              <a
                href={CONTACT_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card ghost-border px-6 sm:px-8 py-3 sm:py-4 rounded-full font-headline font-bold text-sm sm:text-base text-foreground flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors min-h-[44px]"
              >
                <span className="material-symbols-outlined text-xl">link</span>
                LinkedIn
              </a>
              {/* Resume — ghost border */}
              <a
                href={CONTACT_INFO.resumePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card ghost-border px-6 sm:px-8 py-3 sm:py-4 rounded-full font-headline font-bold text-sm sm:text-base text-foreground flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors min-h-[44px]"
              >
                <span className="material-symbols-outlined text-xl">
                  download
                </span>
                Download CV
              </a>
            </div>
          </div>

          {/* Watermark */}
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-5 pointer-events-none hidden sm:flex items-center justify-center">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "15rem" }}
            >
              smart_toy
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
