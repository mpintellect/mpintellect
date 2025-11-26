'use client';

import { useState } from 'react';
import { Send, Radio, Lock, Bot, Mic, Zap, RefreshCw } from 'lucide-react';

// --- 1. DATA TYPES ---
interface TrendInfo {
  trend: string; 
}
interface TradeSignal {
  symbol: string; action: string; entry: number; tp: number; sl: number;
  trend: TrendInfo; confidence: number; timestamp: string;  
}
interface MarketIntelligenceResponse {
  generated_at: string; signals: TradeSignal[];
}

export default function AdminPushDashboard() {
  // AUTH
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // UI STATE
  const [activeTab, setActiveTab] = useState<'AI' | 'MANUAL'>('AI');
  const [sendMode, setSendMode] = useState<'test' | 'all'>('test');
  
  // DATA STATE
  const [testId, setTestId] = useState('');
  
  // MANUAL INPUTS
  const [manualTitle, setManualTitle] = useState('📰 Market Update');
  const [manualMessage, setManualMessage] = useState('CPI Data released. High volatility expected.');
  const [manualUrl, setManualUrl] = useState('https://mzprimer.com');

  // AI INPUTS
  const [aiData, setAiData] = useState<TradeSignal | null>(null);
  const [isFetchingAI, setIsFetchingAI] = useState(false);
  const [generatedPayload, setGeneratedPayload] = useState({ title: '', body: '' });

  // PROCESS STATE
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
      // CHANGE THIS PASSWORD!
      if(password === "MZPrimer2025MZ") setIsAuthenticated(true);
      else alert("Access Denied");
  }

  // --- 2. AI LOGIC ---
  const fetchAiTrade = async () => {
      setIsFetchingAI(true);
      setAiData(null);
      setStatus('');

      try {
        // FIX: Use our own Internal Edge API to avoid CORS/Browser issues
        // We add a timestamp query to ensure we don't get cached admin data
        const res = await fetch(`/api/livemarketfeed?admin=true&t=${Date.now()}`);
        
        if (!res.ok) throw new Error("API Route Failed");
        
        const data: MarketIntelligenceResponse = await res.json();
        
        if (data.signals && data.signals.length > 0) {
            // Filter for highest confidence
            const bestTrade = data.signals.sort((a, b) => b.confidence - a.confidence)[0];
            setAiData(bestTrade);
            
            // Format Text
            const trendIcon = bestTrade.action === 'BUY' ? '🟢' : '🔴';
            const trendText = bestTrade.trend?.trend.replace(/_/g, ' ') || 'Neutral';
            
            const title = ` MZP AI Expert: ${bestTrade.action} ${bestTrade.symbol} ${trendIcon}`;
            const body = `Entry: ${bestTrade.entry} | ⚡ Confidence: ${bestTrade.confidence}% | 📊 Trend: ${trendText.toUpperCase()}`;
            
            setGeneratedPayload({ title, body });
        } else {
            setStatus('❌ No signals found in source.');
        }
      } catch (e) {
        console.error(e); // See actual error in console
        setStatus('❌ API connection failed. Check Console.');
      } finally {
          setIsFetchingAI(false);
      }
  };

  // --- 3. SEND LOGIC ---
  const handleSend = async () => {
    if(!confirm(`⚠️ CONFIRM BROADCAST: Send to ${sendMode === 'all' ? 'EVERYONE' : 'Test ID'}?`)) return;

    setLoading(true);
    setStatus('Sending...');

    // Determine which data to use
    const finalTitle = activeTab === 'AI' ? generatedPayload.title : manualTitle;
    const finalMessage = activeTab === 'AI' ? generatedPayload.body : manualMessage;
    const finalUrl = activeTab === 'AI' ? 'https://mzprimer.com' : manualUrl;

    try {
      const res = await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: finalTitle,
          message: finalMessage,
          url: finalUrl,
          sendToAll: sendMode === 'all',
          targetUserId: sendMode === 'test' ? testId : undefined
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setStatus(`✅ SUCCESS. Payload delivered to ${data.count || 1} client(s).`);
      } else {
        setStatus(`❌ ERROR: ${data.error}`);
      }
    } catch (err) {
      setStatus('❌ Network Transport Failed.');
    } finally {
        setLoading(false);
    }
  };

  // --- LOCK SCREEN ---
  if(!isAuthenticated) {
      return (
          <div className="h-screen bg-black flex items-center justify-center flex-col gap-6 text-white admin-bg-pattern">
              <div className="p-8 border border-zinc-800 bg-zinc-900/80 backdrop-blur-md rounded-2xl text-center shadow-2xl w-full max-w-md">
                <Lock size={48} className="mx-auto text-yellow-500 mb-4" />
                <h1 className="admin-title text-2xl mb-6">Secure Command Access</h1>
                <div className="space-y-3">
                    <input 
                        type="password" 
                        className="admin-input text-center font-mono text-lg"
                        placeholder="ENTER PASSKEY"
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                    <button 
                        onClick={handleLogin} 
                        className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3 rounded-lg transition"
                    >
                        UNLOCK TERMINAL
                    </button>
                </div>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen text-white p-4 md:p-10 admin-bg-pattern font-sans flex justify-center">
      <div className="max-w-3xl w-full admin-card-container rounded-2xl overflow-hidden">
        
        {/* TOP BAR */}
        <div className="p-8 border-b border-zinc-800 bg-black/50 flex justify-between items-center">
            <div>
                <h1 className="admin-title text-2xl text-white flex items-center gap-3">
                    <Radio size={24} className="text-red-500 animate-pulse" /> 
                    <span>MZ BROADCAST</span>
                </h1>
                <p className="text-zinc-500 text-xs mt-2 uppercase tracking-widest font-mono">System: Push v1.2 // Secure</p>
            </div>
            <div className="admin-badge-online">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                ONLINE
            </div>
        </div>

        <div className="p-8 space-y-8">

            {/* 1. TARGET SELECTION (Grid) */}
            <section>
                <label className="admin-title text-xs text-zinc-500 block mb-3">1. SELECT TARGET SPECTRUM</label>
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => setSendMode('test')}
                        className={`p-6 rounded-lg flex flex-col items-center justify-center gap-2 btn-broadcast-test ${sendMode === 'test' ? 'selected' : ''}`}
                    >
                        <span className="font-bold">TEST MODE</span>
                        <span className="text-xs opacity-50 font-mono">Target specific UUID</span>
                    </button>
                    <button 
                        onClick={() => setSendMode('all')}
                        className={`p-6 rounded-lg flex flex-col items-center justify-center gap-2 btn-broadcast-all ${sendMode === 'all' ? 'selected' : ''}`}
                    >
                        <span className="font-bold">GLOBAL BROADCAST</span>
                        <span className="text-xs opacity-50 font-mono">Reach all devices</span>
                    </button>
                </div>
            </section>

            {/* Test ID Input (Only shows in test mode) */}
            {sendMode === 'test' && (
                <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="admin-title text-xs text-blue-500 mb-2 block">Target Identifier</label>
                    <input 
                        type="text" 
                        className="admin-input font-mono text-sm"
                        value={testId}
                        onChange={e => setTestId(e.target.value)}
                        placeholder="e.g. Zx9s7d..."
                    />
                </div>
            )}

            <div className="h-px bg-zinc-800/50 w-full" />

            {/* 2. CONTENT TYPE (Tabs) */}
            <section>
                <label className="admin-title text-xs text-zinc-500 block mb-3">2. SELECT PAYLOAD TYPE</label>
                
                <div className="flex border-b border-zinc-700">
                    <button 
                        onClick={() => setActiveTab('AI')}
                        className={`flex-1 py-3 font-bold text-sm flex justify-center items-center gap-2 transition-colors ${activeTab === 'AI' ? 'admin-tab-active-ai' : 'text-zinc-600 hover:text-zinc-300'}`}
                    >
                        <Bot size={18} /> AI SIGNAL AUTO
                    </button>
                    <button 
                        onClick={() => setActiveTab('MANUAL')}
                        className={`flex-1 py-3 font-bold text-sm flex justify-center items-center gap-2 transition-colors ${activeTab === 'MANUAL' ? 'admin-tab-active-manual' : 'text-zinc-600 hover:text-zinc-300'}`}
                    >
                        <Mic size={18} /> NEWS / MANUAL
                    </button>
                </div>

                <div className="mt-6">
                    {/* AI MODE UI */}
                    {activeTab === 'AI' && (
                        <div className="space-y-6 animate-in fade-in">
                            <button 
                                onClick={fetchAiTrade}
                                disabled={isFetchingAI}
                                className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white py-3 px-5 rounded flex items-center gap-2 text-sm font-bold transition mx-auto"
                            >
                                {isFetchingAI ? <RefreshCw className="animate-spin" size={16}/> : <Zap size={16} fill="currentColor" className="text-yellow-400"/>}
                                {isFetchingAI ? "CONNECTING..." : "FETCH MARKET INTELLIGENCE"}
                            </button>

                            {aiData && (
                                <div className="admin-preview-box mt-4 group cursor-pointer hover:border-yellow-500/50 transition">
                                    <div className="admin-preview-line"></div>
                                    <div className="pl-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] uppercase font-mono text-yellow-500">PREVIEW PAYLOAD</span>
                                            <span className="text-green-500 text-xs flex items-center gap-1">● LIVE</span>
                                        </div>
                                        <h3 className="text-white font-bold text-lg mb-1">{generatedPayload.title}</h3>
                                        <p className="text-zinc-400 text-sm font-mono">{generatedPayload.body}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* MANUAL MODE UI */}
                    {activeTab === 'MANUAL' && (
                        <div className="space-y-4 animate-in fade-in">
                            <div>
                                <label className="text-xs text-purple-400 font-bold uppercase mb-1 block">Header</label>
                                <input 
                                    className="admin-input"
                                    value={manualTitle} 
                                    onChange={e => setManualTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-purple-400 font-bold uppercase mb-1 block">Body Content</label>
                                <textarea 
                                    className="admin-input font-mono text-sm"
                                    rows={3}
                                    value={manualMessage}
                                    onChange={e => setManualMessage(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-purple-400 font-bold uppercase mb-1 block">Deeplink URL</label>
                                <input 
                                    className="admin-input text-blue-400"
                                    value={manualUrl} 
                                    onChange={e => setManualUrl(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </section>

        </div>

        {/* 3. FOOTER / ACTION */}
        <div className="p-8 bg-zinc-900/80 border-t border-zinc-800">
            <button 
                onClick={handleSend}
                disabled={loading || (activeTab === 'AI' && !aiData)} 
                className={`w-full py-4 rounded-lg font-black tracking-wide flex items-center justify-center gap-3 transition-all text-lg
                    ${activeTab === 'AI' && !aiData 
                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                        : 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-[1.01]'
                    }`}
            >
                {loading ? (
                    <span className="animate-pulse">TRANSMITTING SIGNAL...</span>
                ) : (
                    <>
                        <Send size={22} /> EXECUTE BROADCAST
                    </>
                )}
            </button>
            
            {status && (
                <div className={`admin-log-box ${status.includes('SUCCESS') ? 'admin-log-success' : 'admin-log-error'}`}>
                    {`[LOG] ${status}`}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}