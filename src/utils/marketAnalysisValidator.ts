
/**
 * Validates if the user input is related to market research or analysis
 * @param input The user input text to validate
 * @returns An object indicating if the input is valid and an error message if not
 */
export const validateMarketQuery = (input: string): { isValid: boolean; errorMessage?: string } => {
  // Convert to lowercase for case-insensitive matching
  const lowercaseInput = input.toLowerCase();
  
  // Keywords related to market research and analysis
  const marketKeywords = [
    'market', 'analysis', 'research', 'trend', 'competitor', 'competition', 'consumer',
    'customer', 'demographic', 'segment', 'industry', 'swot', 'pestle', 'pestel', 'porter',
    'business', 'strategy', 'growth', 'opportunity', 'threat', 'forecast', 'projection',
    'sales', 'revenue', 'profit', 'pricing', 'product', 'service', 'brand', 'marketing',
    'advertising', 'promotion', 'target', 'audience', 'buyer', 'behavior', 'demand',
    'supply', 'economy', 'economic', 'stat', 'statistics', 'data', 'survey', 'focus group',
    'interview', 'questionnaire', 'sentiment', 'share', 'position', 'landscape'
  ];
  
  // Check if any keyword is present in the input
  const containsMarketKeyword = marketKeywords.some(keyword => 
    lowercaseInput.includes(keyword)
  );
  
  if (!containsMarketKeyword) {
    return {
      isValid: false,
      errorMessage: "Please ask a question related to market research or analysis. I'm specialized in helping with market insights, trends, competition analysis, and consumer behavior."
    };
  }
  
  return { isValid: true };
};

// Sample suggestions for market research queries
export const marketQuerySuggestions = [
  "What are the current trends in the smartphone market?",
  "Analyze the competition in the electric vehicle industry",
  "What is the target demographic for luxury fashion brands?",
  "How has consumer behavior changed in online grocery shopping?",
  "What marketing strategies work best for SaaS products?",
  "Conduct a SWOT analysis for a coffee shop startup"
];
