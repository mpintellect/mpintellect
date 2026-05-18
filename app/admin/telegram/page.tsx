// app/admin/telegram/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface SymbolData {
  symbol: string;
  currentPrice: number;
  entry: number;
  tp: number;
  sl: number;
  confidence: number;
  trend: string;
  rsi: number;
}

export default function TelegramAdmin() {
  const [symbols, setSymbols] = useState(['XAUUSD', 'BTCUSD', 'EURUSD', 'GBPUSD', 'US500']);
  const [selectedSymbol, setSelectedSymbol] = useState('XAUUSD');
  const [symbolData, setSymbolData] = useState<SymbolData | null>(null);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [status, setStatus] = useState('');
  const [chartUrl, setChartUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [history, setHistory] = useState<any[]>([]);

  // Fetch symbol data
  const fetchData = async () => {
    setLoading(true);
    setStatus('Loading...');
    
    try {
      const res = await fetch(`/api/symbol-data?symbol=${selectedSymbol}`);
      const data = await res.json();
      
      if (data) {
        const extracted = {
          symbol: selectedSymbol,
          currentPrice: data.trend?.current_price || data.current_price || 0,
          entry: data.tp_sl?.entry_price || data.pending_orders?.primary_order?.entry_price || 0,
          tp: data.tp_sl?.tp_level || data.pending_orders?.primary_order?.tp_price || 0,
          sl: data.tp_sl?.sl_level || data.pending_orders?.primary_order?.sl_price || 0,
          confidence: data.risk_score?.confidence_score || data.analysis_accuracy || 0,
          trend: data.trend?.trend || 'neutral',
          rsi: data.momentum?.rsi_latest || 50,
        };
        setSymbolData(extracted);
        
        // Generate chart URL
        const chart = `/api/chart/generate?symbol=${selectedSymbol}&type=story&refresh=true`;
        setChartUrl(chart);
        
        // Generate caption preview
        generateCaptionPreview(extracted);
        
        setStatus('Data loaded successfully');
      }
    } catch (error) {
      setStatus('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  // Generate caption preview
  const generateCaptionPreview = (data: SymbolData) => {
    const trendIcon = data.trend.includes('bullish') ? '🟢📈' : data.trend.includes('bearish') ? '🔴📉' : '🟡➡️';
    const trendText = data.trend.includes('bullish') ? 'BULLISH' : data.trend.includes('bearish') ? 'BEARISH' : 'NEUTRAL';
    
    const rsiIcon = data.rsi > 70 ? '🔥' : data.rsi < 30 ? '🥶' : '🌡️';
    const rsiZone = data.rsi > 70 ? 'Overbought' : data.rsi < 30 ? 'Oversold' : 'Neutral';
    
    const caption = `
📊 *${data.symbol} - REAL-TIME ANALYSIS*

💰 *Price:* ${data.currentPrice.toLocaleString()}

🎯 *Target Zone:* ${data.entry.toLocaleString()} → ${data.tp.toLocaleString()}

📈 *Trend:* ${trendIcon} *${trendText}*

📉 *Key Insights:*
• RSI: ${data.rsi} ${rsiIcon} (${rsiZone})

⚡ *AI Confidence:* ${data.confidence}%

📊 *Chart attached*

[🔗 Full Analysis](https://mpintellect.com/analysis/${data.symbol})
[🏦 Open Account](https://my.litefinance.org/registration/?uid=967798214)
    `.trim();
    
    setCaption(caption);
  };

  // Post to Telegram
  const postToTelegram = async () => {
    setPosting(true);
    setStatus('Posting to Telegram...');
    
    try {
      const res = await fetch('/api/telegram/smart-post', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_secret') || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol: selectedSymbol }),
      });
      
      const result = await res.json();
      
      if (result.success) {
        setStatus(`✅ Posted successfully! Confidence: ${result.confidence}% | Trend: ${result.trend}`);
        
        // Add to history
        setHistory(prev => [{
          symbol: selectedSymbol,
          timestamp: new Date().toLocaleString(),
          confidence: result.confidence,
          trend: result.trend,
        }, ...prev.slice(0, 9)]);
      } else {
        setStatus(`❌ Failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      setStatus('❌ Network error');
    } finally {
      setPosting(false);
    }
  };

  // Load data on symbol change
  useEffect(() => {
    fetchData();
  }, [selectedSymbol]);

  // Check auth on load
  useEffect(() => {
    const secret = prompt('Enter admin secret to continue:');
    if (secret) {
      localStorage.setItem('admin_secret', secret);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        
        <h1 className="text-3xl font-bold mb-8 text-center">🤖 Telegram Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT PANEL - Controls */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <h2 className="text-xl font-bold mb-4 text-yellow-500">📡 Post to Telegram</h2>
            
            {/* Symbol Selector */}
            <div className="mb-4">
              <label className="block text-sm text-zinc-400 mb-2">Select Symbol</label>
              <select 
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white"
              >
                {symbols.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            
            {/* Data Preview */}
            {symbolData && (
              <div className="bg-black rounded-lg p-4 mb-4 border border-zinc-800">
                <h3 className="font-bold mb-2">📊 Data Preview</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-zinc-400">Price:</span>
                  <span className="text-white">{symbolData.currentPrice.toLocaleString()}</span>
                  <span className="text-zinc-400">Entry → TP:</span>
                  <span className="text-white">{symbolData.entry.toLocaleString()} → {symbolData.tp.toLocaleString()}</span>
                  <span className="text-zinc-400">Confidence:</span>
                  <span className="text-green-400">{symbolData.confidence}%</span>
                  <span className="text-zinc-400">Trend:</span>
                  <span className={symbolData.trend.includes('bullish') ? 'text-green-400' : symbolData.trend.includes('bearish') ? 'text-red-400' : 'text-yellow-400'}>
                    {symbolData.trend}
                  </span>
                  <span className="text-zinc-400">RSI:</span>
                  <span className="text-white">{symbolData.rsi}</span>
                </div>
              </div>
            )}
            
            {/* Chart Preview */}
            {chartUrl && (
              <div className="mb-4">
                <h3 className="font-bold mb-2">🖼️ Chart Preview</h3>
                <img src={chartUrl} alt="Chart" className="rounded-lg border border-zinc-700 w-full" />
              </div>
            )}
            
            {/* Post Button */}
            <button
              onClick={postToTelegram}
              disabled={loading || posting}
              className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {posting ? '📤 Posting...' : '🚀 Post to Telegram'}
            </button>
            
            {/* Status */}
            {status && (
              <div className="mt-4 p-3 bg-zinc-800 rounded-lg text-sm">
                {status}
              </div>
            )}
          </div>
          
          {/* RIGHT PANEL - Caption Preview & History */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <h2 className="text-xl font-bold mb-4 text-yellow-500">📝 Caption Preview</h2>
            
            <div className="bg-black rounded-lg p-4 mb-6 font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
              {caption || 'Loading...'}
            </div>
            
            <h2 className="text-xl font-bold mb-4 text-yellow-500">📜 Post History</h2>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-zinc-500 text-sm">No posts yet</p>
              ) : (
                history.map((item, i) => (
                  <div key={i} className="bg-black rounded-lg p-3 text-sm border border-zinc-800">
                    <div className="flex justify-between">
                      <span className="font-bold text-yellow-500">{item.symbol}</span>
                      <span className="text-zinc-500">{item.timestamp}</span>
                    </div>
                    <div className="text-xs text-zinc-400 mt-1">
                      Confidence: {item.confidence}% | Trend: {item.trend}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}