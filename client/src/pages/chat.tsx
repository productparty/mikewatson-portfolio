import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/chat-interface";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Chat() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft size={20} />
              Back to Portfolio
            </Link>
          </Button>
        </div>
        
        <ChatInterface />
      </main>
    </div>
  );
}
