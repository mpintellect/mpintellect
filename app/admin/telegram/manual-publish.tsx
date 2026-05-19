// app/admin/telegram/manual-publish.tsx
'use client';

import { useState } from 'react';

export default function ManualPublish() {
  const [message, setMessage] = useState('');
  const [cta1Text, setCta1Text] = useState('📈 VIEW LIVE ANALYSIS');
  const [cta1Url, setCta1Url] = useState('https://mpintellect.com/markets');
  const [cta2Text, setCta2Text] = useState('🏦 OPEN TRADING ACCOUNT');
  const [cta2Url, setCta2Url] = useState('https://my.litefinance.org/registration/?uid=967798214&utm_source=telegram&utm_medium=pinned&utm_campaign=channel_intro');
  const [publishing, setPublishing] = useState(false);
  const [status, setStatus] = useState('');

  const generateTelegramMessage = () => {
    let msg = message;
    
    // Add CTA buttons if they exist
    if (cta1Text && cta1Url) {
      msg += `\n\n🔵 [${cta1Text}](${cta1Url})`;
    }
    if (cta2Text && cta2Url) {
      msg += `\n\n🟢 [${cta2Text}](${cta2Url})`;
    }
    
    return msg;
  };

  const handlePublish = async () => {
    setPublishing(true);
    setStatus('Publishing...');
    
    try {
      const telegramMessage = generateTelegramMessage();
      
      const res = await fetch('/api/telegram/send-message', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_secret') || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: telegramMessage }),
      });
      
      const result = await res.json();
      
      if (result.success) {
        setStatus('✅ Published successfully!');
        setMessage('');
      } else {
        setStatus(`❌ Failed: ${result.error}`);
      }
    } catch (error) {
      setStatus('❌ Network error');
    } finally {
      setPublishing(false);
    }
  };

  // Predefined templates
  const loadTemplate = (template: string) => {
    if (template === 'pinned') {
      setMessage(`🚀 *Why follow MPIntellect signals?*

✅ AI-powered institutional analysis
✅ Real-time entry, TP, SL levels
✅ 28+ Forex, Metals, Crypto, Indices
✅ Professional chart images
✅ 79%+ historical confidence accuracy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 Bookmark this channel for daily signals`);
      
      setCta1Text('📈 VIEW LIVE ANALYSIS');
      setCta1Url('https://mpintellect.com/markets');
      setCta2Text('🏦 OPEN TRADING ACCOUNT');
      setCta2Url('https://my.litefinance.org/registration/?uid=967798214&utm_source=telegram&utm_medium=pinned&utm_campaign=channel_intro');
    }
    
    if (template === 'signal') {
      setMessage(`📊 *XAUUSD SIGNAL*

💰 Price: 4,556
🎯 Target: 4,574 → 4,494
📈 Trend: 🔴 BEARISH
⚡ Confidence: 79%

Chart attached 👆`);
      
      setCta1Text('📈 Full Analysis');
      setCta1Url('https://mpintellect.com/analysis/XAUUSD');
      setCta2Text('🏦 Execute Trade');
      setCta2Url('https://my.litefinance.org/registration/?uid=967798214&utm_source=telegram&utm_medium=signal');
    }
    
    if (template === 'update') {
      setMessage(`🔄 *Market Update*

London session opening. Key levels to watch:

📈 EURUSD: 1.0850 - 1.0920
📊 XAUUSD: Support at 4,500, Resistance at 4,580
⚡ BTCUSD: Holding above 78,000

Trade with discipline.`);
      
      setCta1Text('📊 Full Analysis');
      setCta1Url('https://mpintellect.com/markets');
      setCta2Text('🏦 Open Account');
      setCta2Url('https://my.litefinance.org/registration/?uid=967798214');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-3xl font-bold mb-8 text-center">✏️ Manual Telegram Publisher</h1>
        
        {/* Templates */}
        <div className="bg-zinc-900 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-yellow-500">📋 Templates</h2>
          <div className="flex gap-4">
            <button
              onClick={() => loadTemplate('pinned')}
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              📌 Pinned Post
            </button>
            <button
              onClick={() => loadTemplate('signal')}
              className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700"
            >
              📊 Signal Template
            </button>
            <button
              onClick={() => loadTemplate('update')}
              className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              🔄 Market Update
            </button>
          </div>
        </div>
        
        {/* Message Editor */}
        <div className="bg-zinc-900 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-yellow-500">📝 Message</h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-lg p-4 text-white font-mono text-sm"
            rows={12}
            placeholder="Write your message here...
Support Markdown: *bold*, _italic_, [link](url)"
          />
          <p className="text-xs text-zinc-500 mt-2">
            Tip: Use *text* for bold, _text_ for italic, [text](url) for links
          </p>
        </div>
        
        {/* CTA Buttons */}
        <div className="bg-zinc-900 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-yellow-500">🔘 CTA Buttons (Optional)</h2>
          
          <div className="mb-4">
            <label className="block text-sm mb-2">Button 1 Text</label>
            <input
              type="text"
              value={cta1Text}
              onChange={(e) => setCta1Text(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white"
              placeholder="e.g., 📈 VIEW LIVE ANALYSIS"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm mb-2">Button 1 URL</label>
            <input
              type="text"
              value={cta1Url}
              onChange={(e) => setCta1Url(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white"
              placeholder="https://..."
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm mb-2">Button 2 Text</label>
            <input
              type="text"
              value={cta2Text}
              onChange={(e) => setCta2Text(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white"
              placeholder="e.g., 🏦 OPEN TRADING ACCOUNT"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm mb-2">Button 2 URL</label>
            <input
              type="text"
              value={cta2Url}
              onChange={(e) => setCta2Url(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white"
              placeholder="https://..."
            />
          </div>
        </div>
        
        {/* Preview */}
        <div className="bg-zinc-900 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-yellow-500">👁️ Preview</h2>
          <div className="bg-black rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
            {generateTelegramMessage() || 'Preview will appear here...'}
          </div>
        </div>
        
        {/* Publish Button */}
        <button
          onClick={handlePublish}
          disabled={publishing || !message}
          className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {publishing ? '📤 Publishing...' : '🚀 Publish to Telegram'}
        </button>
        
        {status && (
          <div className="mt-4 p-3 bg-zinc-800 rounded-lg text-sm">
            {status}
          </div>
        )}
        
      </div>
    </div>
  );
}