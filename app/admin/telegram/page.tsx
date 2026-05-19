// app/admin/telegram/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function TelegramAdmin() {
  const [symbols] = useState(['XAUUSD', 'BTCUSD', 'EURUSD', 'GBPUSD', 'US500']);
  const [selectedSymbol, setSelectedSymbol] = useState('XAUUSD');
  const [symbolData, setSymbolData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [status, setStatus] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/symbol-data?symbol=${selectedSymbol}`);
      const data = await res.json();
      setSymbolData(data);
      generateCaption(data);
      setStatus('Data loaded');
    } catch (error) {
      setStatus('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const generateCaption = (data: any) => {
    const price = data.trend?.current_price || 0;
    const entry = data.tp_sl?.entry_price || 0;
    const tp = data.tp_sl?.tp_level || 0;
    const confidence = data.risk_score?.confidence_score || 0;
    const trend = data.trend?.trend || 'neutral';
    const rsi = data.momentum?.rsi_latest || 50;
    
    const trendIcon = trend.includes('bullish') ? '🟢📈' : trend.includes('bearish') ? '🔴📉' : '🟡➡️';
    const rsiIcon = rsi > 70 ? '🔥' : rsi < 30 ? '🥶' : '🌡️';
    
    setCaption(`
📊 *${selectedSymbol}*

💰 *Price:* ${price.toLocaleString()}

🎯 *Target Zone:* ${entry.toLocaleString()} → ${tp.toLocaleString()}

📈 *Trend:* ${trendIcon} ${trend.toUpperCase()}

📉 *RSI:* ${rsi} ${rsiIcon}

⚡ *AI Confidence:* ${confidence}%

📊 *Chart attached 👆*

[🔗 Full Analysis](https://mpintellect.com/analysis/${selectedSymbol})
[🏦 Open Account](https://my.litefinance.org/registration/?uid=967798214)
    `);
  };

  const generateImage = async () => {
    setStatus('Generating chart image...');
    try {
      const res = await fetch('/api/chart/generate-and-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: selectedSymbol }),
      });
      const result = await res.json();
      if (result.success) {
        setGeneratedImageUrl(result.imageUrl);
        setStatus('✅ Image generated!');
      } else {
        setStatus('❌ Failed to generate image');
      }
    } catch (error) {
      setStatus('❌ Error generating image');
    }
  };

  const postToTelegram = async () => {
    if (!generatedImageUrl) {
      setStatus('❌ Please generate image first');
      return;
    }
    
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
        setStatus('✅ Posted successfully!');
      } else {
        setStatus(`❌ Failed: ${result.error}`);
      }
    } catch (error) {
      setStatus('❌ Network error');
    } finally {
      setPosting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedSymbol]);

  useEffect(() => {
    const secret = prompt('Enter admin secret:');
    if (secret) localStorage.setItem('admin_secret', secret);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🤖 Telegram Admin</h1>
        
        <div className="bg-zinc-900 rounded-xl p-6">
          <div className="mb-4">
            <label className="block mb-2">Symbol</label>
            <select 
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="w-full bg-black p-2 rounded"
            >
              {symbols.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          
          <div className="flex gap-4 mb-4">
            <button onClick={generateImage} className="flex-1 bg-blue-600 py-2 rounded">🖼️ Generate Image</button>
            <button onClick={postToTelegram} disabled={!generatedImageUrl || posting} className="flex-1 bg-yellow-500 text-black py-2 rounded disabled:opacity-50">🚀 Post to Telegram</button>
          </div>
          
          {generatedImageUrl && (
            <div className="mb-4">
              <img src={generatedImageUrl} alt="Chart" className="rounded-lg w-full" />
            </div>
          )}
          
          <div className="bg-black p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm">{caption || 'Loading...'}</pre>
          </div>
          
          {status && <div className="mt-4 p-3 bg-zinc-800 rounded text-sm">{status}</div>}
        </div>
      </div>
    </div>
  );
}