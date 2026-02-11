import { ProfileHeader } from "@/components/profile-header";
import { SocialLinks } from "@/components/social-links";
import { NewsletterForm } from "@/components/newsletter-form";
import { NonprofitSupport } from "@/components/nonprofit-support";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { PERSONAL_INFO } from "@/lib/constants";
import { ChatWidget } from "@/components/chat-widget";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 space-y-12">
        <ProfileHeader />

        <div className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <a 
              href={PERSONAL_INFO.resume.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <FileDown size={20} />
              Download Resume (PDF)
            </a>
          </Button>
          <Button asChild variant="outline">
            <a 
              href={PERSONAL_INFO.resume.word}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <FileDown size={20} />
              Download Resume (Word)
            </a>
          </Button>
          <ChatWidget />
        </div>

        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-center">Connect</h2>
          <SocialLinks />
          <NewsletterForm />
        </section>

        <section>
          <NonprofitSupport />
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-center font-display text-foreground">Projects</h2>
          <div className="flex flex-col items-center gap-6">
            <div className="rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 bg-card w-full max-w-md">
              <h3 className="text-xl font-bold font-display text-foreground mb-2">Find My Club</h3>
              <p className="text-foreground/70 leading-relaxed font-body mb-2">A modern and responsive UI for a golf club/course search engine.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 text-xs font-medium rounded-lg bg-muted text-foreground/70">React</span>
                <span className="px-3 py-1 text-xs font-medium rounded-lg bg-muted text-foreground/70">Tailwind CSS</span>
                <span className="px-3 py-1 text-xs font-medium rounded-lg bg-muted text-foreground/70">Vercel</span>
              </div>
              <Button asChild variant="outline" className="min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <a href="https://golf-club-ui-lac.vercel.app/" target="_blank" rel="noopener noreferrer">
                  View Project
                </a>
              </Button>
            </div>

            <div className="rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 bg-card w-full max-w-md">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="https://leafed.app/logo.svg"
                  alt="Leafed Logo"
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://leafed.app/favicon.ico";
                  }}
                />
                <h3 className="text-xl font-bold font-display text-foreground">Leafed</h3>
              </div>
              <p className="text-foreground/70 mb-3 leading-relaxed font-body">
                Book discovery without the surveillance. No ads. No tracking. No accounts. Scan barcodes, search millions of titles, build reading lists, and get recommendations—all while keeping your data on your device.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 text-xs font-medium rounded-lg bg-muted text-foreground/70">Mobile App</span>
                <span className="px-3 py-1 text-xs font-medium rounded-lg bg-muted text-foreground/70">iOS</span>
                <span className="px-3 py-1 text-xs font-medium rounded-lg bg-muted text-foreground/70">Android</span>
                <span className="px-3 py-1 text-xs font-medium rounded-lg bg-muted text-foreground/70">Privacy-First</span>
                <span className="px-3 py-1 text-xs font-medium rounded-lg bg-muted text-foreground/70">Book Discovery</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" className="min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <a href="https://leafed.app/" target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                </Button>
                <Button asChild variant="outline" className="min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <a href="https://apps.apple.com/ng/app/leafed-app/id6754466418" target="_blank" rel="noopener noreferrer">
                    App Store
                  </a>
                </Button>
                <Button asChild variant="outline" className="min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <a href="https://play.google.com/store/apps/details?id=com.leafedapp.leafed&hl=en" target="_blank" rel="noopener noreferrer">
                    Google Play
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}