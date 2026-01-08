import { CONTACT_INFO } from "@/lib/portfolio-content";

export function FinalCTA() {
  return (
    <section
      id="contact"
      className="py-24 px-4 sm:px-10 max-w-[960px] mx-auto text-center"
    >
      <h2 className="text-4xl font-black mb-6 text-slate-900 dark:text-white font-display">
        {CONTACT_INFO.ctaHeadline}
      </h2>
      <p className="text-lg text-pm-muted dark:text-slate-400 mb-10 max-w-xl mx-auto font-body">
        {CONTACT_INFO.ctaSubheadline}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        {/* Email Button */}
        <a
          href={`mailto:${CONTACT_INFO.email}`}
          className="flex items-center justify-center gap-3 w-full sm:w-auto h-14 px-8 rounded-xl bg-pm-primary hover:bg-pm-primary-dark text-white font-bold text-lg shadow-xl shadow-pm-primary/20 transition-all hover:-translate-y-1 font-display"
        >
          <span className="material-symbols-outlined">mail</span>
          {CONTACT_INFO.email}
        </a>

        {/* LinkedIn Button */}
        <a
          href={CONTACT_INFO.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full sm:w-auto h-14 px-8 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-lg shadow-xl shadow-sky-900/10 transition-all hover:-translate-y-1 font-display"
        >
          <span className="material-symbols-outlined">link</span>
          LinkedIn
        </a>

        {/* Resume Button */}
        <a
          href={CONTACT_INFO.resumePdf}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full sm:w-auto h-14 px-8 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-900 dark:text-white font-bold text-lg shadow-sm transition-all hover:-translate-y-1 font-display"
        >
          <span className="material-symbols-outlined">download</span>
          Resume PDF
        </a>
      </div>
    </section>
  );
}
