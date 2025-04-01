
import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="flex items-start gap-3 py-4">
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-destructive text-white">
        <AlertCircle size={18} />
      </div>
      
      <div className="assistant-bubble bg-destructive/10 border border-destructive/20 text-destructive-foreground">
        <div className="flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <div>
            {message}
            <div className="text-xs text-destructive-foreground/70 mt-2">
              Please try asking a question related to market research or analysis.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
