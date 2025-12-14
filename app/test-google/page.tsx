import React from 'react';

export const dynamic = 'force-dynamic';

export default function TestGoogleAds() {
  const symbols = ['BTCUSD', 'XAUUSD', 'EURUSD', 'US500'];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      <header className="mb-10 border-b border-slate-800 pb-6 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold mb-2 text-white">Google Ads Live Dashboard</h1>
            <p className="text-slate-400">Previewing Landscape (1.91:1) Dynamic Assets</p>
        </div>
        <a 
          href="/api/google-feed" 
          target="_blank"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
        >
          Download Google CSV
        </a>
      </header>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {symbols.map((sym) => (
          <div key={sym} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex justify-between text-xs text-slate-500 font-mono">
              <span>{sym}</span>
              <span>1200 x 628</span>
            </div>
            
            <div className="relative w-full">
              <img 
                src={`/api/og-google?symbol=${sym}&t=${Date.now()}`} 
                alt={`${sym} Google Ad`} 
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            
            <div className="p-4">
                <div className="text-sm text-slate-400 mb-1">Headline Preview:</div>
                <div className="text-xl font-bold text-white">{sym} AI Analysis</div>
                <div className="text-sm text-blue-400 mt-2">Live Entry & Stop Loss for {sym}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}