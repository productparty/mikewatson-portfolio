import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ChevronDown, X, Mail, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { PERSONAL_INFO } from "@/lib/constants";
import { sanitizeRecommendations } from "@/lib/recommendation-utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface LeadInfo {
  name: string;
  email: string;
}

interface StitchResponse {
  recommendations?: unknown;
  source?: string;
}

const STARTER_QUESTIONS = [
  "What's the story behind 3,000% e-notary growth?",
  "How do you approach inheriting a messy backlog?",
  "Tell me about building Leafed as a non-developer",
  "What's your take on AI replacing PMs?",
  "What are you looking for in your next role?",
];

const DEV_MODE = import.meta.env.DEV;

export function AIHeroSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [remainingMessages, setRemainingMessages] = useState<number | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [stitchRecommendations, setStitchRecommendations] = useState<string[]>(
    []
  );
  const [stitchSource, setStitchSource] = useState<string>("loading");
  const [isLoadingStitch, setIsLoadingStitch] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Lead capture state
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadDismissed, setLeadDismissed] = useState(false);
  const [leadInfo, setLeadInfo] = useState<LeadInfo>({ name: "", email: "" });
  const [leadError, setLeadError] = useState<string | null>(null);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Show lead form after first complete exchange
  useEffect(() => {
    if (
      messages.length >= 2 &&
      !leadSubmitted &&
      !leadDismissed &&
      !showLeadForm
    ) {
      const timer = setTimeout(() => {
        setShowLeadForm(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [messages.length, leadSubmitted, leadDismissed, showLeadForm]);

  // Save transcript to DB after each exchange
  useEffect(() => {
    if (messages.length >= 2 && !isStreaming) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant" && lastMessage.content) {
        fetch("/api/chat-transcript", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, messages, saveOnly: true }),
        }).catch((err) => console.error("Failed to save transcript:", err));
      }
    }
  }, [messages, sessionId, isStreaming]);

  // Send final transcript with email on page close
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (messages.length > 0) {
        navigator.sendBeacon(
          "/api/chat-transcript",
          JSON.stringify({ sessionId, messages, final: true })
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [messages, sessionId]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const loadStitchRecommendations = useCallback(async (query?: string) => {
    setIsLoadingStitch(true);

    try {
      const response = await fetch("/api/stitch-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = (await response.json()) as StitchResponse;
      const cleaned = sanitizeRecommendations(data.recommendations);
      setStitchRecommendations(cleaned);
      setStitchSource(data.source || "unknown");
    } catch (recommendationError) {
      console.error("Stitch recommendation error:", recommendationError);
      setStitchRecommendations([]);
      setStitchSource("error");
    } finally {
      setIsLoadingStitch(false);
    }
  }, []);

  useEffect(() => {
    loadStitchRecommendations(
      "Suggest interview-style prompts for this portfolio chat."
    );
  }, [loadStitchRecommendations]);

  const sendMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim() || isStreaming) return;

      setError(null);
      const userMessage: Message = {
        role: "user",
        content: messageText.trim(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsStreaming(true);

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      try {
        const response = await fetch("/api/portfolio-chat/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: messageText.trim(), sessionId }),
        });

        if (!response.ok) {
          if (response.status === 429) {
            setError(
              "You've reached the message limit. Please try again later."
            );
            setMessages((prev) => prev.slice(0, -1));
            setIsStreaming(false);
            return;
          }
          throw new Error("Failed to send message");
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === "chunk") {
                  setMessages((prev) => {
                    const updated = [...prev];
                    const lastMessage = updated[updated.length - 1];
                    if (lastMessage.role === "assistant") {
                      lastMessage.content += data.content;
                    }
                    return updated;
                  });
                } else if (data.type === "done") {
                  setRemainingMessages(data.remaining);
                } else if (data.type === "error") {
                  setError(data.message);
                }
              } catch {
                // Skip malformed JSON
              }
            }
          }
        }

        loadStitchRecommendations(messageText.trim());
      } catch (err) {
        console.error("Chat error:", err);
        setError("Something went wrong. Please try again.");
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsStreaming(false);
      }
    },
    [sessionId, isStreaming, loadStitchRecommendations]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleStarterClick = (question: string) => {
    sendMessage(question);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadInfo.name.trim() || !leadInfo.email.trim()) {
      setLeadError("Please fill in both fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadInfo.email)) {
      setLeadError("Please enter a valid email address");
      return;
    }

    setIsSubmittingLead(true);
    setLeadError(null);

    try {
      const response = await fetch("/api/chat-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          name: leadInfo.name.trim(),
          email: leadInfo.email.trim(),
          messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      setLeadSubmitted(true);
      setShowLeadForm(false);
    } catch {
      setLeadError("Something went wrong. Please try again.");
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const dismissLeadForm = () => {
    setLeadDismissed(true);
    setShowLeadForm(false);
  };

  const scrollToContent = () => {
    const target = document.querySelector("#portfolio-content");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const hasConversation = messages.length > 0;

  return (
    <section className="relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-12 sm:pt-16 pb-8">
        {/* Two-column hero — collapses when conversation starts */}
        {!hasConversation && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end mb-16 sm:mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Left: headline + bio */}
            <div className="lg:col-span-8 space-y-6 sm:space-y-8">
              <div className="inline-block bg-surface-container-high px-4 py-1.5 rounded-full">
                <span className="font-label text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                  Senior Product Manager
                </span>
              </div>
              <h1 className="text-4xl sm:text-[3.5rem] md:text-[5rem] font-headline font-extrabold leading-[1.1] tracking-tight text-foreground">
                Architecting{" "}
                <span className="text-primary italic">clarity</span> out of
                complex systems.
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-body leading-relaxed max-w-2xl">
                14+ years scaling fintech platforms and enterprise software.
                I trained an AI on my work — skip the resume, interview me instead.
              </p>
            </div>

            {/* Right: headshot + floating stat */}
            <div className="lg:col-span-4 relative">
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-low">
                <img
                  src={PERSONAL_INFO.avatar}
                  alt="Mike Watson"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating stat badge */}
              <div className="absolute -bottom-6 -left-6 bg-primary-container p-5 sm:p-6 rounded-xl text-primary-foreground hidden md:block shadow-lg">
                <div className="font-headline font-bold text-3xl">14+</div>
                <div className="font-label text-[10px] uppercase tracking-widest opacity-80">
                  Years Experience
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Ask Card */}
        <div
          ref={chatContainerRef}
          className="bg-card ghost-border rounded-xl shadow-[0_20px_40px_rgba(28,28,26,0.03)] relative overflow-hidden"
        >
          {/* Watermark icon */}
          {!hasConversation && (
            <div className="absolute top-0 right-0 p-6 sm:p-8 opacity-5 pointer-events-none">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "8rem" }}
              >
                smart_toy
              </span>
            </div>
          )}

          {/* Pre-conversation: header + input + chips */}
          {!hasConversation && (
            <div className="relative z-10 p-6 sm:p-8 md:p-12 space-y-6 sm:space-y-8">
              {/* Card header */}
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-xl">
                  auto_awesome
                </span>
                <h3 className="font-headline font-bold text-xl sm:text-2xl text-foreground">
                  Ask my AI double anything
                </h3>
              </div>

              {/* Input row */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <div className="flex-grow bg-surface-container-low rounded-full px-5 sm:px-6 py-3 sm:py-4 flex items-center border border-transparent focus-within:border-primary/20 transition-all">
                  <span className="material-symbols-outlined text-muted-foreground mr-3 text-xl">
                    search
                  </span>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        sendMessage(input);
                      }
                    }}
                    placeholder="What is Mike's approach to technical debt?"
                    disabled={isStreaming}
                    className="bg-transparent border-none focus:ring-0 focus:outline-none text-foreground placeholder:text-muted-foreground/50 font-body w-full text-sm sm:text-base"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isStreaming || !input.trim()}
                  className="bg-foreground text-background px-6 sm:px-8 py-3 sm:py-4 rounded-full font-headline font-bold hover:bg-primary transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] text-sm sm:text-base"
                >
                  Ask Question
                </button>
              </form>

              {/* Starter chips */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {STARTER_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleStarterClick(question)}
                      className="px-4 py-2 bg-surface-container-high rounded-full font-label text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-widest hover:bg-primary-fixed-dim hover:text-foreground transition-colors min-h-[36px] sm:min-h-[44px]"
                    >
                      {question}
                    </button>
                  ))}
                </div>

                {/* Stitch recommendations */}
                {isLoadingStitch ? (
                  <div className="flex gap-2 pt-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-8 rounded-full bg-primary/5 animate-pulse"
                        style={{
                          width: `${80 + i * 30}px`,
                          animationDelay: `${i * 150}ms`,
                        }}
                      />
                    ))}
                  </div>
                ) : stitchRecommendations.length > 0 ? (
                  <div className="pt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-3 h-3 text-primary/50" />
                      <span className="font-label text-[10px] text-muted-foreground uppercase tracking-widest">
                        AI-suggested
                        {DEV_MODE && (
                          <span className="ml-1.5 font-mono text-[9px] text-muted-foreground/40">
                            [{stitchSource}]
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {stitchRecommendations.map((rec, index) => (
                        <button
                          key={`stitch-${index}`}
                          onClick={() => handleStarterClick(rec)}
                          className="px-4 py-2 bg-primary/[0.06] hover:bg-primary/[0.12] text-foreground/80 hover:text-foreground rounded-full font-label text-[10px] sm:text-[11px] uppercase tracking-widest transition-colors border border-primary/10 hover:border-primary/20 min-h-[36px] sm:min-h-[44px]"
                        >
                          <Sparkles className="inline-block w-3 h-3 mr-1.5 text-primary/50 -mt-0.5" />
                          {rec}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Active conversation: messages area */}
          {hasConversation && (
            <ScrollArea
              className="h-[320px] sm:h-[420px] px-4 sm:px-6 py-4 sm:py-5"
              ref={scrollRef}
            >
              <div className="space-y-4 sm:space-y-5">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                      message.role === "user"
                        ? "ml-6 sm:ml-12 md:ml-16"
                        : "mr-6 sm:mr-12 md:mr-16"
                    }`}
                  >
                    <div
                      className={`font-label text-[10px] font-bold tracking-widest uppercase mb-1.5 ${
                        message.role === "user"
                          ? "text-right text-muted-foreground/70"
                          : "text-primary/80"
                      }`}
                    >
                      {message.role === "user" ? "You" : "Mike's AI"}
                    </div>
                    <div
                      className={`rounded-xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary/5 text-right"
                          : "bg-surface-container-low"
                      }`}
                    >
                      <div className="prose prose-sm dark:prose-invert max-w-none text-sm sm:text-base text-foreground/85">
                        {message.role === "assistant" ? (
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => (
                                <p className="mb-2 last:mb-0">{children}</p>
                              ),
                              a: ({ href, children }) => (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {children}
                                </a>
                              ),
                            }}
                          >
                            {message.content || "..."}
                          </ReactMarkdown>
                        ) : (
                          <p>{message.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Streaming indicator */}
                {isStreaming &&
                  messages[messages.length - 1]?.role === "assistant" &&
                  !messages[messages.length - 1]?.content && (
                    <div className="flex items-center gap-1.5 text-muted-foreground pl-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse [animation-delay:300ms]" />
                    </div>
                  )}
              </div>
            </ScrollArea>
          )}

          {/* In-conversation follow-ups */}
          {hasConversation &&
            !isStreaming &&
            stitchRecommendations.length > 0 && (
              <div className="px-4 sm:px-6 py-3 border-t border-border/50 bg-surface-container-low/50">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3 h-3 text-primary/50" />
                  <p className="font-label text-[10px] text-muted-foreground tracking-widest font-bold uppercase">
                    Continue the conversation
                    {DEV_MODE && (
                      <span className="ml-1.5 font-mono text-[9px] text-muted-foreground/50">
                        [{stitchSource}]
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {stitchRecommendations.map((rec, index) => (
                    <button
                      key={`follow-${index}`}
                      onClick={() => handleStarterClick(rec)}
                      className="px-3 py-1.5 text-xs bg-primary/[0.06] hover:bg-primary/[0.12] text-foreground/75 hover:text-foreground rounded-full transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-primary/10 hover:border-primary/15 font-label"
                    >
                      {rec}
                    </button>
                  ))}
                </div>
              </div>
            )}

          {/* Error Message */}
          {error && (
            <div className="px-4 py-2.5 text-center text-sm text-destructive bg-destructive/5 border-t border-destructive/10">
              {error}
            </div>
          )}

          {/* Lead Capture Form */}
          {showLeadForm && !leadSubmitted && (
            <div className="px-4 sm:px-6 py-4 bg-primary/[0.04] border-t border-primary/10 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Mail size={15} className="text-primary" />
                  <span>Want Mike to follow up?</span>
                </div>
                <button
                  onClick={dismissLeadForm}
                  className="text-muted-foreground hover:text-foreground p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm transition-colors"
                  aria-label="Dismiss"
                >
                  <X size={15} />
                </button>
              </div>
              <form onSubmit={handleLeadSubmit} className="space-y-2.5">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={leadInfo.name}
                    onChange={(e) =>
                      setLeadInfo({ ...leadInfo, name: e.target.value })
                    }
                    className="flex-1 h-11 sm:h-9 text-sm rounded-xl"
                    disabled={isSubmittingLead}
                  />
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={leadInfo.email}
                    onChange={(e) =>
                      setLeadInfo({ ...leadInfo, email: e.target.value })
                    }
                    className="flex-1 h-11 sm:h-9 text-sm rounded-xl"
                    disabled={isSubmittingLead}
                  />
                  <Button
                    type="submit"
                    disabled={isSubmittingLead}
                    className="h-11 sm:h-9 px-5 text-sm whitespace-nowrap rounded-xl"
                  >
                    {isSubmittingLead ? "..." : "Send"}
                  </Button>
                </div>
                {leadError && (
                  <p className="text-xs text-destructive">{leadError}</p>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Leave your info and Mike will get a copy of this
                    conversation.
                  </p>
                  <button
                    type="button"
                    onClick={dismissLeadForm}
                    className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
                  >
                    Skip
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lead Submitted Confirmation */}
          {leadSubmitted && (
            <div className="px-4 py-2.5 bg-green-50 dark:bg-green-900/20 border-t border-green-200/50 dark:border-green-800/50 text-center animate-in fade-in duration-300">
              <p className="text-sm text-green-700 dark:text-green-400">
                Thanks! Mike will receive this conversation.
              </p>
            </div>
          )}

          {/* Input Area — shown only when conversation is active */}
          {hasConversation && (
            <div className="p-3 sm:p-4 bg-surface-container-low/30 border-t border-border/60">
              <form onSubmit={handleSubmit} className="flex gap-2 items-end">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  disabled={isStreaming}
                  className="flex-1 min-h-[44px] max-h-[100px] resize-none text-base sm:text-sm rounded-xl bg-card border-border/60 focus:border-primary/40 transition-colors"
                  rows={1}
                />
                <Button
                  type="submit"
                  disabled={isStreaming || !input.trim()}
                  className="h-11 w-11 sm:h-10 sm:w-10 p-0 rounded-xl flex-shrink-0 transition-transform active:scale-95"
                >
                  <Send size={18} className="sm:w-4 sm:h-4" />
                </Button>
              </form>

              {remainingMessages !== null && (
                <p className="font-label text-[10px] text-muted-foreground/70 text-center mt-2 tracking-widest">
                  {remainingMessages} messages remaining
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="pb-6 sm:pb-8 flex flex-col items-center">
        <button
          onClick={scrollToContent}
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
        >
          <span className="font-label text-[10px] tracking-widest uppercase">
            More about Mike
          </span>
          <ChevronDown className="w-4 h-4 animate-scroll-hint" />
        </button>
      </div>
    </section>
  );
}
