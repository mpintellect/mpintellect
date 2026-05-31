// components/analysis/AnalysisClientView.tsx

'use client';

import { useState, useEffect } from 'react';
import { 
  Activity, Gauge, Layers, 
  Cpu, Thermometer, Bot,
} from 'lucide-react';
import NotificationButton from '@/components/NotificationButton';
import LiveSeoSchema from '@/components/LiveSeoSchema';
import SymbolNavigation from '@/components/SymbolNavigation';
import { formatPriceForSymbol } from '@/app/lib/formatting';
import { commonTranslations, Locale } from '@/app/lib/translations';
import { unifiedGenerator } from '@/app/lib/unifiedGenerator';

interface AnalysisClientViewProps {
  data: any;
  symbol: string;
  locale: Locale;
  onRefresh: () => Promise<void>;
}

export default function AnalysisClientView({ data, symbol, locale, onRefresh }: AnalysisClientViewProps) {
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

  if (!data || !data.trend) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-gray-200">
        <h1 className="text-2xl font-semibold mb-2">Analysis not available</h1>
        <p className="text-sm text-gray-400">
          We couldn&apos;t load analysis data for {symbol?.toUpperCase() || 'this symbol'}. Please try another symbol or refresh the page.
        </p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md"
        >
          {t.retry || 'Retry'}
        </button>
      </div>
    );
  }

  const { trend, momentum, volatility } = data;
  
  // Generate report with locale
  const report = unifiedGenerator({ data, symbol, locale, tool: 'analysis' });
  
  // Safely extract analysis-specific properties
  const healthCheck = (report as any).health_check || '';
  const liquidity = (report as any).liquidity || '';
  const verdict = (report as any).verdict || '';

  // Derived Values
  const trendPercent = trend.trend_strength_score || 0;
  const isHighRisk = volatility?.volatility_level === 'high';
  
  // Financial terms stay in English
  const trendText = trend.trend?.replace(/_/g, ' ')?.toUpperCase() || 'NEUTRAL';
  const momentumBiasText = momentum.momentum_bias?.toUpperCase() || 'NEUTRAL';
  const divergenceText = momentum.divergence_detected?.toUpperCase() || 'NONE';
  const volatilityLevelText = volatility.volatility_level?.toUpperCase() || 'MODERATE';
  const volatilityRegimeText = volatility.volatility_regime?.toUpperCase() || 'NORMAL';
  const pricePositionText = trend.price_position?.vs_ema50?.toUpperCase() || 'NEAR';

  return (
    <main className="min-h-screen bg-black text-white pb-24 font-sans selection:bg-blue-500/30" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* SEO Schema */}
      <LiveSeoSchema data={data} locale={locale} tool="analysis" />
      
      {/* Header */}
      <div className="pt-28 pb-8 px-6 border-b border-zinc-900 bg-gradient-to-b from-zinc-900/50 to-black">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2 py-1 mb-3 rounded border border-blue-500/30 bg-blue-900/20 text-blue-400 text-[10px] uppercase font-bold tracking-widest font-mono">
              <Cpu size={12} /> {t.systemStatus}
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
              {data.symbol} <span className="text-zinc-600">{t.marketMatrix}</span>
            </h1>
            <p className="text-zinc-400 text-sm mt-2 max-w-lg">
              {t.fullMarketStructure}
            </p>
            
            <div className="flex items-center gap-4 mt-2">
              <p className="text-zinc-400 text-xs">
                {t.updated}: {new Date(lastUpdated).toLocaleTimeString()}
              </p>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-2 py-0.5 text-[10px] bg-zinc-800 hover:bg-zinc-700 rounded disabled:opacity-50"
              >
                {isRefreshing ? t.refreshing : t.refresh}
              </button>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">{t.currentPriceAction}</p>
            <p className="text-4xl font-mono font-bold text-white tracking-tight">
              {formatPriceForSymbol(symbol, trend.current_price)}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-10">
        
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* TREND SECTION */}
          <div className="md:col-span-2 p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 relative overflow-hidden transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Layers size={20} /></div>
              <h3 className="text-lg font-bold text-white">{t.trendArchitecture}</h3>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <span className="text-xs text-zinc-500 uppercase font-bold">{t.structureMode}</span>
                <p className="text-2xl font-bold text-white mt-1 capitalize">{trendText}</p>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Price is currently positioned <strong>{pricePositionText}</strong> the baseline institutional MA (EMA50), signaling dominance by {trend.trend?.includes('bull') ? 'Buyers' : 'Sellers'}.
                </p>
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex justify-between text-xs font-bold text-zinc-500 mb-2">
                  <span>{t.strength}</span>
                  <span>{trendPercent}/100</span>
                </div>
                <div className="h-3 bg-black rounded-full overflow-hidden border border-zinc-800">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-1000"
                    style={{ width: `${trendPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* MOMENTUM SECTION */}
          <div className="md:row-span-2 p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-col relative overflow-hidden transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Thermometer size={20} /></div>
              <h3 className="text-lg font-bold text-white">{t.marketThermal}</h3>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="w-full relative h-40 bg-zinc-950 rounded-xl border border-zinc-800 flex items-end px-8 overflow-hidden mb-6">
                <div 
                  className={`w-full transition-all duration-1000 opacity-60 ${(momentum.rsi_latest || 50) > 60 ? 'bg-purple-500' : 'bg-emerald-500'}`}
                  style={{ height: `${momentum.rsi_latest || 50}%`, filter: 'blur(20px)' }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-black text-white">{(momentum.rsi_latest || 50).toFixed(1)}</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">RSI</span>
                </div>
              </div>

              <div className="w-full text-left space-y-3">
                <MetricRow label={t.velocityBias} value={momentumBiasText} highlight={false} />
                <MetricRow label={t.divergence} value={divergenceText} highlight={divergenceText !== 'NONE'} />
                <MetricRow label={t.slopeAngle} value={(momentum.rsi_slope || 0).toFixed(4)} highlight={false} />
              </div>
            </div>
          </div>

          {/* VOLATILITY SECTION */}
          <div className="md:col-span-2 p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400"><Activity size={20} /></div>
                <h3 className="text-lg font-bold text-white">{t.volatilityRegime}</h3>
              </div>
              <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${isHighRisk ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                {volatilityLevelText} Risk
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatBox label={t.atrDaily} value={formatPriceForSymbol(symbol, volatility?.current_atr)} />
              <StatBox label={t.historicalAvg} value={formatPriceForSymbol(symbol, volatility?.avg_range)} />
              <StatBox label={t.rangeStatus} value={volatilityRegimeText} capitalize />
              <StatBox label={t.recStop} value={`${volatility?.optimal_sl_multiplier || 1.5}x ATR`} highlight />
            </div>
          </div>

        </div>

        {/* AI Validation Box */}
        <div className="ai-validation-box flex items-start gap-4 mt-8" style={{ flexDirection: isRtl ? 'row-reverse' : 'row' }}>
          <div className="ai-icon-container">
            <Bot size={24} />
          </div>
          <div className="ai-validation-content">
            <h4 className="ai-validation-title text-white font-bold mb-2">
              {t.aiValidationTitle}
            </h4>
            <p className="ai-validation-description text-zinc-400 text-sm">
              {t.aiValidationDesc}
            </p>
            <a href="/AIChat" className="ai-validation-link text-blue-400 text-sm hover:underline mt-2 inline-block">
              {t.aiValidationLink}
            </a>
          </div>
        </div>
        
        {/* Written Analysis Report */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800">
            <span className="text-xs text-zinc-500 uppercase font-bold block mb-4">{t.diagnosticReport}</span>
            <div className="space-y-4">
              <p className="text-zinc-300 text-sm leading-relaxed">{healthCheck}</p>
              <div className="bg-black/30 rounded-xl p-4 border-l-4 border-amber-500">
                <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-2">{t.liquidityStatus}</span>
                <p className="text-zinc-300 text-sm">{liquidity}</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-col">
            <span className="text-xs text-zinc-500 uppercase font-bold block mb-4">{t.algorithmFinalVerdict}</span>
            <p className="text-zinc-300 text-sm italic mb-6">"{verdict}"</p>
            <div className="mt-auto">
              <NotificationButton />
              <p className="text-zinc-500 text-xs mt-3">{t.receiveLiveUpdates}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <SymbolNavigation symbol={symbol} />
    </main>
  );
}

// Helper Components
function MetricRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5">
      <span className="text-xs text-zinc-500 uppercase font-semibold">{label}</span>
      <span className={`text-sm font-mono font-bold ${highlight ? 'text-yellow-400' : 'text-white'}`}>{value}</span>
    </div>
  );
}

function StatBox({ label, value, capitalize = false, highlight = false }: { label: string; value: string; capitalize?: boolean; highlight?: boolean }) {
  return (
    <div className="p-4 bg-black/40 rounded-xl border border-zinc-800/50">
      <span className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">{label}</span>
      <span className={`block text-lg font-bold ${highlight ? 'text-amber-400' : 'text-white'} ${capitalize ? 'capitalize' : ''}`}>
        {value}
      </span>
    </div>
  );
}