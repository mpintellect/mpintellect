'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TelegramAdmin() {
  const [symbols] = useState([
    // Forex
    'EURUSD', 'GBPUSD', 'USDJPY', 'USDCAD', 'AUDUSD', 'NZDUSD', 'USDCHF',
    'EURJPY', 'EURGBP', 'GBPJPY', 'GBPCHF',
    // Metals
    'XAUUSD', 'XAUEUR', 'XAGUSD', 'PLATINUM',
    // Energy
    'BRENT',
    // Crypto
    'BTCUSD', 'ETHUSD', 'XRPUSD', 'LTCUSD', 'DOGEUSD',
    // Indices
    'US500', 'USTEC', 'US30', 'HK50', 'FRANCE40', 'CHINA50', 'UK100'
  ]);
  const [selectedSymbol, setSelectedSymbol] = useState('XAUUSD');
  const [publishing, setPublishing] = useState(false);
  const [status, setStatus] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');

  const handlePublish = async () => {
    setPublishing(true);
    setStatus('Generating chart and publishing to Telegram...');
    
    try {
      const res = await fetch('/api/telegram/publish', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_secret') || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol: selectedSymbol }),
      });
      
      const result = await res.json();
      
      if (result.success) {
        setImageUrl(result.imageUrl);
        setCaption(result.caption);
        setStatus(`✅ Published successfully!`);
      } else {
        setStatus(`❌ Failed: ${result.error}`);
      }
    } catch (error) {
      setStatus('❌ Network error');
    } finally {
      setPublishing(false);
    }
  };

  useEffect(() => {
    const secret = prompt('Enter admin secret:');
    if (secret) localStorage.setItem('admin_secret', secret);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8">
          <Link 
            href="/admin/telegram" 
            className="px-6 py-2 bg-yellow-500 text-black rounded-lg font-bold"
          >
            🤖 Signal Publisher
          </Link>
          <Link 
            href="/admin/telegram/manual" 
            className="px-6 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg font-bold transition"
          >
            ✏️ Manual Publisher
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-8 text-center">🤖 Signal Publisher</h1>
        
        <div className="bg-zinc-900 rounded-xl p-6">
          
          <div className="mb-6">
            <label className="block mb-2">Select Symbol</label>
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
          
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {publishing ? '📤 Publishing...' : '🚀 Generate & Publish to Telegram'}
          </button>
          
          {status && (
            <div className="mt-4 p-3 bg-zinc-800 rounded-lg text-sm">
              {status}
            </div>
          )}
          
          {imageUrl && (
            <div className="mt-6">
              <h3 className="font-bold mb-2">📸 Published Image Preview</h3>
              <img src={imageUrl} alt="Chart" className="rounded-lg border border-zinc-700 w-full" />
            </div>
          )}
          
          {caption && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">📝 Caption Sent</h3>
              <div className="bg-black rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
                {caption}
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}