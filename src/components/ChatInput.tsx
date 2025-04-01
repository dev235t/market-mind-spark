
import React, { useState, useRef, useEffect } from "react";
import { SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled = false }) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea based on content height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 150)}px`;
    }
  }, [input]);

  return (
    <div className="relative flex items-end border bg-card rounded-lg shadow-sm focus-within:ring-1 focus-within:ring-primary/50">
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about market research, trends, competition..."
        className="min-h-[60px] max-h-[150px] border-0 focus-visible:ring-0 resize-none pr-14 py-4"
        disabled={disabled}
      />
      <Button
        type="button"
        size="icon"
        className="absolute right-2 bottom-2 w-10 h-10 rounded-full"
        onClick={handleSend}
        disabled={!input.trim() || disabled}
      >
        <SendIcon size={18} className="text-white" />
      </Button>
    </div>
  );
};

export default ChatInput;
