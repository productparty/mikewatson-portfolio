import { useState } from "react";
import { ChatInterface } from "@/components/chat-interface";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          <MessageSquare size={20} />
          Chat with AI Assistant
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Chat with AI Assistant</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <ChatInterface />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
