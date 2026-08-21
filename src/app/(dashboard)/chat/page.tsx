"use client";

import { useState } from 'react';
import { Bot, Send, User, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Citation = {
  chunkId: string;
  docId: string;
  docTitle: string;
  page: number;
  text: string;
};

export type RagResponse = {
  answer: string;
  citations: Citation[];
  confidenceScore: number;
  isExternalContextUsed: boolean;
};

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  ragResponse?: RagResponse;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello. I am your CortexVault Intelligence Copilot. You can ask me questions across the Northstar Dynamics workspace. My answers are backed by traceable evidence.',
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg.content }),
      });
      const response = await res.json();
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer || response.error || "An error occurred.",
        ragResponse: response
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered a network error while connecting to the intelligence server.'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-[#0F172A] border border-[#334155] rounded-xl overflow-hidden shadow-2xl">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-[#334155]">
        {/* Header */}
        <div className="h-14 border-b border-[#334155] flex items-center px-6 bg-[#0B1120]">
          <h2 className="font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            Intelligence Chat
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.map(msg => (
            <div key={msg.id} className={cn("flex gap-4 max-w-4xl", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center shrink-0 border",
                msg.role === 'user' 
                  ? "bg-slate-700 border-slate-600 text-white" 
                  : "bg-cyan-900 border-cyan-500 text-cyan-300"
              )}>
                {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={cn(
                "rounded-2xl p-4 shadow-sm",
                msg.role === 'user' 
                  ? "bg-[#1E293B] border border-[#334155] text-slate-200" 
                  : "bg-[#0B1120] border border-cyan-900/50 text-slate-300"
              )}>
                <p className="leading-relaxed text-sm whitespace-pre-wrap">{msg.content}</p>
                
                {/* Evidence Indicators for Assistant */}
                {msg.role === 'assistant' && msg.ragResponse && Array.isArray(msg.ragResponse.citations) && msg.ragResponse.citations.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#334155]">
                    <div className="flex items-center gap-2 text-xs font-medium text-cyan-400 mb-2">
                      <BookOpen className="h-3 w-3" />
                      Sources Cited ({msg.ragResponse.citations.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {msg.ragResponse.citations.map((cite, idx) => (
                        <div key={idx} className="bg-[#1E293B] border border-[#334155] rounded px-2 py-1 text-xs text-slate-400 hover:text-cyan-400 hover:border-cyan-400/50 cursor-pointer transition-colors flex items-center gap-1">
                          <span className="font-semibold">[{idx + 1}]</span> {cite.docTitle} (Pg {cite.page})
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Confidence & Conflict Warning */}
                {msg.role === 'assistant' && msg.ragResponse && (
                  <div className="mt-3 flex items-center gap-4 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      Confidence: 
                      <span className={cn(
                        "font-medium",
                        msg.ragResponse.confidenceScore > 0.8 ? "text-green-400" : "text-yellow-400"
                      )}>
                        {Math.round(msg.ragResponse.confidenceScore * 100)}%
                      </span>
                    </span>
                    {msg.content.toLowerCase().includes('conflict') && (
                      <span className="flex items-center gap-1 text-yellow-400">
                        <AlertCircle className="h-3 w-3" />
                        Conflict Detected
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 max-w-4xl">
              <div className="h-8 w-8 rounded-full bg-cyan-900 border border-cyan-500 text-cyan-300 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-[#0B1120] border border-cyan-900/50 rounded-2xl p-4 shadow-sm flex items-center gap-2">
                <span className="animate-pulse h-2 w-2 bg-cyan-400 rounded-full"></span>
                <span className="animate-pulse h-2 w-2 bg-cyan-400 rounded-full animation-delay-200"></span>
                <span className="animate-pulse h-2 w-2 bg-cyan-400 rounded-full animation-delay-400"></span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#0B1120] border-t border-[#334155]">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your documents... (Try: What are the incident reporting deadlines?)"
              className="w-full bg-[#1E293B] border border-[#334155] rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <div className="flex gap-2 mt-2 px-2">
            <button type="button" onClick={() => setInput("What are the incident reporting deadlines?")} className="text-xs bg-[#1E293B] text-slate-400 hover:text-cyan-400 px-2 py-1 rounded border border-[#334155] transition-colors">Incident deadlines?</button>
            <button type="button" onClick={() => setInput("What is the data retention policy?")} className="text-xs bg-[#1E293B] text-slate-400 hover:text-cyan-400 px-2 py-1 rounded border border-[#334155] transition-colors">Data retention?</button>
            <button type="button" onClick={() => setInput("Disaster recovery site location?")} className="text-xs bg-[#1E293B] text-slate-400 hover:text-cyan-400 px-2 py-1 rounded border border-[#334155] transition-colors">Disaster recovery?</button>
          </div>
        </div>
      </div>
      
      {/* Evidence Side Panel (Visible when latest assistant msg has citations) */}
      <div className="w-80 bg-[#0B1120] flex flex-col hidden lg:flex">
        <div className="h-14 border-b border-[#334155] flex items-center px-4 shrink-0">
          <h3 className="font-semibold text-sm flex items-center gap-2 text-slate-200">
            <BookOpen className="h-4 w-4 text-cyan-400" />
            Evidence View
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length > 0 && messages[messages.length - 1].role === 'assistant' && Array.isArray(messages[messages.length - 1].ragResponse?.citations) && messages[messages.length - 1].ragResponse!.citations.map((cite, idx) => (
             <div key={idx} className="bg-[#1E293B] border border-[#334155] rounded-lg p-3">
               <div className="flex justify-between items-start mb-2">
                 <span className="text-xs font-bold text-cyan-400">[{idx + 1}] Citation</span>
                 <span className="text-[10px] text-slate-500 bg-[#0F172A] px-2 py-0.5 rounded">Page {cite.page}</span>
               </div>
               <h4 className="text-xs font-semibold text-slate-200 mb-2 truncate" title={cite.docTitle}>{cite.docTitle}</h4>
               <div className="relative">
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 rounded-l"></div>
                 <p className="text-xs text-slate-300 pl-3 italic">"{cite.text}"</p>
               </div>
             </div>
          ))}
          {(!messages[messages.length - 1]?.ragResponse?.citations || !Array.isArray(messages[messages.length - 1]?.ragResponse?.citations) || messages[messages.length - 1]?.ragResponse!.citations.length === 0) && (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <BookOpen className="h-10 w-10 text-slate-700 mb-2" />
              <p className="text-sm text-slate-500">Ask a question to see extracted evidence.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
