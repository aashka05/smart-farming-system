// @desc    Chat with AI farming assistant
// @route   POST /api/chat
// @access  Public (limited) / Private (full)
const chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Mock AI response — will be replaced with LangChain/LangGraph integration
    const response = generateMockResponse(message.toLowerCase());

    res.json({
      reply: response,
      source: 'mock-ai',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing chat', error: error.message });
  }
};

// @desc    Get suggested questions
// @route   GET /api/chat/suggestions
// @access  Public
const getSuggestions = async (req, res) => {
  res.json({
    suggestions: [
      'What crops should I grow this season?',
      'How to prevent leaf blight in rice?',
      'When is the best time to irrigate wheat?',
      'What is the current market price of cotton?',
      'How to improve soil fertility naturally?',
      'What are the signs of nitrogen deficiency?',
      'Best organic pesticides for vegetables?',
      'How to set up drip irrigation?',
    ],
  });
};

function generateMockResponse(message) {
  if (message.includes('weather') || message.includes('rain')) {
    return 'Based on current weather patterns, moderate rainfall is expected in your region this week. I recommend delaying any pesticide application and ensuring proper drainage in your fields. Would you like specific weather data for your area?';
  }
  if (message.includes('crop') || message.includes('grow') || message.includes('season')) {
    return 'For the current season, I recommend considering Rice, Maize, or Cotton depending on your soil type. Alluvial soil is best for Rice, while Black soil suits Cotton well. Would you like a detailed crop recommendation based on your specific conditions?';
  }
  if (message.includes('disease') || message.includes('pest') || message.includes('blight')) {
    return 'Common crop diseases this season include Leaf Blight, Brown Spot, and Bacterial Wilt. Prevention includes proper spacing, seed treatment with fungicides, and maintaining field hygiene. Would you like specific treatment recommendations for your crop?';
  }
  if (message.includes('price') || message.includes('market') || message.includes('sell')) {
    return 'Current market prices show Wheat at ₹2,300/quintal, Rice at ₹2,000/quintal, and Cotton at ₹5,800/quintal. Prices are trending upward this month. Would you like detailed price information for a specific crop or market?';
  }
  if (message.includes('irrigat') || message.includes('water')) {
    return 'Based on typical soil moisture levels, I recommend irrigating your fields every 3-4 days during this period. Drip irrigation can save up to 40% water compared to flood irrigation. Would you like a personalized irrigation schedule?';
  }
  if (message.includes('soil') || message.includes('fertiliz')) {
    return 'For healthy soil, I recommend testing your soil pH (ideal range: 6.0-7.5), adding organic compost, and rotating crops each season. Vermicompost is excellent for improving soil health naturally. Would you like tips specific to your soil type?';
  }
  return 'Thank you for your question! As your AI farming assistant, I can help with crop recommendations, weather insights, disease identification, irrigation advice, and market prices. Could you please provide more details about what you need help with?';
}

module.exports = { chat, getSuggestions };
