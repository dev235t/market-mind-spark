
import React from "react";
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { BarChart, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
        {isUser ? (
          message.content
        ) : (
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-primary mb-2" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-primary mb-2" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-md font-bold text-primary mb-1" {...props} />,
              h4: ({ node, ...props }) => <h4 className="text-sm font-bold text-primary mb-1" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-bold text-green-600" {...props} />,
              p: ({ node, ...props }) => <p className="mb-2" {...props} />
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
        
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
