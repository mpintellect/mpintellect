// components/trade/TradeClientView.tsx

'use client';

import { useState, useEffect } from 'react';
import { Crosshair, ShieldAlert, Coins, TrendingUp, AlertTriangle, ArrowRight, Bot, Zap } from 'lucide-react';
import NotificationButton from '@/components/NotificationButton';
import SymbolNavigation from '@/components/SymbolNavigation';
import LiveSeoSchema from '@/components/LiveSeoSchema';
import { formatPriceForSymbol } from '@/app/lib/formatting';
import { commonTranslations, Locale } from '@/app/lib/translations';
import { unifiedGenerator } from '@/app/lib/unifiedGenerator';

interface TradeClientViewProps {
  data: any;
  symbol: string;
  locale: Locale;
  onRefresh: () => Promise<void>;
}

export default function TradeClientView({ data, symbol, locale, onRefresh }: TradeClientViewProps) {
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

  // Safety Check: Are there orders?
  const orderData = data?.pending_orders;
  const activeOrder = orderData?.primary_order || orderData?.pending_orders?.[0];

  if (!data || !activeOrder) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center text-gray-500 font-mono">
        No Active Signals for {symbol}. Check back later.
      </div>
    );
  }

  const action = activeOrder.type.includes('BUY') ? 'BUY' : 'SELL';
  const isBuy = action === 'BUY';
  const colorClass = isBuy ? 'text-emerald-600 border-emerald-400 bg-emerald-50' : 'text-rose-600 border-rose-400 bg-rose-50';
  const bgGradient = isBuy ? 'from-emerald-50 to-white' : 'from-rose-50 to-white';

  // Generate report with locale
  const report = unifiedGenerator({ data, symbol, locale, tool: 'trade' }) as any;

  // Setup data for TP levels
  const setup = {
    tp1: activeOrder.tp_price,
  };

  // Generate blurred premium value for locked features
  const premiumBlurValue = Number(setup.tp1) * 1.05;
  const premiumBlurValue2 = Number(setup.tp1) * 1.1;

  return (
    <div className={`min-h-screen bg-white text-gray-900 pb-24 font-sans selection:${isBuy ? 'bg-emerald-500/30' : 'bg-rose-500/30'}`} dir={isRtl ? 'rtl' : 'ltr'}>

      {/* SEO Schema */}
      <LiveSeoSchema data={data} locale={locale} tool="trade" />

      {/* HEADER SECTION */}
      <div className={`pt-32 pb-16 px-6 text-center border-b border-gray-200 bg-gradient-to-b ${bgGradient}`}>
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border text-[10px] uppercase font-bold tracking-widest ${colorClass}`}>
          {isBuy ? <TrendingUp size={12}/> : <TrendingUp size={12} className="rotate-180"/>}
          {t.activeSignalFound}
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-4 uppercase tracking-tighter text-gray-900">
          {action} <span className="text-gray-400">{data.symbol}</span>
        </h1>

        <p className="text-gray-500 font-mono text-xl max-w-xl mx-auto">
          {t.entryPrice} @ {formatPriceForSymbol(symbol, activeOrder.entry_price)}
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

      {/* MAIN CONTENT GRID */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 grid md:grid-cols-3 gap-6">

        {/* TICKET CARD (Visual Focus) */}
        <div className="md:col-span-2 p-8 rounded-2xl bg-white border border-gray-200 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 opacity-10 blur-3xl rounded-full bg-blue-200 mix-blend-multiply"></div>

          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.orderTicket}</span>
            <span className="text-xs font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">ID: {symbol.toUpperCase()}-AI</span>
          </div>

          <div className="space-y-6">

            {/* 1. ENTRY */}
            <div className="flex justify-between items-end">
              <div className="text-sm text-gray-500 uppercase font-bold">{t.entryPrice}</div>
              <div className="text-3xl font-mono font-bold text-gray-900">{formatPriceForSymbol(symbol, activeOrder.entry_price)}</div>
            </div>

            {/* 2. TP / SL */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="block text-emerald-600 text-xs font-bold mb-1">{t.takeProfit}</span>
                <span className="block text-xl font-mono text-gray-900">{formatPriceForSymbol(symbol, activeOrder.tp_price)}</span>
              </div>
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                <span className="block text-rose-600 text-xs font-bold mb-1">{t.stopLoss}</span>
                <span className="block text-xl font-mono text-gray-900">{formatPriceForSymbol(symbol, activeOrder.sl_price)}</span>
              </div>
            </div>

            {/* 3. TP DETAILS */}
            <section className="target-levels-container">
              <h4 className="target-levels-title">{t.targetLevels}</h4>
              <div className="space-y-2">
                {/* Free TP 1 */}
                <div className="target-level-free">
                  <span>{t.tpSafe}</span>
                  <span className="target-level-free-value">{formatPriceForSymbol(symbol, setup.tp1)}</span>
                </div>

                {/* Blurred Premium Targets */}
                <div className="target-level-premium group">
                  <span>{t.tpSwing}</span>
                  <div className="target-level-blurred">
                    {t.premiumBlur}
                  </div>
                  <div className="target-level-premium-overlay">
                    <a href="/client/login" className="target-level-unlock-link">
                      <Zap size={12} className="inline mr-1" />
                      {t.unlockPremium}
                    </a>
                  </div>
                </div>

                {/* Additional Premium TP */}
                <div className="target-level-premium group">
                  <span>{t.tpAggressive}</span>
                  <div className="target-level-blurred">
                    {t.premiumBlur}
                  </div>
                  <div className="target-level-premium-overlay">
                    <a href="/client/login" className="target-level-unlock-link">
                      <Zap size={12} className="inline mr-1" />
                      {t.unlockPremium}
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. EXECUTION BTN (Visual only) */}
            <div className={`w-full py-4 text-center rounded-xl font-black text-lg uppercase tracking-wider border transition-transform hover:scale-[1.01] ${isBuy ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-rose-600 border-rose-400 text-white'}`}>
              {t.signalStrength}: {data.analysis_accuracy || 80}%
            </div>
          </div>
        </div>

        {/* RISK PANEL */}
        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-gray-500 font-bold text-xs uppercase">
              <ShieldAlert size={14}/> {t.riskCalculator}
            </div>

            <div className="space-y-4">
              <div>
                <span className="block text-gray-500 text-xs">{t.riskRewardRatio}</span>
                <span className="text-2xl font-bold text-gray-900">1 : {activeOrder.rr_ratio || 2}</span>
              </div>
              <div>
                <span className="block text-gray-500 text-xs">{t.pipsAtRisk}</span>
                <span className="text-xl font-bold text-rose-500">-{activeOrder.risk_pips || "Unknown"}</span>
              </div>
              <div>
                <span className="block text-gray-500 text-xs">{t.targetGain}</span>
                <span className="text-xl font-bold text-emerald-500">+{activeOrder.reward_pips || "Unknown"}</span>
              </div>
            </div>
          </div>

          <NotificationButton locale={locale} />
        </div>
      </div>

      {/* ANALYSIS SECTION */}
      <section className="max-w-2xl mx-auto mt-16 px-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">{t.setupAnalysis}</h3>

        <div className="space-y-6">
          {/* Rationale - Clean readable text */}
          <p className="text-gray-900 leading-relaxed">
            {report.rationale || `
              Primary Setup: <strong>${activeOrder.type?.replace('_', ' ')}</strong>.<br />
              Reasoning: ${activeOrder.rationale || "Algorithmic breakout detected"}.<br />
              Market Context: ${orderData?.market_context?.replace('_', ' ') || "Trend Following"}.
            `}
          </p>

          {/* Execution - Premium Card Box */}
          <div className="analysis-execution-card">
            {report.execution || `Place orders at <strong>${formatPriceForSymbol(symbol, activeOrder.entry_price)}</strong> to secure an optimal risk-reward ratio of 1:${activeOrder.rr_ratio || 2}.<br />The calculated invalidation point (Stop Loss) aligns with recent ${isBuy ? 'support' : 'resistance'} structures.`}
          </div>

          {/* Risk Disclaimer */}
          <p className="text-sm text-gray-500 italic">
            {report.risk_manage || `
              Risk Category: <strong>${data.risk_score?.risk_category?.replace(/_/g, ' ') || 'STANDARD'}</strong>.<br />
              Recommended Position Size Multiplier: ${data.risk_score?.position_size_multiplier || '1.0'}x.
            `}
          </p>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <SymbolNavigation symbol={symbol} locale={locale} />

    </div>
  );
}
