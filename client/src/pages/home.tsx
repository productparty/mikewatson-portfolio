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
      </main>
    </div>
  );
}