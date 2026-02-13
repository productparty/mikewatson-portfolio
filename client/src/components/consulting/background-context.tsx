export function BackgroundContext() {
  const selectedWork = [
    {
      project: "Customer Data Modernization",
      context: "Pet Supplies Plus",
      role: "Product Manager",
      outcome: "Recovered 3-month stalled timeline, delivered pilot",
    },
    {
      project: "Dealer Test Drive Pilot",
      context: "Credit Acceptance",
      role: "Sr. Product Owner",
      outcome: "33% enrollment increase, nationwide rollout",
    },
    {
      project: "AI Chatbot Platform",
      context: "Auto Approve",
      role: "Sr. Product Manager",
      outcome: "Reduced 2,500 monthly customer contacts",
    },
    {
      project: "E-Notary Adoption",
      context: "Auto Approve",
      role: "Sr. Product Manager",
      outcome: "3,000%+ usage growth in three months",
    },
    {
      project: "Speech Analytics Scale",
      context: "Rocket Mortgage",
      role: "Product Owner",
      outcome: "Scaled from 1% manual review to 10,000 daily call hours",
    },
  ];

  return (
    <section id="background" className="py-16 lg:py-28">
      <div className="content-container">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-8 tracking-tight">
          Background & Selected Work
        </h2>

        <div className="space-y-8 text-muted-foreground">
          <p className="text-base leading-relaxed max-w-3xl mx-auto">
            For readers who want additional context on experience and project history,
            below is a brief overview. This section provides background credibility
            without replacing the consulting-focused positioning above.
          </p>

          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">
                Career Overview
              </h3>
              <ul className="space-y-2 list-disc list-inside text-sm leading-relaxed">
                <li>
                  Product leadership across fintech and enterprise software (10+ years)
                </li>
                <li>
                  Scaled product operations for cross-functional teams
                </li>
                <li>
                  Founded Product Party newsletter with 2,000+ subscribers
                </li>
              </ul>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-medium text-foreground mb-4">
                Selected Work
              </h3>
              <div className="space-y-4">
                {selectedWork.map((work, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm pb-3 border-b border-border last:border-b-0"
                  >
                    <div className="font-medium text-foreground">
                      {work.project}
                    </div>
                    <div>{work.context}</div>
                    <div>{work.role}</div>
                    <div>{work.outcome}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-medium text-foreground mb-3">
                Resume
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <a
                    href="https://mikewatson.us/Michael_Watson_Resume_January_2026.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                  >
                    Download PDF
                  </a>
                </div>
                <div>
                  <a
                    href="https://mikewatson.us/Michael_Watson_Resume_January_2026.docx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                  >
                    Download Word
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

