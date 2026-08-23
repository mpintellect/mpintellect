// components/indicator/IndicatorClientView.tsx

'use client';

import { useState, useEffect } from 'react';
import { Activity, Zap, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, Gauge, Bot } from 'lucide-react';
import SymbolNavigation from '@/components/SymbolNavigation';
import LiveSeoSchema from '@/components/LiveSeoSchema';
import { commonTranslations, Locale } from '@/app/lib/translations';
import { unifiedGenerator } from '@/app/lib/unifiedGenerator';

interface IndicatorClientViewProps {
  data: any;
  symbol: string;
  locale: Locale;
  onRefresh: () => Promise<void>;
}

export default function IndicatorClientView({ data, symbol, locale, onRefresh }: IndicatorClientViewProps) {
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
  if (!data || !data.momentum) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-gray-900">
        <p className="text-gray-500">No indicator data available for {symbol.toUpperCase()}</p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          {t.retry}
        </button>
      </div>
    );
  }

  // Generate report with locale
  const report = unifiedGenerator({ data, symbol, locale, tool: 'indicator' }) as any;

  const rsi = report.rsiValue || 50;
  const status = report.status || "NEUTRAL MOMENTUM";
  const statusColor = report.color || "text-purple-500";
  const barColor = report.barColor || "bg-purple-500";
  const advice = report.advice || "";
  const sentiment = report.sentiment || "";
  const divergence = report.divergence || "No Divergence";

  // Select the correct Icon based on RSI Value
  let StatusIcon = Activity;
  if (rsi >= 70) StatusIcon = AlertTriangle;
  else if (rsi <= 30) StatusIcon = CheckCircle;
  else StatusIcon = TrendingUp;

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-6 flex flex-col items-center" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* SEO Schema */}
      <LiveSeoSchema data={data} locale={locale} tool="indicator" />

      {/* HEADER */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <span className="flex items-center justify-center gap-2 text-purple-600 font-bold uppercase tracking-[0.2em] text-xs mb-4">
           <Gauge size={14} /> {t.momentumScanner}
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
          {data.symbol} <span className="text-gray-400">{t.rsiCheck}</span>
        </h1>
        <p className="text-gray-500 text-lg">
          {t.institutionalMomentumAnalysis}
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

      {/* THE INDICATOR DASHBOARD */}
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">

        {/* Glow Background based on status */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${barColor}`} />

        {/* MAIN NUMBER DISPLAY */}
        <div className="text-center mb-10">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{t.relativeStrengthIndex}</p>
            <div className={`text-8xl font-black ${statusColor} tracking-tighter drop-shadow-sm`}>
                {rsi.toFixed(1)}
            </div>

            <div className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm font-bold tracking-wider ${statusColor}`}>
                <StatusIcon size={16} />
                {status}
            </div>
        </div>

        {/* VISUAL GAUGE BAR */}
        <div className="relative h-6 w-full bg-gray-100 rounded-full mb-10 overflow-hidden ring-1 ring-gray-200">
            <div className="absolute top-0 bottom-0 left-[30%] w-[1px] bg-gray-300 z-10" title={t.oversold} />
            <div className="absolute top-0 bottom-0 left-[70%] w-[1px] bg-gray-300 z-10" title={t.overbought} />

            <div
                className={`h-full transition-all duration-1000 ${barColor} relative`}
                style={{ width: `${Math.max(0, Math.min(100, rsi))}%` }}
            >
                <div className="absolute right-0 top-0 bottom-0 w-[10px] bg-white/50 blur-[4px]" />
            </div>
        </div>

        {/* ANALYSIS GRID */}
        <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-gray-200">
            <div>
                <h3 className="text-gray-900 font-bold text-lg mb-3 flex items-center gap-2">
                    <Zap size={18} className="text-blue-500" /> {t.technicalContext}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                    {advice}
                </p>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                    <span className="text-gray-500 text-xs uppercase font-bold">{t.trendBias}</span>
                    <span className="text-gray-900 font-mono">{data.momentum?.momentum_bias?.toUpperCase() || 'NEUTRAL'}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                    <span className="text-gray-500 text-xs uppercase font-bold">{t.velocityStrength}</span>
                    <span className="text-gray-900 font-mono">{data.momentum?.momentum_strength || 'NEUTRAL'}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                    <span className="text-gray-500 text-xs uppercase font-bold">{t.divergenceDetected}</span>
                    <span className={`font-mono ${divergence !== 'No Divergence' ? 'text-orange-500' : 'text-gray-400'}`}>
                        {divergence}
                    </span>
                </div>
            </div>
        </div>

      </div>

      {/* FOOTER */}
      <SymbolNavigation symbol={symbol} locale={locale} />
    </div>
  );
}
