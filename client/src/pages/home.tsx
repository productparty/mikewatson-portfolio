import { ProfileHeader } from "@/components/profile-header";
import { SocialLinks } from "@/components/social-links";
import { NewsletterForm } from "@/components/newsletter-form";
import { NonprofitSupport } from "@/components/nonprofit-support";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
          <h2 className="text-3xl font-bold text-center">Projects</h2>
          <div className="flex flex-col items-center gap-6">
            <div className="border rounded-lg p-4 shadow-md w-full max-w-md">
              <h3 className="text-xl font-semibold">Find My Club</h3>
              <p className="text-muted-foreground">A modern and responsive UI for a golf club/course search engine.</p>
              <p className="text-sm text-muted-foreground">Technologies: React, Tailwind CSS, Vercel</p>
              <Button asChild variant="outline" className="mt-2">
                <a href="https://golf-club-ui-lac.vercel.app/" target="_blank" rel="noopener noreferrer">
                  View Project
                </a>
              </Button>
            </div>
            
            <div className="border rounded-lg p-4 shadow-md w-full max-w-md">
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src="https://leafed.app/logo.svg" 
                  alt="Leafed Logo" 
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    // Fallback to favicon if logo.svg doesn't exist
                    (e.target as HTMLImageElement).src = "https://leafed.app/favicon.ico";
                  }}
                />
                <h3 className="text-xl font-semibold">Leafed</h3>
              </div>
              <p className="text-muted-foreground mb-3">
                Book discovery without the surveillance. No ads. No tracking. No accounts. Scan barcodes, search millions of titles, build reading lists, and get recommendations—all while keeping your data on your device.
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary">Mobile App</Badge>
                <Badge variant="secondary">iOS</Badge>
                <Badge variant="secondary">Android</Badge>
                <Badge variant="secondary">Privacy-First</Badge>
                <Badge variant="secondary">Book Discovery</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" className="mt-2">
                  <a href="https://leafed.app/" target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                </Button>
                <Button asChild variant="outline" className="mt-2">
                  <a href="https://apps.apple.com/app/leafed" target="_blank" rel="noopener noreferrer">
                    App Store
                  </a>
                </Button>
                <Button asChild variant="outline" className="mt-2">
                  <a href="https://play.google.com/store/apps/details?id=app.leafed" target="_blank" rel="noopener noreferrer">
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