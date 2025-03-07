import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import type { ChatMessage } from "@shared/schema";

const formSchema = z.object({
  message: z.string().min(1, "Please enter a message"),
});

const MESSAGE_LIMIT = 3;

export function ChatInterface() {
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [userMessageCount, setUserMessageCount] = useState(0);

  const { data: messages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat"],
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const message = {
        content: values.message,
        isBot: false,
        timestamp: new Date().toISOString(),
      };
      await apiRequest("POST", "/api/chat", message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat"] });
      form.reset();
      setUserMessageCount(prev => prev + 1);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Count user messages on component mount
  useEffect(() => {
    const userMessages = messages.filter(msg => !msg.isBot).length;
    setUserMessageCount(userMessages);
  }, [messages]);

  const hasReachedLimit = userMessageCount >= MESSAGE_LIMIT;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Chat with Me</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea
          ref={scrollRef}
          className="h-[400px] pr-4"
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <p>Loading chat history...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex ${
                    message.isBot ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.isBot
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}
              {hasReachedLimit && (
                <div className="text-center mt-4 text-sm text-muted-foreground">
                  You've reached the maximum number of messages for this chat session.
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            className="flex w-full gap-2"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder={hasReachedLimit ? "Message limit reached" : "Type your message..."}
                      disabled={hasReachedLimit}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={hasReachedLimit || mutation.isPending}
            >
              Send
            </Button>
          </form>
        </Form>
      </CardFooter>
    </Card>
  );
}