
import React from "react";

const LoadingMessage: React.FC = () => {
  return (
    <div className="flex items-start gap-3 py-4">
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-brand-light text-white">
        <span className="animate-pulse-slow">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 13.125C3 12.504 3.504 12 4.125 12H12.75C13.371 12 13.875 12.504 13.875 13.125C13.875 13.746 13.371 14.25 12.75 14.25H4.125C3.504 14.25 3 13.746 3 13.125Z" fill="currentColor"/>
            <path d="M3 7.875C3 7.254 3.504 6.75 4.125 6.75H19.875C20.496 6.75 21 7.254 21 7.875C21 8.496 20.496 9 19.875 9H4.125C3.504 9 3 8.496 3 7.875Z" fill="currentColor"/>
            <path d="M4.125 17.25C3.504 17.25 3 17.754 3 18.375C3 18.996 3.504 19.5 4.125 19.5H15.75C16.371 19.5 16.875 18.996 16.875 18.375C16.875 17.754 16.371 17.25 15.75 17.25H4.125Z" fill="currentColor"/>
          </svg>
        </span>
      </div>
      
      <div className="assistant-bubble flex items-center">
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span className="ml-2 text-muted-foreground">Analyzing market data...</span>
      </div>
    </div>
  );
};

export default LoadingMessage;
