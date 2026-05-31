// components/zones/ZonesClientView.tsx

'use client';

import { useState, useEffect } from 'react';
import { BoxSelect, Minimize2, Target } from 'lucide-react';
import NotificationButton from '@/components/NotificationButton';
import SymbolNavigation from '@/components/SymbolNavigation';
import LiveSeoSchema from '@/components/LiveSeoSchema';
import { formatPriceForSymbol } from '@/app/lib/formatting';
import { commonTranslations, Locale } from '@/app/lib/translations';
import { unifiedGenerator } from '@/app/lib/unifiedGenerator';

interface ZonesClientViewProps {
  data: any;
  symbol: string;
  locale: Locale;
  onRefresh: () => Promise<void>;
}

export default function ZonesClientView({ data, symbol, locale, onRefresh }: ZonesClientViewProps) {
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
  if (!data || !data.zones) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <p className="text-zinc-400">No zone data available for {symbol.toUpperCase()}</p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md"
        >
          {t.retry}
        </button>
      </div>
    );
  }

  const zonesData = data.zones;
  const currentPrice = data.trend?.current_price || 0;
  const resolvedSymbol = data.symbol || symbol;

  // Generate report with locale
  const report = unifiedGenerator({ data, symbol, locale, tool: 'zones' });
  
  // Get report sections
  const context = report.context || '';
  const positionText = report.position || '';
  const strategy = report.strategy || '';

  // Calculate price percentage in range
  const rangeSpan = zonesData.resistance_zone - zonesData.support_zone;
  let pricePct = 50;
  if (rangeSpan > 0) {
    pricePct = ((currentPrice - zonesData.support_zone) / rangeSpan) * 100;
    pricePct = Math.max(0, Math.min(100, pricePct));
  }

  // Format numbers
  const formatNumber = (num: number) => {
    const cleanSymbol = resolvedSymbol.replace(/[-_/]/g, '').toUpperCase();
    return formatPriceForSymbol(cleanSymbol, num);
  };

  // Determine strategy label
  const isShortStrategy = zonesData.order_placement_context === 'limit_at_resistance';
  const strategyLabel = isShortStrategy ? t.shortLimit : (zonesData.order_placement_context === 'limit_at_support' ? t.longLimit : t.standAside);

  return (
    <div className="min-h-screen bg-black text-white pb-24 font-sans selection:bg-orange-500/30" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* SEO Schema */}
      <LiveSeoSchema data={data} locale={locale} tool="zones" />
      
      {/* HEADER */}
      <div className="pt-28 pb-10 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-orange-500/30 bg-orange-900/10 text-orange-300 text-[10px] uppercase font-bold tracking-widest">
          <BoxSelect size={12} /> {t.institutionalLevels}
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter text-white">
          {resolvedSymbol} <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">{t.zones}</span>
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
        
        {/* MAIN GLASS CARD */}
        <div className="md:col-span-8 p-8 rounded-3xl relative overflow-hidden glass-trend-card bg-gradient-to-b from-zinc-900 to-black">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-10">
                <span className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                    <Target size={14} /> {t.rangeMap}
                </span>
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest px-2 py-1 rounded bg-orange-900/20 border border-orange-900/50">
                    {t.quality}: {(zonesData.component_quality || 0).toFixed(0)}/100
                </span>
            </div>

            <div className="flex flex-col gap-12">
                
                {/* VISUAL ZONE MAP (Vertical Bar) */}
                <div className="flex items-stretch gap-6 h-64 md:h-80">
                    
                    {/* The Scale */}
                    <div className="flex flex-col justify-between text-xs font-mono text-zinc-500 py-1">
                        <div className="flex items-center gap-2">
                            <span className="text-red-400 font-bold">{formatNumber(zonesData.resistance_zone)}</span> 
                            <span>{t.res}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-emerald-400 font-bold">{formatNumber(zonesData.support_zone)}</span>
                            <span>{t.sup}</span>
                        </div>
                    </div>

                    {/* The Bar */}
                    <div className="flex-1 bg-zinc-900/50 rounded-2xl border border-zinc-800 relative w-12 md:w-20 mx-auto">
                        
                        {/* Red Zone (Top) */}
                        <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-red-500/20 to-transparent border-t-2 border-red-500/50 rounded-t-xl"></div>
                        
                        {/* Green Zone (Bottom) */}
                        <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-emerald-500/20 to-transparent border-b-2 border-emerald-500/50 rounded-b-xl"></div>

                        {/* PRICE MARKER (Moves dynamically) */}
                        <div 
                            className="absolute left-0 right-0 h-0.5 bg-white shadow-[0_0_15px_white] flex items-center transition-all duration-1000"
                            style={{ bottom: `${pricePct}%` }}
                        >
                            <div className="absolute w-full border-t border-dashed border-zinc-500"></div>
                            <div className="absolute right-[-80px] bg-white text-black font-bold text-[10px] px-2 py-1 rounded flex items-center gap-1 shadow-lg">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                {formatNumber(currentPrice)}
                            </div>
                        </div>

                    </div>

                    {/* The Status Side */}
                    <div className="flex flex-col justify-center gap-4 text-xs">
                        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                            <span className="block text-zinc-500 uppercase text-[9px] font-bold mb-1">{t.status}</span>
                            <span className="block text-white font-bold capitalize">
                                {zonesData.current_price_position?.replace(/_/g, ' ') || 'Unknown'}
                            </span>
                        </div>
                        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                            <span className="block text-zinc-500 uppercase text-[9px] font-bold mb-1">{t.spread}</span>
                            <span className="block text-white font-bold">{zonesData.zone_width_pips || 0} Pips</span>
                        </div>
                    </div>

                </div>

            </div>
        </div>

        {/* SIDEBAR */}
        <div className="md:col-span-4 flex flex-col gap-6">
            <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/30 flex flex-col items-center justify-center text-center h-full">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-orange-600/10 text-orange-500 border border-orange-500/20">
                    <Minimize2 size={24} />
                </div>
                <h4 className="text-white font-bold text-lg mb-2">
                    {t.strategy}: {strategyLabel}
                </h4>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed px-2">
                    Current AI confidence is <strong>{zonesData.zone_confidence?.toUpperCase() || 'MEDIUM'}</strong>. 
                    Price is testing critical structural integrity.
                </p>
                <NotificationButton locale={locale} />
            </div>
        </div>

      </div>

      {/* CONTENT SEO */}
      <section className="inst-container">
        <h2 className="inst-header">{t.institutionalLevelsBreakdown}</h2>
        
        <div>
            <p className="inst-context">
              {context}
            </p>
            
            <div className="inst-position-box">
                <span className="inst-position-label">{t.currentPriceLocation}</span>
                <p className="inst-position-text">
                  {positionText}
                </p>
            </div>
            
            <div className="inst-directive-card">
                <span className="inst-directive-label">{t.tradingDirective}</span>
                <p className="inst-directive-text">
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