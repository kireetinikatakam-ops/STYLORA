import React, { useState } from 'react';
import { Sparkles, MessageSquare, Send, X, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Bonjour! I am STYLORA AI — your luxury haute couture stylist & sustainable fashion concierge. How may I elevate your wardrobe today?',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const quickPrompts = [
    'What should I wear to a college presentation?',
    'How to style a lavender blazer sustainably?',
    'Explain Korean Personal Color Analysis',
    'Find rented designer dresses under $30',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim()) return;

    const userMsg: Message = { id: `u_${Date.now()}`, sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/stylist-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });
      const data = await response.json();

      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: data.text || 'I am analyzing your fashion query...',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Stylist Chat Error:', err);
      setMessages((prev) => [
        ...prev,
        { id: `ai_${Date.now()}`, sender: 'ai', text: 'Apologies, I encountered a temporary connection glitch. Let me recommend pairing pastel lavender layers with wide-leg trousers!' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[92%] max-w-md h-[550px] backdrop-blur-2xl bg-white/90 dark:bg-slate-950/90 border border-purple-500/30 rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden animate-fade-in">
      {/* Modal Header */}
      <div className="p-4 bg-gradient-to-r from-purple-900/50 via-slate-900/50 to-indigo-900/50 border-b border-purple-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold font-serif text-slate-900 dark:text-white">
              STYLORA AI Stylist
            </h4>
            <span className="text-[10px] font-mono text-emerald-400">Gemini 3.6 Flash Active</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full bg-purple-500/10 text-slate-700 dark:text-purple-300 hover:bg-purple-500/20"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                m.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-purple-900 text-purple-300'
              }`}
            >
              {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[80%] p-3 rounded-2xl text-xs font-light leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-purple-600 text-white rounded-tr-none'
                  : 'bg-purple-950/30 border border-purple-500/20 text-slate-800 dark:text-purple-100 rounded-tl-none'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
            <Sparkles className="w-4 h-4 animate-spin text-pink-400" />
            <span>STYLORA AI is generating fashion advice...</span>
          </div>
        )}
      </div>

      {/* Quick Suggestions & Input Bar */}
      <div className="p-3 border-t border-purple-500/20 space-y-2 bg-purple-950/10">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp)}
              className="px-2.5 py-1 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[10px] font-mono whitespace-nowrap transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask your AI fashion stylist..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-purple-950/40 border border-purple-500/20 text-slate-900 dark:text-white text-xs focus:outline-none"
          />
          <button
            onClick={() => handleSendMessage()}
            className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
