
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, QuantumStats } from './types';
import { getQuantumAnalysis } from './geminiService';
import QuantumVisualizer from './components/QuantumVisualizer';
import QubitBars from './components/QubitBars';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStats, setCurrentStats] = useState<QuantumStats | null>(null);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  const streamText = (text: string, id: string) => {
    return new Promise<void>((resolve) => {
      let index = 0;
      setStreamingId(id);
      setStreamingText('');
      
      const interval = setInterval(() => {
        if (index < text.length) {
          // Add 1-3 characters at once for a more "data stream" feel
          const chunk = text.slice(index, index + Math.floor(Math.random() * 2) + 1);
          setStreamingText(prev => prev + chunk);
          index += chunk.length;
        } else {
          clearInterval(interval);
          setStreamingId(null);
          setStreamingText('');
          resolve();
        }
      }, 15 + Math.random() * 25); // Jittery timing for realism
    });
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    const result = await getQuantumAnalysis(input);
    setCurrentStats(result.stats);
    setIsProcessing(false);

    const assistantId = (Date.now() + 1).toString();
    await streamText(result.response, assistantId);

    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      text: result.response,
      timestamp: new Date(),
      stats: result.stats
    };

    setMessages(prev => [...prev, assistantMessage]);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#050505] text-slate-200 overflow-hidden">
      <aside className="lg:w-1/3 p-6 flex flex-col gap-6 border-b lg:border-b-0 lg:border-r border-slate-800 overflow-y-auto">
        <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tight">Q-Semantic Explorer</h1>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Quantum NLP Logic Node</p>
            </div>
        </div>

        <QuantumVisualizer stats={currentStats} />
        <QubitBars states={currentStats?.qubitStates || [0.1, 0.2, 0.15, 0.4, 0.1, 0.05, 0.05, 0.05]} />
        
        <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/50">
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Engine Status</span>
                <span className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold uppercase">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Operational
                </span>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-xs mono text-slate-500">
                    <span>Decoherence Rate</span>
                    <span className="text-slate-300">0.002 ps</span>
                </div>
                <div className="flex justify-between text-xs mono text-slate-500">
                    <span>Active Qubits</span>
                    <span className="text-slate-300">512 Logical</span>
                </div>
            </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen relative bg-[#080808]">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(#22d3ee 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>

        <header className="px-8 py-6 flex items-center justify-between border-b border-slate-800 bg-black/40 backdrop-blur-md z-10">
            <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]"></div>
                <h2 className="text-sm font-semibold tracking-wide text-slate-300">Live Semantic Stream</h2>
            </div>
            <div className="text-xs mono text-slate-500">
                Session ID: <span className="text-cyan-500">QX-882-P</span>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth relative z-10">
          {messages.length === 0 && !streamingId && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4 opacity-60">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
                <h3 className="text-xl font-medium text-slate-300">Initialize Quantum Dialogue</h3>
                <p className="text-sm text-slate-500">The semantic engine is waiting for your linguistic vector.</p>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`max-w-[85%] lg:max-w-[70%] ${m.role === 'user' ? 'bg-slate-800 text-slate-100 rounded-2xl rounded-tr-none' : 'bg-slate-900/80 border border-slate-800 rounded-2xl rounded-tl-none'} p-5 shadow-2xl relative overflow-hidden group`}>
                {m.role === 'assistant' && <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>}
                <div className="flex items-center gap-2 mb-2 text-[10px] mono uppercase tracking-widest font-bold">
                    <span className={m.role === 'user' ? 'text-slate-400' : 'text-cyan-400'}>{m.role === 'user' ? 'Linguistic Source' : 'Logic Engine'}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-600">{m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-sm lg:text-base leading-relaxed whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          ))}

          {streamingId && (
            <div className="flex justify-start">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl rounded-tl-none p-5 max-w-[70%] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 animate-pulse"></div>
                <div className="flex items-center gap-2 mb-2 text-[10px] mono uppercase tracking-widest font-bold">
                    <span className="text-cyan-400">Streaming Logic...</span>
                </div>
                <p className="text-sm lg:text-base leading-relaxed whitespace-pre-wrap mono text-cyan-50/90">
                  {streamingText}<span className="inline-block w-2 h-4 bg-cyan-500 ml-1 animate-pulse"></span>
                </p>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="flex justify-start">
               <div className="bg-slate-900/80 border border-slate-800 rounded-2xl rounded-tl-none p-5 max-w-[70%]">
                 <div className="flex space-x-2">
                   <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                   <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                 </div>
                 <div className="mt-3 text-[10px] text-slate-500 mono uppercase">Calculating Probability Manifold...</div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-8 bg-black/40 backdrop-blur-xl border-t border-slate-800 z-10">
          <form onSubmit={handleSend} className="relative max-w-4xl mx-auto group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inject linguistic vector..."
              disabled={isProcessing || streamingId !== null}
              className="w-full bg-slate-900/50 border border-slate-700 text-slate-100 px-6 py-4 rounded-2xl pr-16 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-slate-600 font-medium disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isProcessing || !input.trim() || streamingId !== null}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
            <div className="absolute -bottom-6 left-2 text-[9px] mono text-slate-600 uppercase tracking-widest">
                System Latency: {Math.floor(Math.random() * 20) + 20}ms | Vector Dimension: 768d
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default App;
