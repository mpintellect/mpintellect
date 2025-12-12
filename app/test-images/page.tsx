import React from 'react';

// Force dynamic rendering so images don't cache forever while testing
export const dynamic = 'force-dynamic';

export default function TestImages() {
  const testSymbols = ['BTCUSD', 'XAUUSD', 'EURUSD'];
  const types = ['CHAT', 'TARGETS', 'RISK'];

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      
      <header className="mb-10 border-b border-zinc-800 pb-6">
        <h1 className="text-3xl font-bold mb-2 text-white">Ad Creative Dashboard</h1>
        <p className="text-zinc-400">
          Live generation test. If images are broken, check console for 500 errors.
        </p>
        <a 
          href="/api/fb-catalog" 
          target="_blank"
          className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-bold transition-colors"
        >
          Download CSV Catalog
        </a>
      </header>
      
      <div className="space-y-12">
        {types.map(type => (
           <section key={type} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-8 rounded-full ${
                  type === 'CHAT' ? 'bg-green-500' : 
                  type === 'TARGETS' ? 'bg-amber-500' : 'bg-blue-500'
                }`}></div>
                <h2 className="text-2xl font-bold text-zinc-100">{type} Ads</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {testSymbols.map((sym) => (
                  <div key={sym + type} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="px-4 py-3 bg-zinc-950 border-b border-zinc-800 flex justify-between text-xs text-zinc-500 font-mono">
                      <span>{sym}</span>
                      <span>OG IMAGE API</span>
                    </div>
                    
                    <div className="relative aspect-[1.91/1] bg-zinc-950 w-full group">
                      {/* The Image */}
                      <img 
                        src={`/api/og?symbol=${sym}&type=${type}&t=${Date.now()}`} // Added timestamp to force refresh
                        alt={`${sym} ${type}`} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      
                      {/* Hover Overlay for Debugging */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                         <span className="text-white font-mono text-sm bg-black px-2 py-1 rounded">
                           /api/og?symbol={sym}&type={type}
                         </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
           </section>
        ))}
      </div>
    </div>
  );
}