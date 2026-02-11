import { CONTACT_INFO } from "@/lib/portfolio-content";

export function FinalCTA() {
  return (
    <section
      id="contact"
      className="py-20 px-4 sm:px-10 max-w-[960px] mx-auto text-center"
    >
      <h2 className="text-3xl sm:text-4xl font-black mb-6 text-foreground font-display">
        {CONTACT_INFO.ctaHeadline}
      </h2>
      <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto font-body">
        {CONTACT_INFO.ctaSubheadline}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {/* Email Button */}
        <a
          href={`mailto:${CONTACT_INFO.email}`}
          className="flex items-center justify-center gap-3 w-full sm:w-auto h-14 px-8 rounded-xl bg-primary hover:bg-primary/85 active:bg-primary/75 text-primary-foreground font-bold text-lg shadow-sm transition-all hover:shadow-md font-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="material-symbols-outlined">mail</span>
          {CONTACT_INFO.email}
        </a>

        {/* LinkedIn Button */}
        <a
          href={CONTACT_INFO.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full sm:w-auto h-14 px-8 rounded-xl bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white font-bold text-lg shadow-sm transition-all hover:shadow-md font-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="material-symbols-outlined">link</span>
          LinkedIn
        </a>

        {/* Resume Button */}
        <a
          href={CONTACT_INFO.resumePdf}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full sm:w-auto h-14 px-8 rounded-xl bg-card border border-border hover:bg-muted text-foreground font-bold text-lg shadow-sm transition-all hover:shadow-md font-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="material-symbols-outlined">download</span>
          Resume PDF
        </a>
      </div>
    </section>
  );
}
