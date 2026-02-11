import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTER_QUESTIONS = [
  "What's the story behind the 3,000% e-notary adoption growth?",
  "How do you approach inheriting a messy backlog?",
  "Tell me about building Leafed as a non-developer",
  "What's your take on AI replacing product managers?",
  "What are you looking for in your next role?",
];

export function PortfolioChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [remainingMessages, setRemainingMessages] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Save transcript to DB after each exchange (no email), send email only on page close
  useEffect(() => {
    // Only save if there's at least one complete exchange (user + assistant with content)
    if (messages.length >= 2 && !isStreaming) {
      const lastMessage = messages[messages.length - 1];
      // Only save when the last message is from assistant and has content (exchange complete)
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

  // Auto-resize textarea
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

      // Add placeholder for assistant response
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      try {
        const response = await fetch("/api/portfolio-chat/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: messageText.trim(), sessionId }),
        });

        if (!response.ok) {
          if (response.status === 429) {
            setError("You've reached the message limit. Please try again later.");
            setMessages((prev) => prev.slice(0, -1)); // Remove placeholder
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
        setMessages((prev) => prev.slice(0, -1)); // Remove placeholder
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

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4 py-6" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="space-y-8">
            {/* Introduction */}
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Ask Me Anything
              </h2>
              <p className="text-foreground max-w-xl mx-auto leading-relaxed">
                I trained an AI on 2+ years of my writing, my project work, and my
                professional experience. This isn't a generic chatbot. It's the
                closest thing to having a conversation with me without scheduling a
                call.
              </p>
              <p className="text-sm text-muted-foreground">
                It's not actually me, but it's trained on my voice and experience.
              </p>
            </div>

            {/* Starter Questions */}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Try asking about:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {STARTER_QUESTIONS.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleStarterClick(question)}
                    className="px-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-foreground rounded-lg transition-colors text-left"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.role === "user"
                    ? "ml-8 md:ml-16"
                    : "mr-8 md:mr-16"
                }`}
              >
                <div
                  className={`text-sm font-medium mb-1 ${
                    message.role === "user"
                      ? "text-right text-muted-foreground"
                      : "text-primary"
                  }`}
                >
                  {message.role === "user" ? "You" : "Mike's AI"}
                </div>
                <div
                  className={`prose prose-sm dark:prose-invert max-w-none ${
                    message.role === "user"
                      ? "text-right text-foreground"
                      : "text-foreground"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="mb-3 last:mb-0">{children}</p>
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
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 text-center text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
          {error}
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-slate-200 dark:border-slate-700 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            disabled={isStreaming}
            className="flex-1 min-h-[44px] max-h-[120px] resize-none bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-primary"
            rows={1}
          />
          <Button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="h-11 w-11 p-0 bg-primary hover:bg-primary/90"
          >
            <Send size={18} />
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-3 text-center space-y-1">
          {remainingMessages !== null && (
            <p className="text-xs text-muted-foreground">
              {remainingMessages} messages remaining this session
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Built by Mike Watson using Claude API + a custom knowledge corpus.{" "}
            <span className="text-primary">
              Another example of a PM who ships.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
