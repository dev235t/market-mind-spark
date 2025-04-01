
import React from "react";
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { ChevronRight, BarChart, User } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex items-start gap-3 py-4 animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isUser ? "bg-primary text-white" : "bg-brand-light text-white"
        )}
      >
        {isUser ? <User size={18} /> : <BarChart size={18} />}
      </div>
      
      <div
        className={cn(
          "chat-bubble",
          isUser ? "user-bubble" : "assistant-bubble"
        )}
      >
        {message.content.split("\n").map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < message.content.split("\n").length - 1 && <br />}
          </React.Fragment>
        ))}
        
        {!isUser && (
          <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <span>Market Mind Spark</span>
            <span>•</span>
            <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
