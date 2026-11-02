'use client';

import { useState } from 'react';

// Same list as app/admin/telegram/page.tsx's Signal Publisher.
const SYMBOLS = [
  'EURUSD', 'GBPUSD', 'USDJPY', 'USDCAD', 'AUDUSD', 'NZDUSD', 'USDCHF',
  'EURJPY', 'EURGBP', 'GBPJPY', 'GBPCHF',
  'XAUUSD', 'XAUEUR', 'XAGUSD', 'PLATINUM',
  'BRENT',
  'BTCUSD', 'ETHUSD', 'XRPUSD', 'LTCUSD', 'DOGEUSD',
  'US500', 'USTEC', 'US30', 'HK50', 'FRANCE40', 'CHINA50', 'UK100',
];

interface SignalFields {
  symbol: string;
  price: number;
  entry: number;
  tp: number;
  confidence: number;
  trend: string;
  trendIcon: string;
  trendText: string;
  rsi: number;
  rsiZone: string;
  formattedTime: string;
  session: string;
}

interface PreviewResult {
  success: boolean;
  symbol: string;
  imageUrl: string;
  caption: string; // exactly what publish.ts would send - untouched
  buttons: { inline_keyboard: { text: string; url: string }[][] };
  fields: SignalFields;
  error?: string;
}

type Style = 'current' | 'clean' | 'legacy';

const STYLES: { key: Style; label: string }[] = [
  { key: 'current', label: 'Current (live)' },
  { key: 'clean', label: 'Variant: Cleaner' },
  { key: 'legacy', label: 'Legacy (pre-09/24)' },
];

/** Telegram's legacy Markdown: *bold* and _italic_. Mirrors parse_mode: 'Markdown'. */
function renderTelegramMarkdown(text: string) {
  const parts = text.split(/(\*[^*]+\*|_[^_]+_)/g);
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*') && part.length > 1) {
      return <b key={i}>{part.slice(1, -1)}</b>;
    }
    if (part.startsWith('_') && part.endsWith('_') && part.length > 1) {
      return <i key={i}>{part.slice(1, -1)}</i>;
    }
    return <span key={i}>{part}</span>;
  });
}

function cleanCaption(f: SignalFields): string {
  return `📊 *${f.symbol}*  ${f.trendIcon} *${f.trendText}*

💰 ${f.price.toLocaleString()}
🎯 ${f.entry.toLocaleString()} → ${f.tp.toLocaleString()}
📉 RSI ${f.rsi.toFixed(1)} · ${f.rsiZone}
⚡ *${f.confidence}%* confidence

${f.formattedTime} · ${f.session}`;
}

/** The format used before 2026-09-24, kept here only so you can compare/roll back. */
function legacyCaption(f: SignalFields): string {
  return `🤖 *MPIntellect - AI Analysis*

📅 ${f.formattedTime}
⏰ Session: ${f.session}

📊 *${f.symbol}*
💰 Price: ${f.price.toLocaleString()}
🎯 Target Zone: *${f.entry.toLocaleString()}* → *${f.tp.toLocaleString()}*
📈 Trend: ${f.trendIcon} *${f.trendText}*
📉 RSI: ${f.rsi.toFixed(1)} (${f.rsiZone})
⚡ Confidence: *${f.confidence}%*`;
}

function captionForStyle(style: Style, result: PreviewResult): string {
  if (style === 'clean') return cleanCaption(result.fields);
  if (style === 'legacy') return legacyCaption(result.fields);
  return result.caption; // 'current' - the exact real live caption, untouched
}

export default function TestTelegramPreview() {
  const [symbol, setSymbol] = useState('XAUUSD');
  const [style, setStyle] = useState<Style>('current');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<PreviewResult | null>(null);

  async function generatePreview() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/telegram/preview?symbol=${symbol}`);
      const json = await res.json();
      if (!res.ok || json.error) {
        setError(json.error || 'Preview failed');
        setResult(null);
      } else {
        setResult(json);
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  const displayedCaption = result ? captionForStyle(style, result) : '';

  return (
    <div className="min-h-screen bg-white text-slate-800 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center text-slate-900">Telegram Post Preview</h1>
        <p className="text-center text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg py-2 px-3 mb-8">
          🧪 Test only — this never posts to Telegram. It calls the same chart generation and caption
          logic as the real publisher, then stops before the send.
        </p>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 mb-6">
          <label className="block mb-2 text-slate-700">Symbol</label>
          <div className="flex gap-3">
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="flex-1 bg-white border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {SYMBOLS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={generatePreview}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {loading ? 'Generating...' : 'Preview'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              ❌ {error}
            </div>
          )}
        </div>

        {result && (
          <>
            <div className="flex gap-2 mb-4">
              {STYLES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setStyle(s.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    style === s.key
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            {style !== 'current' && (
              <p className="text-xs text-slate-400 mb-3">
                Mockup only, built from the real data above — not wired into the live publisher.
              </p>
            )}

            {/* Telegram channel post mockup */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-800" style={{ background: '#0e1621' }}>
              <div className="px-4 py-3 flex items-center gap-2" style={{ background: '#17212b' }}>
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">M</div>
                <div>
                  <div className="text-white text-sm font-semibold">MPIntellect Signals</div>
                  <div className="text-slate-400 text-xs">channel</div>
                </div>
              </div>

              <img src={result.imageUrl} alt={`${symbol} chart`} className="w-full block" />

              <div className="px-4 py-3 text-slate-100 text-sm whitespace-pre-wrap leading-relaxed">
                {renderTelegramMarkdown(displayedCaption)}
              </div>

              <div className="px-4 pb-4 flex flex-col gap-2">
                {result.buttons.inline_keyboard.map((row, i) => (
                  <div key={i} className="flex gap-2">
                    {row.map((btn, j) => (
                      <div
                        key={j}
                        className="flex-1 text-center rounded-lg py-2 text-sm font-medium"
                        style={{ background: '#182533', color: '#5eabf1', border: '1px solid #223140' }}
                      >
                        {btn.text}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
