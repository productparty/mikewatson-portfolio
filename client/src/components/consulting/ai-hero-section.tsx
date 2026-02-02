import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { PERSONAL_INFO } from "@/lib/constants";

interface Message {
  role: "user" | "assistant";
  content: string;
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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

  const scrollToContent = () => {
    const target = document.querySelector("#portfolio-content");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const hasConversation = messages.length > 0;

  return (
    <section className="relative min-h-[calc(100vh-64px)] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-6">
        <div className="w-full max-w-3xl mx-auto">
          {/* Compact Header - Only show when no messages */}
          {!hasConversation && (
            <div className="flex items-center gap-4 mb-6">
              {/* Photo - smaller, circular */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-pm-primary/30 to-sky-500/30 rounded-full blur-xl scale-110" />
                  <img
                    src={PERSONAL_INFO.avatar}
                    alt="Mike Watson"
                    className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-3 border-white dark:border-slate-700 shadow-lg"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display leading-tight">
                  Mike Watson
                </h1>
                <p className="text-sm sm:text-base text-pm-primary dark:text-blue-400 font-semibold mb-1">
                  Senior Product Manager
                </p>
                <p className="text-sm text-pm-muted dark:text-slate-400 leading-snug hidden sm:block">
                  I trained an AI on 150+ newsletter posts, 10 years of PM work,
                  and the opinions I save for the second coffee.
                </p>
              </div>
            </div>
          )}

          {/* Chat Container */}
          <div
            ref={chatContainerRef}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            {/* Messages Area */}
            {hasConversation && (
              <ScrollArea className="h-[350px] sm:h-[400px] px-4 py-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={message.role === "user" ? "ml-8 md:ml-12" : "mr-8 md:mr-12"}
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
                        className={`prose prose-sm dark:prose-invert max-w-none ${
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
              <div className="px-4 py-4">
                <p className="text-xs text-pm-muted dark:text-slate-400 text-center mb-3 uppercase tracking-wide font-medium">
                  Try asking
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {STARTER_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleStarterClick(question)}
                      className="px-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-700 hover:bg-pm-primary/10 dark:hover:bg-slate-600 text-pm-body dark:text-slate-300 rounded-full transition-colors border border-slate-200 dark:border-slate-600 hover:border-pm-primary/30"
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

            {/* Input Area */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700">
              <form onSubmit={handleSubmit} className="flex gap-2 items-end">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  disabled={isStreaming}
                  className="flex-1 min-h-[42px] max-h-[100px] resize-none bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-pm-primary dark:focus:border-blue-400 text-sm"
                  rows={1}
                />
                <Button
                  type="submit"
                  disabled={isStreaming || !input.trim()}
                  className="h-10 w-10 p-0 bg-pm-primary hover:bg-pm-primary/90 rounded-xl"
                >
                  <Send size={16} />
                </Button>
              </form>

              {remainingMessages !== null && (
                <p className="text-xs text-pm-muted dark:text-slate-500 text-center mt-2">
                  {remainingMessages} messages remaining
                </p>
              )}
            </div>
          </div>

          {/* Mobile-only tagline */}
          {!hasConversation && (
            <p className="text-sm text-pm-muted dark:text-slate-400 text-center mt-4 sm:hidden px-4">
              I trained an AI on 150+ newsletter posts and 10 years of PM work. Ask it anything.
            </p>
          )}
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
