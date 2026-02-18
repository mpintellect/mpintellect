'use client';
import { useState } from 'react';

const STYLES = ['standard', 'chat', 'propfirm'];
const SYMBOLS = ['XAUUSD', 'BTCUSD', 'EURUSD', 'GBPUSD'];

export default function AdPreviewer() {
  const [testSymbol, setTestSymbol] = useState('XAUUSD');

  return (
    <main className="min-h-screen bg-[#050505] p-12 text-white">
      <h1 className="text-3xl font-black mb-12 border-b border-zinc-900 pb-6">AD_CREATIVE_PREVIEW</h1>
      
      <div className="flex gap-4 mb-12">
         {SYMBOLS.map(s => (
           <button key={s} onClick={() => setTestSymbol(s)} className={`px-6 py-2 rounded-full border ${testSymbol === s ? 'bg-white text-black' : 'border-zinc-800 text-zinc-500'}`}>
             {s}
           </button>
         ))}
      </div>

      <div className="space-y-20">
        {STYLES.map(style => (
          <section key={style}>
            <h2 className="text-[#D4AF37] text-xs font-bold uppercase tracking-[4px] mb-8">{style} variations</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Landscape Version */}
              <div>
                <p className="text-zinc-600 text-[10px] mb-2 uppercase">Google Landscape (1200x628)</p>
                <img 
                  src={`/api/ads/render?symbol=${testSymbol}&style=${style}&size=standard&v=${Date.now()}`} 
                  className="w-full border border-zinc-800 rounded-lg shadow-2xl"
                  loading="lazy"
                />
              </div>
              {/* Square Version */}
              <div>
                <p className="text-zinc-600 text-[10px] mb-2 uppercase">Facebook Square (1080x1080)</p>
                <img 
                  src={`/api/ads/render?symbol=${testSymbol}&style=${style}&size=square&v=${Date.now()}`} 
                  className="w-80 border border-zinc-800 rounded-lg shadow-2xl"
                  loading="lazy"
                />
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}