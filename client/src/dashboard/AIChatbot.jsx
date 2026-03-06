///PLEASE ADD PROTECTED ROUTER TO THIS PAGE AGAIN , IT WAS REMOVED FOR TESTING.
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPaperAirplane, HiLightBulb, HiChatAlt2, HiPlus, HiClock, HiMicrophone } from 'react-icons/hi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AI_SERVICE_URL = 'http://localhost:8000';

const suggestedQuestions = [
  'What crops should I grow this season?',
  'How to improve soil fertility?',
  'Current market price of wheat?',
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
  const { user: authUser } = useAuth();

  // Dynamic user from auth context (TASK 4)
  const user = {
    _id: authUser?.id ? String(authUser.id) : 'anonymous',
    name: authUser?.name || 'Farmer',
    language: authUser?.language || 'English',
  };

  const WELCOME_MESSAGE = {
    role: 'bot',
    text: `Hello${user.name !== 'Farmer' ? `, ${user.name}` : ''}! 🌾 I'm **Agronex**, your AI Farming Assistant. Ask me anything about crops, weather, diseases, market prices, or irrigation.\n\nHow can I help you today?`,
    toolCalls: [],
  };

  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [transcribing, setTranscribing] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const abortRef = useRef(null);
  const userScrolledUp = useRef(false);

  // ── Fetch chat history on mount (TASK 1 + 3) ──
  useEffect(() => {
    if (!authUser) return;
    const fetchHistory = async () => {
      setHistoryLoading(true);
      try {
        const { data } = await api.get('/chat/history');
        setChatHistory(data);
      } catch {
        // Silently fail — history is optional
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, [authUser]);

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

  // ── Create a new chat session (TASK 3) ──
  const createSession = useCallback(async (title) => {
    try {
      const { data } = await api.post('/chat/session', { title: title.substring(0, 80) });
      setChatHistory((prev) => [data, ...prev]);
      setActiveChatId(data.chat_id);
      return data.chat_id;
    } catch {
      return null;
    }
  }, []);

  // ── Start a new chat ──
  const handleNewChat = useCallback(() => {
    setActiveChatId(null);
    setMessages([WELCOME_MESSAGE]);
    setInput('');
  }, [user.name]);

  // ── Load a previous chat session — fetches real messages from AI service ──
  const handleLoadChat = useCallback(async (session) => {
    setActiveChatId(session.chat_id);
    setMessages([{ role: 'bot', text: '⏳ Loading conversation...', toolCalls: [] }]);

    try {
      const res = await fetch(
        `${AI_SERVICE_URL}/chat/get_chat?chat_id=${encodeURIComponent(String(session.chat_id))}`,
        { method: 'POST' }
      );

      if (!res.ok) throw new Error(`Status ${res.status}`);

      const { messages: rawMessages } = await res.json();

      if (!rawMessages || rawMessages.length === 0) {
        setMessages([{ role: 'bot', text: `📂 **${session.title}**\n\nNo messages found in this session.`, toolCalls: [] }]);
        return;
      }

      // Map LangChain message dicts → frontend format
      // Supports both shapes: { type: "human"|"ai" } and { role: "user"|"assistant" }
      const mapped = rawMessages
        .filter((m) => {
          const kind = m.type || m.role;
          return kind === 'human' || kind === 'ai' || kind === 'user' || kind === 'assistant';
        })
        .filter((m) => {
          // Skip empty AI/assistant messages (e.g. tool-only turns)
          const kind = m.type || m.role;
          if ((kind === 'ai' || kind === 'assistant') && !m.content) return false;
          return true;
        })
        .map((m) => {
          const kind = m.type || m.role;
          const isUser = kind === 'human' || kind === 'user';
          return {
            role: isUser ? 'user' : 'bot',
            text: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
            toolCalls: m.tool_calls?.map((tc) => tc.name).filter(Boolean) ?? [],
          };
        });

      setMessages(mapped.length > 0 ? mapped : [
        { role: 'bot', text: `📂 **${session.title}**\n\nNo readable messages found.`, toolCalls: [] },
      ]);
    } catch (err) {
      console.error('Failed to load chat:', err);
      setMessages([{ role: 'bot', text: `⚠️ Failed to load conversation. Please try again.`, toolCalls: [] }]);
    }
  }, []);

  const sendMessage = useCallback(async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || streaming) return;

    setInput('');
    setStreaming(true);
    userScrolledUp.current = false;

    // Auto-create session on first message if none active (TASK 3)
    let sessionId = activeChatId;
    if (!sessionId && authUser) {
      sessionId = await createSession(userMsg);
    }

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

      const response = await fetch(`${AI_SERVICE_URL}/chat/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat,
          lon,
          query: userMsg,
          user_id: String(sessionId || user._id),  // use session id as thread_id so each chat has its own history
          user_name: user.name,
          language: user.language,
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
      let botResponseText = '';  // track full response for logging

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
                botResponseText += token;
                setMessages((prev) => {
                  const copy = [...prev];
                  const last = copy[copy.length - 1];
                  if (last?.role === 'bot') {
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
            currentEvent = null;
          } else if (line === '') {
            currentEvent = null;
          }
        }
      }

      // Log chat interaction to backend (fire-and-forget)
      if (botResponseText) {
        api.post('/chat/log', { question: userMsg, response: botResponseText }).catch(() => { });
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setMessages((prev) => {
          const updated = [...prev];
          const lastBot = updated[updated.length - 1];
          if (lastBot?.role === 'bot' && !lastBot.text) {
            lastBot.text = '⚠️ Chatbot service unavailable. Please try again later.';
          }
          return updated;
        });
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [input, streaming, activeChatId, user, createSession, authUser]);

  // ---------- Speech to text (Sarvam AI) ----------
  const SARVAM_API_KEY = import.meta.env.VITE_SARVAM_API_KEY || 'sk_379zwuu8_fE8JeksRofnUNHKGwBWCz5zb';

  const sendAudioToSarvam = async (blob) => {
    setTranscribing(true);
    try {
      const form = new FormData();
      // filename and content-type will be inferred by browser
      form.append('file', blob, 'recording.webm');

      const res = await fetch('https://api.sarvam.ai/speech-to-text', {
        method: 'POST',
        headers: {
          'api-subscription-key': SARVAM_API_KEY,
        },
        body: form,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Sarvam error ${res.status}: ${txt}`);
      }

      const data = await res.json();
      // Support multiple possible response shapes
      const transcript = data?.text || data?.transcript || data?.result || data?.data || '';
      if (transcript && typeof transcript !== 'object') {
        setInput((prev) => (prev ? prev + ' ' + transcript : transcript));
      } else if (typeof transcript === 'object') {
        // try to stringify common nested shapes
        const candidate = transcript?.text || transcript?.transcript || '';
        if (candidate) setInput((prev) => (prev ? prev + ' ' + candidate : candidate));
      }
    } catch (err) {
      console.error('Speech-to-text failed:', err);
    } finally {
      setTranscribing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;

      mr.addEventListener('dataavailable', (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      });

      mr.addEventListener('stop', async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudioToSarvam(blob);
        // stop all tracks
        stream.getTracks().forEach((t) => t.stop());
      });

      mr.start();
      setRecording(true);
    } catch (err) {
      console.error('Microphone access denied or unavailable', err);
    }
  };

  const stopRecording = () => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== 'inactive') {
      mr.stop();
    }
    setRecording(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  // Whether we should show suggestions (only when conversation just started)
  const showSuggestions = !streaming;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/30 to-white dark:from-dark-bg dark:to-dark-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-3">
          <h1 className="text-xl md:text-2xl font-bold font-display">🤖 Agronex AI Assistant</h1>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Real-time farming advice powered by AI</p>
        </motion.div>

        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-6 gap-4">
          {/* ── LEFT PANEL: Chat History ── */}
          <div className="lg:col-span-1 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display font-semibold text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <HiChatAlt2 className="w-4 h-4 text-primary-500" />
                Chat History
              </h3>
              <button
                onClick={handleNewChat}
                className="p-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-600 dark:text-primary-400 transition-colors"
                title="New Chat"
              >
                <HiPlus className="w-4 h-4" />
              </button>
            </div>

            {/* New Chat button */}
            <button
              onClick={handleNewChat}
              className={`w-full text-left text-xs p-2 rounded-lg border transition-all flex items-center gap-1.5
                ${!activeChatId
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300 font-medium'
                  : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/10'
                }`}
            >
              <HiPlus className="w-3.5 h-3.5 flex-shrink-0" />
              New Chat
            </button>

            {/* History list */}
            {historyLoading ? (
              <div className="text-center py-4">
                <div className="w-5 h-5 border-2 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-gray-400 mt-2">Loading history…</p>
              </div>
            ) : chatHistory.length > 0 ? (
              <div className="space-y-1 max-h-[calc(100vh-340px)] overflow-y-auto">
                {chatHistory.map((session) => (
                  <button
                    key={session.chat_id}
                    onClick={() => handleLoadChat(session)}
                    className={`w-full text-left text-xs p-2 rounded-lg border transition-all group
                      ${activeChatId === session.chat_id
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300'
                        : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/10'
                      }`}
                  >
                    <p className="truncate font-medium text-xs">{session.title}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-1">
                      <HiClock className="w-2.5 h-2.5" />
                      {new Date(session.created_at).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <HiChatAlt2 className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-400 dark:text-gray-500">No chat history yet.</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Start a conversation!</p>
              </div>
            )}
          </div>

          {/* ── RIGHT PANEL: Chat Window ── */}
          <div className="lg:col-span-5 glass-card flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-150px)]">
            {/* Chat Header */}
            <div className="flex-shrink-0 px-4 py-2.5 border-b border-gray-200 dark:border-dark-border flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm">
                🤖
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-800 dark:text-white">Agronex AI</h3>
                <p className="text-[10px] text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Online • Real-time data
                </p>
              </div>
            </div>

            {/* Messages — the ONLY scrollable element */}
            <div
              ref={chatContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-full sm:max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
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

            {/* ── Suggestions above input ── */}
            {showSuggestions && (
              <div className="flex-shrink-0 px-4 py-2 flex items-center gap-2 overflow-x-auto">
                <HiLightBulb className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    disabled={streaming}
                    className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/10 text-gray-600 dark:text-gray-400 transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input — fixed at bottom */}
            <form onSubmit={handleSubmit} className="flex-shrink-0 px-4 py-2.5 border-t border-gray-200 dark:border-dark-border">
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  onClick={() => (recording ? stopRecording() : startRecording())}
                  disabled={streaming || transcribing}
                  className={`p-2 rounded-lg border ${recording ? 'bg-red-100 border-red-300 text-red-600' : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300'} transition-colors`}
                  title={recording ? 'Stop recording' : 'Record speech'}
                >
                  <div className="flex items-center gap-2">
                    <HiMicrophone className={`w-5 h-5 ${recording ? 'animate-pulse' : ''}`} />
                    {recording ? <span className="text-xs">Recording</span> : transcribing ? <span className="text-xs">Transcribing…</span> : null}
                  </div>
                </button>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your farming question..."
                  className="input-field flex-1 py-2.5 text-sm"
                  disabled={streaming}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || streaming}
                  className="btn-primary px-4 disabled:opacity-50"
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
