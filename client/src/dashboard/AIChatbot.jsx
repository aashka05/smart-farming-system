import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPaperAirplane, HiLightBulb } from 'react-icons/hi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AI_SERVICE_URL = 'http://localhost:8000';

const suggestedQuestions = [
  'What crops should I grow this season?',
  'How to prevent leaf blight in rice?',
  'When is the best time to irrigate wheat?',
  'What is the current market price of cotton?',
  'How to improve soil fertility naturally?',
  'Best organic pesticides for vegetables?',
];

/* ── Friendly labels for tool names ── */
const TOOL_LABELS = {
  get_current_weather: '🌤️ Fetching live weather',
  get_soil_data: '🌱 Reading soil conditions',
  get_climate_history: '📊 Loading climate history',
  get_soil_npk_ph: '🧪 Estimating soil nutrients',
  get_weather_forecast: '📅 Loading 7-day forecast',
  search_tool: '🔍 Searching the web',
};

/* ── Markdown renderer ── */
const MarkdownContent = ({ content }) => (
  <div className="markdown-body">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className="text-xl font-bold mt-3 mb-2">{children}</h1>,
        h2: ({ children }) => <h2 className="text-lg font-bold mt-3 mb-1.5">{children}</h2>,
        h3: ({ children }) => <h3 className="text-base font-semibold mt-2 mb-1">{children}</h3>,
        p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
        ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-0.5">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-0.5">{children}</ol>,
        li: ({ children }) => <li className="ml-1">{children}</li>,
        strong: ({ children }) => <strong className="font-bold text-primary-700 dark:text-primary-300">{children}</strong>,
        hr: () => <hr className="my-3 border-gray-300 dark:border-gray-600" />,
        table: ({ children }) => (
          <div className="overflow-x-auto my-2 rounded-lg border border-gray-300 dark:border-gray-600">
            <table className="min-w-full text-xs">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-primary-50 dark:bg-primary-900/30">{children}</thead>,
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => <tr className="border-b border-gray-200 dark:border-gray-700">{children}</tr>,
        th: ({ children }) => <th className="px-3 py-1.5 text-left font-semibold">{children}</th>,
        td: ({ children }) => <td className="px-3 py-1.5">{children}</td>,
        code: ({ inline, className, children }) => {
          if (inline) {
            return <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>;
          }
          return (
            <pre className="bg-gray-900 text-green-300 p-3 rounded-lg text-xs overflow-x-auto my-2 font-mono">
              <code>{children}</code>
            </pre>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

/* ── Tool call pill ── */
const ToolCallPill = ({ toolName }) => {
  const label = TOOL_LABELS[toolName] || `🔧 ${toolName}`;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300
                 border border-amber-200 dark:border-amber-700/50"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      {label}
    </motion.div>
  );
};


export default function AIChatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Hello! 🌾 I\'m **Agronex**, your AI Farming Assistant. Ask me anything about crops, weather, diseases, market prices, or irrigation.\n\nHow can I help you today?',
      toolCalls: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const chatContainerRef = useRef(null);
  const abortRef = useRef(null);
  const userScrolledUp = useRef(false);

  // Track whether user manually scrolled up
  const handleScroll = useCallback(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    const distFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    userScrolledUp.current = distFromBottom > 80;
  }, []);

  // Smart auto-scroll: scroll only the chat container, NOT the page
  const scrollToBottom = useCallback((force = false) => {
    if (!force && userScrolledUp.current) return;
    const container = chatContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, []);

  // Only auto-scroll when a new message is appended (not during every streaming token)
  const prevMessageCountRef = useRef(0);
  useEffect(() => {
    const count = messages.length;
    if (count !== prevMessageCountRef.current) {
      prevMessageCountRef.current = count;
      scrollToBottom(true); // new message added — force scroll
    }
  }, [messages.length, scrollToBottom]);

  const sendMessage = useCallback(async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || streaming) return;

    setInput('');
    setStreaming(true);
    userScrolledUp.current = false; // reset scroll position for new message

    // Add user message + empty bot message to stream into
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: userMsg, toolCalls: [] },
      { role: 'bot', text: '', toolCalls: [] },
    ]);

    // Force scroll to bottom when new message pair is added
    setTimeout(() => scrollToBottom(true), 50);

    try {
      const controller = new AbortController();
      abortRef.current = controller;

      // Get user location
      let lat = 22.3072, lon = 73.1812;
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
      } catch {
        // Use default (Vadodara, Gujarat)
      }
      //Use a database to store user chat details in postgres (just user_id , chat_id ) currently used hardcoded values for testing. 
      const user = { _id: 'gujarat_test_user_9', name: 'Dev Chavda', language: 'Gujarati' };

      const response = await fetch(`${AI_SERVICE_URL}/chat/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat,
          lon,
          query: userMsg,
          user_id: user._id || 'anonymous',
          user_name: user.name || 'Farmer',
          language: user.language || 'English',
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server error ${response.status}: ${errText}`);
      }

      // Parse SSE stream — line-by-line state machine to avoid split bugs
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let currentEvent = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process all complete lines in the buffer
        let newlineIdx;
        while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, newlineIdx).trimEnd();
          buffer = buffer.slice(newlineIdx + 1);

          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith('data: ') && currentEvent) {
            const dataStr = line.slice(6);
            try {
              const data = JSON.parse(dataStr);

              if (currentEvent === 'text' && data.data) {
                const token = data.data;
                setMessages((prev) => {
                  const copy = [...prev];
                  const last = copy[copy.length - 1];
                  if (last?.role === 'bot') {
                    // Clone the message object — never mutate in place
                    copy[copy.length - 1] = { ...last, text: last.text + token };
                  }
                  return copy;
                });
              } else if (currentEvent === 'tool' && data.data) {
                const toolName = data.data;
                setMessages((prev) => {
                  const copy = [...prev];
                  const last = copy[copy.length - 1];
                  if (last?.role === 'bot' && !last.toolCalls.includes(toolName)) {
                    copy[copy.length - 1] = { ...last, toolCalls: [...last.toolCalls, toolName] };
                  }
                  return copy;
                });
              } else if (currentEvent === 'error' && data.message) {
                const errMsg = data.message;
                setMessages((prev) => {
                  const copy = [...prev];
                  const last = copy[copy.length - 1];
                  if (last?.role === 'bot') {
                    copy[copy.length - 1] = { ...last, text: `⚠️ Error: ${errMsg}` };
                  }
                  return copy;
                });
              }
            } catch {
              // skip malformed JSON
            }
            // Reset event after data line processed
            currentEvent = null;
          } else if (line === '') {
            // blank line = end of SSE event block, reset state
            currentEvent = null;
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setMessages((prev) => {
          const updated = [...prev];
          const lastBot = updated[updated.length - 1];
          if (lastBot?.role === 'bot' && !lastBot.text) {
            lastBot.text = `⚠️ Could not connect to AI service. Make sure the server is running at ${AI_SERVICE_URL}`;
          }
          return updated;
        });
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [input, streaming]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/30 to-white dark:from-dark-bg dark:to-dark-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold font-display">🤖 Agronex AI Assistant</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Real-time farming advice powered by AI</p>
        </motion.div>

        <div className="max-w-4xl mx-auto w-full grid lg:grid-cols-4 gap-6">
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
                disabled={streaming}
                className="w-full text-left text-sm p-3 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Window — fixed viewport height so only messages scroll */}
          <div className="lg:col-span-3 glass-card flex flex-col" style={{ height: 'calc(100vh - 220px)' }}>
            {/* Chat Header */}
            <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-dark-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-lg">
                🤖
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Agronex AI</h3>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Online • Real-time data
                </p>
              </div>
            </div>

            {/* Messages — the ONLY scrollable element */}
            <div
              ref={chatContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                      ? 'bg-primary-500 text-white rounded-br-md'
                      : 'bg-gray-100 dark:bg-dark-card text-gray-800 dark:text-gray-200 rounded-bl-md border border-gray-200 dark:border-dark-border'
                      }`}
                  >
                    {/* Tool call pills */}
                    {msg.role === 'bot' && msg.toolCalls?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {msg.toolCalls.map((tool, j) => (
                          <ToolCallPill key={j} toolName={tool} />
                        ))}
                      </div>
                    )}

                    {/* Message content */}
                    {msg.role === 'bot' ? (
                      msg.text ? (
                        <MarkdownContent content={msg.text} />
                      ) : streaming && i === messages.length - 1 ? (
                        <div className="flex gap-1.5 py-1">
                          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      ) : null
                    ) : (
                      msg.text
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input — fixed at bottom */}
            <form onSubmit={handleSubmit} className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-dark-border">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your farming question..."
                  className="input-field flex-1 py-3"
                  disabled={streaming}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || streaming}
                  className="btn-primary px-5 disabled:opacity-50"
                >
                  <HiPaperAirplane className="w-5 h-5 rotate-90" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
