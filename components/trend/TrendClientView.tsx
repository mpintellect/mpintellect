// components/trend/TrendClientView.tsx

'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Activity, Layers, ArrowRight, Gauge, Zap, Bot } from 'lucide-react';
import NotificationButton from '@/components/NotificationButton';
import SymbolNavigation from '@/components/SymbolNavigation';
import LiveSeoSchema from '@/components/LiveSeoSchema';
import { formatPriceForSymbol } from '@/app/lib/formatting';
import { commonTranslations, Locale } from '@/app/lib/translations';
import { unifiedGenerator } from '@/app/lib/unifiedGenerator';

interface TrendClientViewProps {
  data: any;
  symbol: string;
  locale: Locale;
  onRefresh: () => Promise<void>;
}

export default function TrendClientView({ data, symbol, locale, onRefresh }: TrendClientViewProps) {
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
  if (!data || !data.trend) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <p className="text-zinc-400">No trend data available for {symbol.toUpperCase()}</p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md"
        >
          {t.retry}
        </button>
      </div>
    );
  }

  const trendData = data.trend;
  const resolvedSymbol = data.symbol || symbol;
  
  const isBullish = trendData.trend?.toLowerCase() === 'bullish';
  
  // Colors based on logic
  const accentColor = isBullish ? "text-emerald-400" : "text-rose-400";
  const strokeColor = isBullish ? "#34d399" : "#fb7185"; 
  
  // Dynamic gradient tint for the glass card
  const bgTint = isBullish 
    ? "bg-gradient-to-br from-emerald-900/20 to-transparent" 
    : "bg-gradient-to-br from-rose-900/20 to-transparent";

  // Format function
  const fmt = (num: number) => num?.toLocaleString('en-US', { maximumFractionDigits: 10 }) || '0';
  
  // Generate report with locale
  const report = unifiedGenerator({ data, symbol, locale, tool: 'trend' });
  
  // Get translated report sections
  const context = report.context || '';
  const technicals = report.technicals || '';
  const verdict = report.verdict || '';

  return (
    <div className="min-h-screen bg-black text-white pb-24 font-sans selection:bg-yellow-500/30" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* SEO Schema */}
      <LiveSeoSchema data={data} locale={locale} tool="trend" />
      
      {/* HERO HEADER */}
      <div className="pt-28 pb-10 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-white/10 bg-white/5 text-zinc-400 text-[10px] uppercase font-bold tracking-widest">
           <Activity size={12} className="text-yellow-500" /> {t.algoTrendEngine}
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter text-white">
           {resolvedSymbol} <span className={accentColor}>{trendData.trend || 'NEUTRAL'}</span>
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
        
        {/* MAIN DASHBOARD GLASS CARD */}
        <div className={`md:col-span-8 p-8 rounded-3xl relative overflow-hidden glass-trend-card ${bgTint}`}>
            
            {/* Visual Header within card */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
                <span className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                    <Gauge size={14} /> {t.strengthMeter}
                </span>
                <span className={`text-xs font-black uppercase px-2 py-1 rounded bg-white/5 border border-white/10 ${accentColor}`}>
                    {(trendData.trend_strength || 'neutral').replace(/_/g, " ")}
                </span>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                
                {/* GAUGE CHART (SVG) */}
                <div className="relative w-64 h-64 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        {/* Background Track */}
                        <path className="text-white/5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" />
                        {/* Active Value Ring with Glow */}
                        <path 
                            className="filter-glow transition-all duration-1000 ease-out"
                            stroke={strokeColor}
                            strokeDasharray={`${trendData.trend_strength_score || 50}, 100`} 
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                            fill="none" strokeWidth="2" strokeLinecap="round"
                        />
                    </svg>
                    {/* Centered Number */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-6xl font-black tracking-tighter text-white">{trendData.trend_strength_score || 50}</span>
                        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-1">/ 100 {t.strength}</span>
                    </div>
                </div>

                {/* METRICS COLUMN */}
                <div className="w-full space-y-6">
                    <div>
                        <h3 className="text-[10px] text-zinc-500 font-bold uppercase mb-3 flex items-center gap-2">
                            <Layers size={12} /> {t.emaStructure}
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col">
                                <span className="text-[9px] text-zinc-500 uppercase font-bold">{t.structureMode}</span>
                                <span className="text-sm font-bold text-white capitalize mt-1">
                                    {(trendData.ema_alignment || 'neutral').replace(/_/g, ' ')}
                                </span>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col">
                                <span className="text-[9px] text-zinc-500 uppercase font-bold">{t.position}</span>
                                <span className="text-sm font-bold text-white mt-1">
                                    {(trendData.price_position?.vs_ema50 || 'near').replace('_', ' ').toUpperCase()} EMA 50
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center bg-white/5 p-2 px-3 rounded-lg border border-white/5">
                            <span className="text-xs font-medium text-emerald-400">{t.emaFast}</span>
                            <span className="text-sm font-mono text-white font-bold">{fmt(trendData.current_emas?.ema_8)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-2 px-3 rounded-lg border border-white/5">
                            <span className="text-xs font-medium text-blue-400">{t.emaBaseline}</span>
                            <span className="text-sm font-mono text-white font-bold">{fmt(trendData.current_emas?.ema_21)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-2 px-3 rounded-lg border border-white/5">
                            <span className="text-xs font-medium text-yellow-500">{t.emaMacro}</span>
                            <span className="text-sm font-mono text-white font-bold">{fmt(trendData.current_emas?.ema_50)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* SIDEBAR / NOTIFICATIONS */}
        <div className="md:col-span-4 flex flex-col gap-6">
            <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/30 flex flex-col items-center justify-center text-center h-full">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500 mb-4">
                    <Zap size={20} />
                </div>
                <h4 className="text-white font-bold text-lg mb-2">{t.trackSymbol} {resolvedSymbol}</h4>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed px-2">
                    Our AI monitors trend strength shifts 24/7. Get instant alerts when market structure flips.
                </p>
                <NotificationButton locale={locale} />
            </div>
        </div>

      </div>

      {/* SEO CONTENT */}
      <section className="report-container">
        <h2 className="report-header">{t.technicalAnalysisReport}</h2>
        
        <div>
          {/* 1. Context - The Story */}
          <p className="report-context">
            {context}
          </p>
          
          {/* 2. Technicals - The Data Evidence */}
          <div className="report-technicals-box">
            {technicals}
          </div>
          
          {/* 3. Verdict - The Final Decision */}
          <div className="report-verdict-card">
            <span className="report-verdict-label">{t.finalVerdict}</span>
            <p className="report-verdict-text">
              {verdict}
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <SymbolNavigation symbol={resolvedSymbol} locale={locale} />

    </div>
  );
}