
import React from "react";
import { MessageSquare } from "lucide-react";

interface SuggestionChipProps {
  suggestion: string;
  onClick: (suggestion: string) => void;
  delay?: number;
}

const SuggestionChip: React.FC<SuggestionChipProps> = ({ suggestion, onClick, delay = 0 }) => {
  const truncatedSuggestion = suggestion.length > 50 
    ? suggestion.substring(0, 50) + "..." 
    : suggestion;

  return (
    <button
      className="suggestion-chip flex items-center gap-2 px-4 py-3 bg-card hover:bg-primary/5 border border-border rounded-lg text-left animate-scale-in transition-all duration-300"
      onClick={() => onClick(suggestion)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <MessageSquare size={16} className="text-primary flex-shrink-0" />
      <span className="text-sm">{truncatedSuggestion}</span>
    </button>
  );
};

export default SuggestionChip;
