import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiPaperAirplane, HiLightBulb } from 'react-icons/hi';
import api from '../services/api';

const suggestedQuestions = [
  'What crops should I grow this season?',
  'How to prevent leaf blight in rice?',
  'When is the best time to irrigate wheat?',
  'What is the current market price of cotton?',
  'How to improve soil fertility naturally?',
  'Best organic pesticides for vegetables?',
];

const quickReplies = {
  weather: 'Based on current weather patterns, moderate rainfall is expected in your region this week. I recommend delaying any pesticide application and ensuring proper drainage in your fields.',
  crop: 'For the current season, I recommend considering Rice, Maize, or Cotton depending on your soil type. Alluvial soil is best for Rice, while Black soil suits Cotton well.',
  disease: 'Common crop diseases this season include Leaf Blight, Brown Spot, and Bacterial Wilt. Prevention includes proper spacing, seed treatment with fungicides, and maintaining field hygiene.',
  price: 'Current market prices: Wheat ₹2,300/q, Rice ₹2,000/q, Cotton ₹5,800/q. Prices are trending upward this month.',
  irrigation: 'Based on typical soil moisture levels, I recommend irrigating every 3-4 days. Drip irrigation can save up to 40% water compared to flood irrigation.',
  soil: 'For healthy soil: test pH (ideal 6.0-7.5), add organic compost, and rotate crops each season. Vermicompost is excellent for improving soil health naturally.',
  default: 'As your AI farming assistant, I can help with crop recommendations, weather insights, disease identification, irrigation advice, and market prices. What would you like to know?',
};

function getAIResponse(message) {
  const msg = message.toLowerCase();
  if (msg.includes('weather') || msg.includes('rain') || msg.includes('temperature')) return quickReplies.weather;
  if (msg.includes('crop') || msg.includes('grow') || msg.includes('season') || msg.includes('plant')) return quickReplies.crop;
  if (msg.includes('disease') || msg.includes('pest') || msg.includes('blight') || msg.includes('fungus')) return quickReplies.disease;
  if (msg.includes('price') || msg.includes('market') || msg.includes('sell') || msg.includes('mandi')) return quickReplies.price;
  if (msg.includes('irrigat') || msg.includes('water') || msg.includes('drip')) return quickReplies.irrigation;
  if (msg.includes('soil') || msg.includes('fertiliz') || msg.includes('compost')) return quickReplies.soil;
  return quickReplies.default;
}

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! 🌾 I\'m your AI Farming Assistant. Ask me anything about crops, weather, diseases, market prices, or irrigation. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;

    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setTyping(true);

    // Simulate API delay
    setTimeout(() => {
      const response = getAIResponse(userMsg);
      setMessages((prev) => [...prev, { role: 'bot', text: response }]);
      setTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/30 to-white dark:from-dark-bg dark:to-dark-card">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h1 className="section-title">🤖 AI Farming Assistant</h1>
          <p className="section-subtitle">Get instant expert advice on all your farming questions</p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-4 gap-6">
          {/* Suggested Questions */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="font-display font-semibold text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-3">
              <HiLightBulb className="w-4 h-4 text-yellow-500" />
              Suggested Questions
            </h3>
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="w-full text-left text-sm p-3 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all text-gray-700 dark:text-gray-300"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3 glass-card flex flex-col" style={{ height: '600px' }}>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-dark-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-lg">
                🤖
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">FarmBot AI</h3>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Online
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary-500 text-white rounded-br-md'
                        : 'bg-gray-100 dark:bg-dark-card text-gray-800 dark:text-gray-200 rounded-bl-md border border-gray-200 dark:border-dark-border'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-dark-card rounded-2xl rounded-bl-md px-4 py-3 border border-gray-200 dark:border-dark-border">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-dark-border">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your farming question..."
                  className="input-field flex-1 py-3"
                  disabled={typing}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  className="btn-primary px-5 disabled:opacity-50"
                >
                  <HiPaperAirplane className="w-5 h-5 rotate-90" />
                </button>
              </div>
            </form>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          ℹ️ Currently using mock AI responses. Will be connected to LangChain/LangGraph for intelligent farming assistance.
        </p>
      </div>
    </div>
  );
}
