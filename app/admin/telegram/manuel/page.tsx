'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ManualPublish() {
  const [message, setMessage] = useState('');
  const [button1Text, setButton1Text] = useState('🔹 افتح حسابك من هنا');
  const [button1Url, setButton1Url] = useState('https://my.litefinance.org/registration/?uid=967798214&cid=341446&utm_source=telegram&utm_medium=pinned&utm_campaign=button');
  const [button2Text, setButton2Text] = useState('📊 عرض التحليل');
  const [button2Url, setButton2Url] = useState('https://mpintellect.com/markets');
  const [publishing, setPublishing] = useState(false);
  const [status, setStatus] = useState('');

  const handlePublish = async () => {
    setPublishing(true);
    setStatus('Publishing...');
    
    try {
      // Prepare buttons as 2D array for inline keyboard
      const buttons = [];
      
      // Row 1: Button 1
      if (button1Text && button1Url) {
        buttons.push([{ text: button1Text, url: button1Url }]);
      }
      
      // Row 2: Button 2 (optional)
      if (button2Text && button2Url) {
        buttons.push([{ text: button2Text, url: button2Url }]);
      }
      
      const res = await fetch('/api/telegram/send-message', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_secret') || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: message,
          buttons: buttons.length > 0 ? buttons : undefined
        }),
      });
      
      const result = await res.json();
      
      if (result.success) {
        setStatus('✅ Published successfully!');
      } else {
        setStatus(`❌ Failed: ${result.error}`);
      }
    } catch (error) {
      setStatus('❌ Network error');
    } finally {
      setPublishing(false);
    }
  };

  const loadTemplate = (template: string) => {
    if (template === 'pinned') {
      setMessage(`🚀 *MPIntellect – AI Market Insights*

📊 Daily technical analysis for 28+ instruments:
Forex | Metals | Crypto | Indices
✅ AI-powered institutional analysis
✅ Real-time AI-powered technical analysis
✅ Key support & resistance levels
✅ Current market structure & trend direction
✅ RSI momentum & volatility context
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 يتم نشر التحليلات يومياً`);
      
      setButton1Text('🔹 افتح حسابك من هنا');
      setButton1Url('https://my.litefinance.org/registration/?uid=967798214&cid=341446&utm_source=telegram&utm_medium=pinned&utm_campaign=button');
      setButton2Text('📊 عرض التحليل');
      setButton2Url('https://mpintellect.com/markets');
    }
    
    if (template === 'signal') {
      setMessage(`📊 *XAUUSD SIGNAL*

💰 Price: 4,556
🎯 Target: 4,574 → 4,494
📈 Trend: 🔴 BEARISH
⚡ Confidence: 79%

Chart attached 👆`);
      
      setButton1Text('📈 عرض التحليل الكامل');
      setButton1Url('https://mpintellect.com/analysis/XAUUSD');
      setButton2Text('🏦 تنفيذ الصفقة');
      setButton2Url('https://my.litefinance.org/registration/?uid=967798214&utm_source=telegram&utm_medium=signal');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8">
          <Link 
            href="/admin/telegram" 
            className="px-6 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg font-bold transition"
          >
            🤖 Signal Publisher
          </Link>
          <Link 
            href="/admin/telegram/manual" 
            className="px-6 py-2 bg-yellow-500 text-black rounded-lg font-bold"
          >
            ✏️ Manual Publisher
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-8 text-center">✏️ Manual Publisher with Buttons</h1>
        
        {/* Templates */}
        <div className="bg-zinc-900 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-yellow-500">📋 Templates</h2>
          <div className="flex flex-wrap gap-4">
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
          </div>
        </div>
        
        {/* Message Editor */}
        <div className="bg-zinc-900 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-yellow-500">📝 Message</h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-lg p-4 text-white font-mono text-sm"
            rows={10}
            placeholder="Write your message here...
Support Markdown: *bold*, _italic_"
          />
        </div>
        
        {/* Button 1 */}
        <div className="bg-zinc-900 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-yellow-500">🔘 Button 1 (Main CTA)</h2>
          
          <div className="mb-4">
            <label className="block text-sm mb-2">Button Text</label>
            <input
              type="text"
              value={button1Text}
              onChange={(e) => setButton1Text(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white"
              placeholder="e.g., 🔹 افتح حسابك من هنا"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm mb-2">Button URL</label>
            <input
              type="text"
              value={button1Url}
              onChange={(e) => setButton1Url(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white"
              placeholder="https://..."
            />
          </div>
        </div>
        
        {/* Button 2 */}
        <div className="bg-zinc-900 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-yellow-500">🔘 Button 2 (Optional)</h2>
          
          <div className="mb-4">
            <label className="block text-sm mb-2">Button Text (leave empty to hide)</label>
            <input
              type="text"
              value={button2Text}
              onChange={(e) => setButton2Text(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white"
              placeholder="e.g., 📊 عرض التحليل"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm mb-2">Button URL</label>
            <input
              type="text"
              value={button2Url}
              onChange={(e) => setButton2Url(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white"
              placeholder="https://..."
            />
          </div>
        </div>
        
        {/* Preview */}
        <div className="bg-zinc-900 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-yellow-500">👁️ Preview</h2>
          <div className="bg-black rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
            {message || 'Preview will appear here...'}
          </div>
          {button1Text && (
            <div className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
              🔘 {button1Text}
            </div>
          )}
          {button2Text && (
            <div className="mt-2 inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm ml-2">
              🔘 {button2Text}
            </div>
          )}
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