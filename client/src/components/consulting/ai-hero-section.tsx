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
    <section className="relative min-h-[calc(100vh-64px)] flex flex-col">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-transparent pointer-events-none" />

      <div className="relative flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="w-full max-w-3xl mx-auto">
          {/* Intro Section */}
          {!hasConversation && (
            <div className="text-center mb-8 sm:mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Avatar with glow */}
              <div className="flex justify-center mb-4 sm:mb-5">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-primary/40 to-accent/30 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  <img
                    src={PERSONAL_INFO.avatar}
                    alt="Mike Watson"
                    className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover ring-2 ring-card shadow-xl"
                  />
                </div>
              </div>

              {/* Identity */}
              <h1 className="text-3xl sm:text-5xl font-black text-foreground font-display tracking-tight mb-1.5">
                Mike Watson
              </h1>
              <p className="text-sm sm:text-base text-primary font-semibold tracking-wide uppercase mb-4 sm:mb-5">
                Senior Product Manager
              </p>

              {/* Value proposition */}
              <div className="max-w-lg mx-auto space-y-2 px-2">
                <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed">
                  I trained an AI on 150+ newsletter posts, 10 years of PM
                  work, and the opinions I save for the second coffee.
                </p>
                <p className="text-base sm:text-xl font-semibold text-foreground/90">
                  Skip the resume. Interview me instead.
                </p>
              </div>
            </div>
          )}

          {/* Chat Container */}
          <div
            ref={chatContainerRef}
            className={`bg-card rounded-2xl shadow-xl ring-1 ring-border/50 overflow-hidden transition-shadow duration-300 ${
              hasConversation ? "shadow-2xl" : ""
            }`}
          >
            {/* Messages Area */}
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
                        className={`text-[11px] font-semibold tracking-widest uppercase mb-1.5 ${
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
                            : "bg-muted/40"
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

            {/* Prompt Sections - pre-conversation */}
            {!hasConversation && (
              <div className="px-4 sm:px-6 py-5 sm:py-6 space-y-5 animate-in fade-in duration-500 delay-200">
                {/* Starter Questions */}
                <div>
                  <p className="text-xs text-muted-foreground text-center mb-3 tracking-wide font-medium">
                    Ask about my experience, approach, or what I'm looking for
                    next
                  </p>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:justify-center">
                    {STARTER_QUESTIONS.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleStarterClick(question)}
                        className="group px-4 py-2.5 sm:py-2 text-sm text-left sm:text-center bg-muted/60 hover:bg-muted text-foreground/80 hover:text-foreground rounded-xl sm:rounded-full transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
                        style={{
                          animationDelay: `${index * 60}ms`,
                        }}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-border/60" />
                  <Sparkles className="w-3.5 h-3.5 text-primary/50" />
                  <div className="flex-1 h-px bg-border/60" />
                </div>

                {/* Stitch Recommendations */}
                <div>
                  <p className="text-xs text-muted-foreground text-center mb-3 tracking-wide font-medium">
                    AI-suggested follow-ups
                    {DEV_MODE && (
                      <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground/60">
                        {stitchSource}
                      </span>
                    )}
                  </p>

                  {isLoadingStitch ? (
                    <div className="flex justify-center gap-2 py-3">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-8 rounded-full bg-muted animate-pulse"
                          style={{
                            width: `${80 + i * 30}px`,
                            animationDelay: `${i * 150}ms`,
                          }}
                        />
                      ))}
                    </div>
                  ) : stitchRecommendations.length > 0 ? (
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:justify-center">
                      {stitchRecommendations.map((rec, index) => (
                        <button
                          key={`stitch-${index}`}
                          onClick={() => handleStarterClick(rec)}
                          className="group relative px-4 py-2.5 sm:py-2 text-sm text-left sm:text-center rounded-xl sm:rounded-full transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px] bg-primary/[0.07] hover:bg-primary/[0.14] text-foreground/90 hover:text-foreground border border-primary/10 hover:border-primary/20"
                          style={{
                            animationDelay: `${index * 80 + 300}ms`,
                          }}
                        >
                          <Sparkles className="inline-block w-3 h-3 mr-1.5 text-primary/50 group-hover:text-primary/70 transition-colors -mt-0.5" />
                          {rec}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground/60 text-center py-1">
                      Type anything below to get started.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* In-conversation follow-ups */}
            {hasConversation &&
              !isStreaming &&
              stitchRecommendations.length > 0 && (
                <div className="px-4 sm:px-6 py-3 border-t border-border/50 bg-muted/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3 h-3 text-primary/50" />
                    <p className="text-[11px] text-muted-foreground tracking-wide font-medium uppercase">
                      Continue the conversation
                      {DEV_MODE && (
                        <span className="ml-1.5 font-mono text-[10px] text-muted-foreground/50">
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
                        className="px-3 py-1.5 text-xs bg-primary/[0.06] hover:bg-primary/[0.12] text-foreground/75 hover:text-foreground rounded-full transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-primary/10 hover:border-primary/15"
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

            {/* Input Area */}
            <div className="p-3 sm:p-4 bg-muted/30 border-t border-border/60">
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
                <p className="text-[11px] text-muted-foreground/70 text-center mt-2 tracking-wide">
                  {remainingMessages} messages remaining
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="pb-6 flex flex-col items-center">
        <button
          onClick={scrollToContent}
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
        >
          <span className="text-xs tracking-wide">More about Mike</span>
          <ChevronDown className="w-4 h-4 animate-scroll-hint" />
        </button>
      </div>
    </section>
  );
}
