// components/volatility/VolatilityClientView.tsx

'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Activity, ShieldAlert, ArrowRight, TrendingUp, Bot } from 'lucide-react';
import NotificationButton from '@/components/NotificationButton';
import SymbolNavigation from '@/components/SymbolNavigation';
import LiveSeoSchema from '@/components/LiveSeoSchema';
import { formatPriceForSymbol } from '@/app/lib/formatting';
import { commonTranslations, Locale } from '@/app/lib/translations';
import { unifiedGenerator } from '@/app/lib/unifiedGenerator';

interface VolatilityClientViewProps {
  data: any;
  symbol: string;
  locale: Locale;
  onRefresh: () => Promise<void>;
}

export default function VolatilityClientView({ data, symbol, locale, onRefresh }: VolatilityClientViewProps) {
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const t = commonTranslations[locale];
  const isRtl = locale === 'ar';

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setLastUpdated(new Date().toISOString());
    setIsRefreshing(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 300000);
    return () => clearInterval(interval);
  }, []);

  // Check for data availability
  if (!data || !data.volatility) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <p className="text-zinc-400">No volatility data available for {symbol.toUpperCase()}</p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md"
        >
          {t.retry}
        </button>
      </div>
    );
  }

  const v = data.volatility;
  const resolvedSymbol = data.symbol || symbol;
  
  // Dynamic Styling Logic
  const isHighRisk = v.volatility_score > 0.6;
  const accentColor = isHighRisk ? "text-amber-500" : "text-blue-400";
  const barColor = isHighRisk ? "bg-amber-500" : "bg-blue-500";
  const glowStyle = isHighRisk 
    ? "bg-gradient-to-br from-amber-900/20 to-black border-amber-900/30" 
    : "bg-gradient-to-br from-blue-900/20 to-black border-blue-900/30";

  // Format function
  const fmt = (num: number) => num.toLocaleString(undefined, { maximumFractionDigits: 10 });

  // Generate report with locale
  const report = unifiedGenerator({ data, symbol, locale, tool: 'volatility' });
  
  // Get report sections
  const context = report.context || '';
  const stats = report.stats || '';
  const strategy = report.strategy || '';

  return (
    <div className="min-h-screen bg-black text-white pb-24 font-sans selection:bg-purple-500/30" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* SEO Schema */}
      <LiveSeoSchema data={data} locale={locale} tool="volatility" />
      
      {/* HERO HEADER */}
      <div className="pt-28 pb-10 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-white/10 bg-white/5 text-zinc-400 text-[10px] uppercase font-bold tracking-widest">
           <BarChart3 size={12} className="text-purple-500" /> {t.marketPhysicsEngine}
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter text-white">
           {resolvedSymbol} <span className={accentColor}>{v.volatility_level || 'MEDIUM'} {t.volatility}</span>
        </h1>
        
        <div className="flex items-center justify-center gap-4 mt-4">
          <p className="text-zinc-400 text-sm">
            {t.updated}: {new Date(lastUpdated).toLocaleTimeString()}
          </p>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 rounded-md disabled:opacity-50"
          >
            {isRefreshing ? t.refreshing : t.refresh}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-12 gap-8">
        
        {/* MAIN DASHBOARD CARD */}
        <div className={`md:col-span-8 p-8 rounded-3xl relative overflow-hidden glass-volatility-card ${glowStyle}`}>
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
                <span className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                    <ShieldAlert size={14} /> {t.impliedRiskScore}
                </span>
                <span className="text-xs font-mono font-bold text-white px-2 py-1 rounded bg-white/10">
                    ATR: {(v.current_atr || 0).toFixed(2)}
                </span>
            </div>

            <div className="flex flex-col gap-8">
                
                {/* 1. VOLATILITY BAR METER */}
                <div>
                    <div className="flex justify-between text-sm font-bold text-zinc-400 mb-2 uppercase text-[10px] tracking-wider">
                        <span>{t.compressedSafe}</span>
                        <span>{t.explosiveRisk}</span>
                    </div>
                    
                    <div className="w-full h-6 bg-zinc-900 rounded-full border border-zinc-800 relative overflow-hidden">
                        <div className="absolute top-0 bottom-0 left-1/4 w-px bg-white/5"></div>
                        <div className="absolute top-0 bottom-0 left-2/4 w-px bg-white/5"></div>
                        <div className="absolute top-0 bottom-0 left-3/4 w-px bg-white/5"></div>
                        
                        <div 
                            className={`h-full ${barColor} relative vol-bar-glow`} 
                            style={{ width: `${Math.min((v.volatility_score || 0) * 100, 100)}%` }}
                        >
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white opacity-50 shadow-[0_0_10px_white]"></div>
                        </div>
                    </div>
                    
                    <div className="mt-2 text-right">
                        <span className={`text-4xl font-black ${accentColor}`}>{(v.volatility_score || 0).toFixed(2)}</span>
                        <span className="text-sm text-zinc-500 font-medium"> / 1.0 Index</span>
                    </div>
                </div>

                {/* 2. STATS GRID */}
                <div className="grid grid-cols-2 gap-4">
                    
                    <div className="bg-black/30 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                            <TrendingUp size={18} className="text-zinc-400" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase text-zinc-500 font-bold mb-1">{t.avgRangeCapability}</p>
                            <p className="text-xl font-mono font-bold text-white">{Math.floor(v.avg_range || 0)} <span className="text-xs font-sans font-normal opacity-50">PTS</span></p>
                        </div>
                    </div>

                    <div className="bg-black/30 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                            <ShieldAlert size={18} className={accentColor} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase text-zinc-500 font-bold mb-1">{t.recommendedStop}</p>
                            <p className="text-xl font-mono font-bold text-white">{(v.optimal_sl_multiplier || 1.5)}x <span className="text-xs font-sans font-normal opacity-50">ATR</span></p>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        {/* SIDEBAR */}
        <div className="md:col-span-4 flex flex-col gap-6">
            <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/30 flex flex-col items-center justify-center text-center h-full">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isHighRisk ? 'bg-amber-900/20 text-amber-500' : 'bg-blue-900/20 text-blue-500'}`}>
                    <Activity size={24} />
                </div>
                <h4 className="text-white font-bold text-lg mb-2">{t.regime}: {(v.volatility_regime || 'NEUTRAL').toUpperCase()}</h4>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed px-4">
                    This market condition requires <strong>{isHighRisk ? "reduced position sizing" : "patience for expansion"}</strong>. Get alerted when conditions shift.
                </p>
                <NotificationButton locale={locale} />
            </div>
        </div>

      </div>

      {/* TEXT CONTENT */}
      <section className="vol-container">
        <h2 className="vol-header">{t.volatilityRiskReport}</h2>
        
        <div>
          <p className="vol-context">
            {context}
          </p>
          
          <p className="vol-stats">
            DATA: {stats}
          </p>
          
          <div className="vol-strategy-card">
            <span className="vol-strategy-label">{t.riskAdaptationProtocol}</span>
            <p className="vol-strategy-text">
              {strategy}
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <SymbolNavigation symbol={resolvedSymbol} locale={locale} />

    </div>
  );
}