
import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { ChatState, Message } from "@/types/chat";
import { validateMarketQuery, marketQuerySuggestions } from "@/utils/marketAnalysisValidator";
import ChatMessage from "@/components/ChatMessage";
import LoadingMessage from "@/components/LoadingMessage";
import ErrorMessage from "@/components/ErrorMessage";
import ChatInput from "@/components/ChatInput";
import SuggestionChip from "@/components/SuggestionChip";
import { BarChart, LineChart, TrendingUp, Users } from "lucide-react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages, chatState.isLoading]);

  const handleSendMessage = (content: string) => {
    // Validate if the message is related to market research
    const validation = validateMarketQuery(content);
    
    if (!validation.isValid) {
      setChatState(prev => ({
        ...prev,
        error: validation.errorMessage || "Please ask a market research related question.",
      }));
      
      // Clear error after 5 seconds
      setTimeout(() => {
        setChatState(prev => ({ ...prev, error: null }));
      }, 5000);
      
      return;
    }
    
    // Clear any previous errors
    if (chatState.error) {
      setChatState(prev => ({ ...prev, error: null }));
    }
    
    // Add user message
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
    
    // Hide suggestions after user sends first message
    if (showSuggestions) {
      setShowSuggestions(false);
    }
    
    // Simulate AI response (this would be replaced with an actual API call)
    setTimeout(() => {
      generateResponse(content);
    }, 1500);
  };

  const generateResponse = (query: string) => {
    // This is a simulated response. In a real application, you would call an API.
    try {
      // Generate a more complex response based on the query
      let responseContent = "";
      
      if (query.toLowerCase().includes("trend")) {
        responseContent = `# Market Trend Analysis\n\nBased on recent data, the following trends are emerging:\n\n1. Increased consumer preference for sustainable products\n2. Growing adoption of subscription-based models\n3. Rise in mobile-first shopping experiences\n\nThese trends indicate a shift towards more conscious consumption patterns and convenience-oriented services.`;
      } else if (query.toLowerCase().includes("competition") || query.toLowerCase().includes("competitor")) {
        responseContent = `# Competitive Landscape\n\nThe market currently shows the following competitive dynamics:\n\n- Market Leaders: Companies A, B, and C control 65% of market share\n- Emerging Players: Several startups focusing on niche segments\n- Competitive Factors: Price, quality, and customer service remain key differentiators\n\nA direct competitor analysis would require more specific industry information.`;
      } else if (query.toLowerCase().includes("consumer") || query.toLowerCase().includes("customer")) {
        responseContent = `# Consumer Behavior Insights\n\nRecent consumer research indicates:\n\n- Purchase decisions are increasingly influenced by social media\n- Consumers expect seamless omnichannel experiences\n- 68% of customers research products online before making purchases\n- Brand loyalty is declining, with 43% of consumers willing to switch brands for better experiences`;
      } else if (query.toLowerCase().includes("swot")) {
        responseContent = `# SWOT Analysis Framework\n\n## Strengths\n- Unique selling proposition\n- Strong brand recognition\n- Efficient supply chain\n\n## Weaknesses\n- Limited market reach\n- Higher production costs\n- Talent acquisition challenges\n\n## Opportunities\n- Emerging market segments\n- Technological innovations\n- Strategic partnerships\n\n## Threats\n- Intense competition\n- Changing regulations\n- Economic uncertainty`;
      } else {
        responseContent = `Based on my market analysis, there are several key insights to consider:\n\n1. The market is showing a compound annual growth rate (CAGR) of approximately 7.2%\n\n2. Consumer preferences are shifting toward more sustainable and ethically sourced products\n\n3. Digital transformation continues to disrupt traditional business models in this sector\n\nTo gain competitive advantage, companies should focus on innovation, customer experience enhancement, and operational efficiency. Would you like me to elaborate on any specific aspect of this market analysis?`;
      }
      
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
      
      // Show a toast notification for successfully completed analysis
      toast.success("Market analysis completed", {
        description: "The requested market insights have been generated.",
      });
      
    } catch (error) {
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: "Sorry, there was an error analyzing your market query. Please try again.",
      }));
      
      toast.error("Analysis failed", {
        description: "There was an error processing your request.",
      });
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Messages section */}
        <div className="space-y-2">
          {chatState.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {chatState.isLoading && <LoadingMessage />}
          
          {chatState.error && <ErrorMessage message={chatState.error} />}
          
          {/* Feature highlights shown when no conversation has started */}
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
          
          {/* Suggestions */}
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
      
      {/* Input section */}
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
