'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ADMIN_SESSION_KEY } from '../useAdminKey';

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
          'Authorization': `Bearer ${sessionStorage.getItem(ADMIN_SESSION_KEY) || ''}`,
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

  return (
    <div className="min-h-screen bg-white text-slate-800 p-8">
      <div className="max-w-4xl mx-auto">

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8">
          <Link
            href="/admin/telegram"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold"
          >
            🤖 Signal Publisher
          </Link>
          <Link
            href="/admin/telegram/manuel"
            className="px-6 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg font-bold transition"
          >
            ✏️ Manual Publisher
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-center text-slate-900">🤖 Signal Publisher</h1>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">

          <div className="mb-6">
            <label className="block mb-2 text-slate-700">Select Symbol</label>
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {symbols.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePublish}
            disabled={publishing}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {publishing ? '📤 Publishing...' : '🚀 Generate & Publish to Telegram'}
          </button>

          {status && (
            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
              {status}
            </div>
          )}

          {imageUrl && (
            <div className="mt-6">
              <h3 className="font-bold mb-2 text-slate-900">📸 Published Image Preview</h3>
              <img src={imageUrl} alt="Chart" className="rounded-lg border border-slate-200 w-full" />
            </div>
          )}

          {caption && (
            <div className="mt-4">
              <h3 className="font-bold mb-2 text-slate-900">📝 Caption Sent</h3>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap text-slate-700">
                {caption}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
