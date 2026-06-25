import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Sparkles, Loader2, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '../../store/useStore';
import { sendChatMessage } from '../../utils/aiService';
import type { Goal, AIMessage } from '../../types';

const STARTER_PROMPTS = [
  "What should I focus on right now?",
  "I'm feeling stuck — help me get unstuck.",
  "Give me a motivational push.",
  "What's the best next step for this goal?",
];

interface AIChatProps {
  goal: Goal;
  onClose: () => void;
}

export function AIChat({ goal, onClose }: AIChatProps) {
  const { chatHistory, addChatMessage, clearChatHistory, settings } = useStore();
  const messages = chatHistory[goal.id] || [];
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: AIMessage = {
      id: uuidv4(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };
    addChatMessage(goal.id, userMsg);
    setInput('');
    setLoading(true);

    try {
      const allMessages = [...messages, userMsg];
      const response = await sendChatMessage(allMessages, goal, settings.openaiApiKey);
      const aiMsg: AIMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };
      addChatMessage(goal.id, aiMsg);
    } catch {
      const errMsg: AIMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Keep pushing forward — you've got this! 💪",
        timestamp: new Date().toISOString(),
      };
      addChatMessage(goal.id, errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="fixed right-0 top-0 bottom-0 w-96 z-40 flex flex-col glass border-l border-surface-700/50 shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-surface-100">Momentum AI</p>
            <p className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Your Goal Coach
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={() => clearChatHistory(goal.id)}
              className="p-2 rounded-lg text-surface-500 hover:text-surface-300 hover:bg-surface-800 transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Context pill */}
      <div className="px-4 py-2 border-b border-surface-800">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-800 rounded-lg">
          <span className="text-sm">{goal.coverEmoji}</span>
          <p className="text-xs text-surface-400 truncate">{goal.title}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-600/20 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-brand-400" />
            </div>
            <p className="text-surface-300 font-medium mb-1">AI Goal Coach</p>
            <p className="text-surface-500 text-sm mb-6">Ask me anything about your goal. I'm here to help you succeed.</p>
            <div className="flex flex-col gap-2 w-full">
              {STARTER_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="text-left text-sm text-brand-400 border border-brand-500/30 rounded-xl px-4 py-2.5 hover:bg-brand-600/10 transition-all duration-200"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-sm'
                  : 'bg-surface-800 text-surface-200 rounded-tl-sm'
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center mr-2 flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-surface-800 px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-surface-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-surface-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-surface-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-surface-700/50">
        <form
          onSubmit={e => { e.preventDefault(); send(input); }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask your AI coach..."
            disabled={loading}
            className="flex-1 bg-surface-800 border border-surface-700 rounded-xl px-4 py-2.5 text-sm text-surface-100 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-200"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200"
          >
            {loading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
          </button>
        </form>
        {!settings.openaiApiKey && (
          <p className="text-xs text-surface-600 text-center mt-2">
            Add your OpenAI API key in{' '}
            <a href="/settings" className="text-brand-500 hover:text-brand-400">Settings</a>
            {' '}for personalized AI responses
          </p>
        )}
      </div>
    </motion.div>
  );
}
