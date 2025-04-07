import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatState, Message } from "@/types/chat";
import { validateMarketQuery, marketQuerySuggestions } from "@/utils/marketAnalysisValidator";
import ChatMessage from "@/components/ChatMessage";
import LoadingMessage from "@/components/LoadingMessage";
import ErrorMessage from "@/components/ErrorMessage";
import ChatInput from "@/components/ChatInput";
import SuggestionChip from "@/components/SuggestionChip";
import { TrendingUp, BarChart, Users, LineChart } from "lucide-react";
import FeatureHighlight from "@/components/FeatureHighlight";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "YOUR_API_KEY_HERE";

const initialMessages: Message[] = [
  {
    id: uuidv4(),
    role: "assistant",
    content: "Hello! I'm Market Mind Spark, your AI market research assistant. How can I help with your market analysis today?",
    timestamp: new Date(),
  },
];

const MarketResearchChat: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: initialMessages,
    isLoading: false,
    error: null,
  });
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages, chatState.isLoading]);

  const generateResponse = async (query: string) => {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent(`
        You are a Market Research AI Assistant. Provide a professional and detailed market analysis based on the following query: ${query}
        
        Include actionable insights, trends, and strategic recommendations. 
        Format your response in markdown for clear readability.
      `);

      const responseContent = result.response.text();

      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      };
      
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
      
      toast.success("Market analysis completed", {
        description: "Insights generated using Gemini AI.",
      });
      
    } catch (error) {
      console.error("Gemini API Error:", error);
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: "Sorry, there was an error analyzing your market query. Please check the API key configuration.",
      }));
      
      toast.error("Analysis failed", {
        description: "Error with Gemini API. Check the API key configuration.",
      });
    }
  };

  const handleSendMessage = (content: string) => {
    const validation = validateMarketQuery(content);
    
    if (!validation.isValid) {
      setChatState(prev => ({
        ...prev,
        error: validation.errorMessage || "Please ask a market research related question.",
      }));
      
      setTimeout(() => {
        setChatState(prev => ({ ...prev, error: null }));
      }, 5000);
      
      return;
    }
    
    if (chatState.error) {
      setChatState(prev => ({ ...prev, error: null }));
    }
    
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));
    
    if (showSuggestions) {
      setShowSuggestions(false);
    }
    
    generateResponse(content);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto animate-fadeIn space-y-6">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        <div className="space-y-6">
          {chatState.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {chatState.isLoading && <LoadingMessage />}
          
          {chatState.error && <ErrorMessage message={chatState.error} />}
          
          {chatState.messages.length === 1 && (
            <div className="my-8 animate-scaleIn space-y-6">
              <h2 className="text-2xl font-bold text-center text-green-700 mb-6">What Market Mind Spark can do for you</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FeatureHighlight
                  icon={<TrendingUp size={24} className="text-green-500" />}
                  title="Trend Analysis"
                  description="Identify emerging market trends and patterns to stay ahead of the competition."
                />
                <FeatureHighlight
                  icon={<BarChart size={24} className="text-green-500" />}
                  title="Competitive Research"
                  description="Analyze competitors' strengths and weaknesses to find your market advantage."
                />
                <FeatureHighlight
                  icon={<Users size={24} className="text-green-500" />}
                  title="Consumer Insights"
                  description="Understand customer behavior, preferences, and purchase decisions."
                />
                <FeatureHighlight
                  icon={<LineChart size={24} className="text-green-500" />}
                  title="Growth Opportunities"
                  description="Discover untapped market segments and expansion possibilities."
                />
              </div>
            </div>
          )}
          
          {showSuggestions && (
            <div className="my-8 animate-slideUp space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Try asking about:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {marketQuerySuggestions.map((suggestion, index) => (
                  <SuggestionChip
                    key={index}
                    suggestion={suggestion}
                    onClick={handleSuggestionClick}
                  />
                ))}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="border-t bg-background/80 backdrop-blur-sm p-4 animate-slideUp">
        <ChatInput 
          onSend={handleSendMessage} 
          disabled={chatState.isLoading}
        />
        <p className="text-xs text-center text-muted-foreground mt-4">
          Market Mind Spark specializes in <strong className="text-green-600">market research</strong>, <strong className="text-green-600">trend analysis</strong>, and <strong className="text-green-600">competitive insights</strong>.
        </p>
      </div>
    </div>
  );
};

export default MarketResearchChat;
