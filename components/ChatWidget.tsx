import React, { useState, useRef, useEffect } from 'react';
import { handleHelpdeskChat } from '../geminiService';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Hi there! I am the OPAS AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    const reply = await handleHelpdeskChat(userMsg, messages);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'assistant', content: reply as string }]);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[9999]">
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 right-0 w-80 md:w-96 h-[500px] glass-panel bg-white/60 backdrop-blur-2xl border border-white/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-500/80 to-purple-600/80 p-4 text-white flex justify-between items-center shrink-0 border-b border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">✨</div>
                  <div>
                    <h3 className="font-bold text-sm">OPAS Helpdesk</h3>
                    <p className="text-[10px] text-indigo-100">Powered by Gemini AI</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-xl transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar flex flex-col pt-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex max-w-[85%] ${msg.role === 'user' ? 'self-end bg-indigo-500 text-white' : 'self-start bg-white/80 text-slate-800'} p-3 text-sm rounded-2xl shadow-sm border border-white/50`} style={{ borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px', borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '16px' }}>
                    {msg.content}
                  </div>
                ))}
                {isTyping && (
                  <div className="self-start bg-white/80 text-slate-800 p-3 text-sm rounded-2xl shadow-sm border border-white/50">
                    <span className="animate-pulse">Typing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white/40 border-t border-white/50 shrink-0">
                <div className="relative">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about policies, leaves..." 
                    className="w-full bg-white/80 border border-white focus:ring-2 focus:ring-indigo-300 rounded-xl pl-4 pr-10 py-2.5 outline-none text-sm shadow-inner transition-all text-slate-800 focus:bg-white placeholder:text-slate-400"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={isTyping || !input.trim()}
                    className="absolute right-1.5 top-1.5 bottom-1.5 w-8 flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white/30"
          style={{ boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.5)' }}
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
        </motion.button>
      </div>
    </>
  );
};

export default ChatWidget;
