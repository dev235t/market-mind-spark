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
import { BarChart, LineChart, TrendingUp, Users, Key } from "lucide-react";
import FeatureHighlight from "@/components/FeatureHighlight";

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
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages, chatState.isLoading]);

  const handleApiKeySubmit = (key: string) => {
    if (key.trim()) {
      setGeminiApiKey(key);
      setIsApiKeySet(true);
      toast.success("API Key added successfully!");
    }
  };

  const generateResponse = async (query: string) => {
    if (!isApiKeySet) {
      toast.error("Please enter your Gemini API key first.");
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
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
        error: "Sorry, there was an error analyzing your market query. Please check your API key.",
      }));
      
      toast.error("Analysis failed", {
        description: "Error with Gemini API. Check your API key.",
      });
    }
  };

  const handleSendMessage = (content: string) => {
    if (!isApiKeySet) {
      toast.error("Please enter your Gemini API key first.");
      return;
    }

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
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      {!isApiKeySet && (
        <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Enter Gemini API Key"
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
            className="px-3 py-2 border rounded-md"
          />
          <button
            onClick={() => handleApiKeySubmit(geminiApiKey)}
            className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Key size={16} /> Set Key
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-2">
          {chatState.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {chatState.isLoading && <LoadingMessage />}
          
          {chatState.error && <ErrorMessage message={chatState.error} />}
          
          {chatState.messages.length === 1 && (
            <div className="my-8">
              <h2 className="text-xl font-semibold mb-4 text-center">What Market Mind Spark can do for you</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FeatureHighlight
                  icon={<TrendingUp size={24} />}
                  title="Trend Analysis"
                  description="Identify emerging market trends and patterns to stay ahead of the competition."
                />
                <FeatureHighlight
                  icon={<BarChart size={24} />}
                  title="Competitive Research"
                  description="Analyze competitors' strengths and weaknesses to find your market advantage."
                />
                <FeatureHighlight
                  icon={<Users size={24} />}
                  title="Consumer Insights"
                  description="Understand customer behavior, preferences, and purchase decisions."
                />
                <FeatureHighlight
                  icon={<LineChart size={24} />}
                  title="Growth Opportunities"
                  description="Discover untapped market segments and expansion possibilities."
                />
              </div>
            </div>
          )}
          
          {showSuggestions && (
            <div className="my-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Try asking about:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
      
      <div className="border-t bg-background/80 backdrop-blur-sm p-4">
        <ChatInput 
          onSend={handleSendMessage} 
          disabled={chatState.isLoading}
        />
        <p className="text-xs text-center text-muted-foreground mt-2">
          Market Mind Spark specializes in market research, trend analysis, and competitive insights.
        </p>
      </div>
    </div>
  );
};

export default MarketResearchChat;
