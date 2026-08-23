// components/momentum/MomentumClientView.tsx

'use client';

import { useState, useEffect } from 'react';
import { Zap, Activity, Waves, ArrowRight, GaugeCircle, Bot } from 'lucide-react';
import NotificationButton from '@/components/NotificationButton';
import SymbolNavigation from '@/components/SymbolNavigation';
import LiveSeoSchema from '@/components/LiveSeoSchema';
import { commonTranslations, Locale } from '@/app/lib/translations';
import { unifiedGenerator } from '@/app/lib/unifiedGenerator';

interface MomentumClientViewProps {
  data: any;
  symbol: string;
  locale: Locale;
  onRefresh: () => Promise<void>;
}

export default function MomentumClientView({ data, symbol, locale, onRefresh }: MomentumClientViewProps) {
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

  if (!data || !data.momentum) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-900">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Syncing Market Data...</p>
        </div>
      </div>
    );
  }

  const m = data.momentum;

  // Generate report with locale
  const report = unifiedGenerator({ data, symbol, locale, tool: 'momentum' }) as any;

  const rsiVal = m.rsi_latest || 50;
  const isHot = rsiVal > 65;
  const isCold = rsiVal < 35;

  // Dynamic Coloring
  const rsiColor = isHot ? "text-rose-500" : isCold ? "text-emerald-500" : "text-purple-500";
  const glowClass = isHot
    ? "shadow-[0_0_20px_-5px_rgba(244,63,94,0.6)]"
    : isCold
      ? "shadow-[0_0_20px_-5px_rgba(16,185,129,0.6)]"
      : "shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)]";

  // Get report sections
  const context = report.context || '';
  const stats = report.stats || '';
  const verdict = report.verdict || '';

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-24 font-sans selection:bg-purple-500/30" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* SEO Schema */}
      <LiveSeoSchema data={data} locale={locale} tool="momentum" />

      {/* HEADER SECTION */}
      <div className="pt-28 pb-10 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-purple-500/30 bg-purple-50 text-purple-600 text-[10px] uppercase font-bold tracking-widest">
           <Zap size={12} className="fill-current" /> {t.kineticEnergy}
        </div>

        <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter text-gray-900">
           {data.symbol} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">{t.momentum}</span>
        </h1>

        <p className="text-gray-500 text-lg max-w-xl mx-auto">
           {t.oscillatorHealth}
        </p>

        <div className="flex items-center justify-center gap-4 mt-4">
          <p className="text-gray-500 text-sm">
            {t.updated}: {new Date(lastUpdated).toLocaleTimeString()}
          </p>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50"
          >
            {isRefreshing ? t.refreshing : t.refresh}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-12 gap-8">

        {/* THE MAIN DASHBOARD (Glass Card) */}
        <div className="md:col-span-8 p-8 rounded-3xl relative overflow-hidden glass-momentum-card">

            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
                <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                    <Waves size={14} /> {t.rsiHeatmap}
                </span>
                <span className={`text-xs font-mono font-bold px-2 py-1 rounded bg-gray-50 border border-gray-200 ${rsiColor}`}>
                    {t.reading}: {(rsiVal || 50).toFixed(2)}
                </span>
            </div>

            <div className="flex flex-col gap-10">

                {/* 1. RSI LINEAR METER */}
                <div className="relative pt-4 pb-2">
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-2 tracking-widest uppercase">
                        <span>{t.oversold}</span>
                        <span>{t.equilibrium}</span>
                        <span>{t.overbought}</span>
                    </div>

                    <div className="w-full h-8 bg-gray-100 rounded-lg border border-gray-200 relative overflow-hidden">
                        <div className="absolute left-0 w-[30%] h-full bg-emerald-50 border-r border-dashed border-black/10"></div>
                        <div className="absolute right-0 w-[30%] h-full bg-rose-50 border-l border-dashed border-black/10"></div>

                        <div
                            className={`absolute top-0 bottom-0 w-1.5 h-full bg-gray-900 transition-all duration-700 ease-out z-10 ${glowClass}`}
                            style={{ left: `${Math.min(Math.max(rsiVal || 50, 0), 100)}%` }}
                        >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-3 py-1.5 rounded border border-black/10 whitespace-nowrap shadow-lg">
                                {Math.round(rsiVal || 50)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. KEY METRICS GRID */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 border border-purple-500/20 p-4 rounded-2xl flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                            <Activity size={14} className="text-purple-500" />
                            <span className="text-[10px] uppercase text-gray-500 font-bold">{t.trendAlignment}</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 capitalize">{(m.trend_alignment || 'neutral').replace(/_/g, " ")}</p>
                    </div>

                    <div className="bg-cyan-50 border border-cyan-500/20 p-4 rounded-2xl flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                            <GaugeCircle size={14} className="text-cyan-500" />
                            <span className="text-[10px] uppercase text-gray-500 font-bold">{t.slopeVelocity}</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 font-mono">{(m.rsi_slope || 0).toFixed(4)}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* SIDEBAR ACTION */}
        <div className="md:col-span-4 flex flex-col gap-6">
            <div className="p-6 rounded-3xl border border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-center h-full">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${isHot ? 'bg-rose-100 text-rose-600' : isCold ? 'bg-emerald-100 text-emerald-600' : 'bg-purple-100 text-purple-600'}`}>
                    <Zap size={24} fill="currentColor" />
                </div>
                <h4 className="text-gray-900 font-bold text-lg mb-2">{isHot ? t.hot : isCold ? t.cool : t.neutral}</h4>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed px-2">
                    Current momentum implies a <strong>{m.momentum_strength || 'neutral'}</strong> strength rating.
                    {m.divergence_detected !== 'none' && m.divergence_detected && <span className="text-amber-600 block mt-2">⚠️ {t.divergenceDetected}</span>}
                </p>
                <NotificationButton locale={locale} />
            </div>
        </div>

      </div>

      {/* WRITTEN CONTENT (SEO) */}
      <section className="velo-container">
        <h2 className="velo-header">{t.velocityAnalysisReport}</h2>

        <div>
          <p className="velo-context">
            {context}
          </p>

          <div className="velo-terminal-card">
            <p className="velo-terminal-text">
              {stats}
            </p>
          </div>

          <p className="velo-verdict">
            "{verdict}"
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <SymbolNavigation symbol={data.symbol || symbol} locale={locale} />

    </div>
  );
}
