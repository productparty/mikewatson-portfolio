import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ChevronDown, X, Mail } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { PERSONAL_INFO } from "@/lib/constants";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface LeadInfo {
  name: string;
  email: string;
}

const STARTER_QUESTIONS = [
  "What's the story behind 3,000% e-notary growth?",
  "How do you approach inheriting a messy backlog?",
  "Tell me about building Leafed as a non-developer",
  "What's your take on AI replacing PMs?",
  "What are you looking for in your next role?",
];

export function AIHeroSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [remainingMessages, setRemainingMessages] = useState<number | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
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

  // Show lead form after first complete exchange (2 messages: user + assistant response)
  useEffect(() => {
    if (messages.length >= 2 && !leadSubmitted && !leadDismissed && !showLeadForm) {
      // Delay showing form so it doesn't interrupt the conversation
      const timer = setTimeout(() => {
        setShowLeadForm(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [messages.length, leadSubmitted, leadDismissed, showLeadForm]);

  // Send transcript when user leaves the page (if lead was submitted)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (leadSubmitted && messages.length > 0) {
        // Use sendBeacon for reliable delivery on page close
        navigator.sendBeacon(
          "/api/chat-transcript",
          JSON.stringify({ sessionId, messages })
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [leadSubmitted, messages, sessionId]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const sendMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim() || isStreaming) return;

      setError(null);
      const userMessage: Message = { role: "user", content: messageText.trim() };
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
      } catch (err) {
        console.error("Chat error:", err);
        setError("Something went wrong. Please try again.");
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsStreaming(false);
      }
    },
    [sessionId, isStreaming]
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

    // Basic email validation
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
          messages, // Send current messages to store transcript
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
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="w-full max-w-3xl mx-auto">
          {/* Intro Section - Only show when no messages */}
          {!hasConversation && (
            <div className="text-center mb-6 sm:mb-8">
              {/* Photo */}
              <div className="flex justify-center mb-3 sm:mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-pm-primary/30 to-sky-500/30 rounded-full blur-xl scale-110" />
                  <img
                    src={PERSONAL_INFO.avatar}
                    alt="Mike Watson"
                    className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-lg"
                  />
                </div>
              </div>

              {/* Name & Title */}
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-display mb-1">
                Mike Watson
              </h1>
              <p className="text-base sm:text-lg text-pm-primary dark:text-blue-400 font-semibold mb-3 sm:mb-4">
                Senior Product Manager
              </p>

              {/* Value Proposition */}
              <p className="text-sm sm:text-lg text-pm-muted dark:text-slate-400 leading-relaxed max-w-xl mx-auto mb-2 px-2">
                I trained an AI on 150+ newsletter posts, 10 years of PM work,
                and the opinions I save for the second coffee.
              </p>
              <p className="text-base sm:text-xl font-semibold text-slate-700 dark:text-slate-200">
                Skip the resume. Interview me instead.
              </p>
            </div>
          )}

          {/* Chat Container */}
          <div
            ref={chatContainerRef}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            {/* Messages Area */}
            {hasConversation && (
              <ScrollArea className="h-[300px] sm:h-[400px] px-3 sm:px-4 py-3 sm:py-4" ref={scrollRef}>
                <div className="space-y-3 sm:space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={message.role === "user" ? "ml-4 sm:ml-8 md:ml-12" : "mr-4 sm:mr-8 md:mr-12"}
                    >
                      <div
                        className={`text-xs font-medium mb-1 ${
                          message.role === "user"
                            ? "text-right text-pm-muted dark:text-slate-400"
                            : "text-pm-primary dark:text-blue-400"
                        }`}
                      >
                        {message.role === "user" ? "You" : "Mike's AI"}
                      </div>
                      <div
                        className={`prose prose-sm dark:prose-invert max-w-none text-sm sm:text-base ${
                          message.role === "user"
                            ? "text-right text-pm-body dark:text-slate-300"
                            : "text-pm-body dark:text-slate-300"
                        }`}
                      >
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
                                  className="text-pm-primary dark:text-blue-400 hover:underline"
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
                  ))}
                </div>
              </ScrollArea>
            )}

            {/* Starter Questions */}
            {!hasConversation && (
              <div className="px-3 sm:px-6 py-4 sm:py-5">
                <p className="text-xs sm:text-sm text-pm-muted dark:text-slate-400 text-center mb-3 sm:mb-4">
                  Ask about my experience, approach, or what I'm looking for next:
                </p>
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:justify-center">
                  {STARTER_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleStarterClick(question)}
                      className="px-4 py-2.5 sm:py-2 text-sm text-left sm:text-center bg-slate-50 dark:bg-slate-700 hover:bg-pm-primary/10 dark:hover:bg-slate-600 text-pm-body dark:text-slate-300 rounded-xl sm:rounded-full transition-colors border border-slate-200 dark:border-slate-600 hover:border-pm-primary/30 active:scale-[0.98]"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="px-4 py-2 text-center text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-t border-red-100 dark:border-red-800">
                {error}
              </div>
            )}

            {/* Lead Capture Form */}
            {showLeadForm && !leadSubmitted && (
              <div className="px-3 sm:px-4 py-3 bg-pm-primary/5 dark:bg-blue-900/20 border-t border-pm-primary/20 dark:border-blue-800">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                    <Mail size={16} className="text-pm-primary" />
                    <span>Want Mike to follow up?</span>
                  </div>
                  <button
                    onClick={dismissLeadForm}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
                    aria-label="Dismiss"
                  >
                    <X size={16} />
                  </button>
                </div>
                <form onSubmit={handleLeadSubmit} className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={leadInfo.name}
                      onChange={(e) => setLeadInfo({ ...leadInfo, name: e.target.value })}
                      className="flex-1 h-9 text-sm bg-white dark:bg-slate-800"
                      disabled={isSubmittingLead}
                    />
                    <Input
                      type="email"
                      placeholder="Your email"
                      value={leadInfo.email}
                      onChange={(e) => setLeadInfo({ ...leadInfo, email: e.target.value })}
                      className="flex-1 h-9 text-sm bg-white dark:bg-slate-800"
                      disabled={isSubmittingLead}
                    />
                    <Button
                      type="submit"
                      disabled={isSubmittingLead}
                      className="h-9 px-4 bg-pm-primary hover:bg-pm-primary/90 text-sm whitespace-nowrap"
                    >
                      {isSubmittingLead ? "..." : "Send"}
                    </Button>
                  </div>
                  {leadError && (
                    <p className="text-xs text-red-600 dark:text-red-400">{leadError}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-pm-muted dark:text-slate-400">
                      Leave your info and Mike will get a copy of this conversation.
                    </p>
                    <button
                      type="button"
                      onClick={dismissLeadForm}
                      className="text-xs text-pm-muted dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline"
                    >
                      Skip
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Lead Submitted Confirmation */}
            {leadSubmitted && (
              <div className="px-3 sm:px-4 py-2 bg-green-50 dark:bg-green-900/20 border-t border-green-200 dark:border-green-800 text-center">
                <p className="text-sm text-green-700 dark:text-green-400">
                  Thanks! Mike will receive this conversation.
                </p>
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700">
              <form onSubmit={handleSubmit} className="flex gap-2 items-end">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  disabled={isStreaming}
                  className="flex-1 min-h-[44px] max-h-[100px] resize-none bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-pm-primary dark:focus:border-blue-400 text-base sm:text-sm rounded-xl"
                  rows={1}
                />
                <Button
                  type="submit"
                  disabled={isStreaming || !input.trim()}
                  className="h-11 w-11 sm:h-10 sm:w-10 p-0 bg-pm-primary hover:bg-pm-primary/90 rounded-xl flex-shrink-0"
                >
                  <Send size={18} className="sm:w-4 sm:h-4" />
                </Button>
              </form>

              {remainingMessages !== null && (
                <p className="text-xs text-pm-muted dark:text-slate-500 text-center mt-2">
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
          className="flex flex-col items-center gap-1 text-pm-muted dark:text-slate-400 hover:text-pm-primary dark:hover:text-blue-400 transition-colors"
        >
          <span className="text-xs">More about Mike</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
