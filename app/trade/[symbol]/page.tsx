import { Metadata } from 'next';
import { getSymbolData } from '../../lib/fetchData'; 
import { generateTradeReport } from '../../lib/seo/tradeGenerator';
import NotificationButton from '@/components/NotificationButton';
import SymbolNavigation from '@/components/SymbolNavigation';  
import { Crosshair, ShieldAlert, Coins, TrendingUp, AlertTriangle, ArrowRight, Bot } from 'lucide-react';

// Update Props type to accept Promise
type Props = { 
  params: Promise<{ symbol: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Unwrap the Promise
  const { symbol } = await params;
  
  const data = await getSymbolData(symbol);
  
  if (!data) return { title: `Trade ${symbol} - Analysis` };

  const order = (data as any).pending_orders?.primary_order;
  const action = order?.type.replace('_LIMIT', '').replace('_STOP', '') || "SETUP";
  const sym = data.symbol.toUpperCase();
  const conf = data.risk_score?.confidence_score || 0;

  // TRICK: URGENCY TRIGGERS
  // If High Confidence -> Use "ALERT" or "STRONG"
  let titlePrefix = `Live Trade:`;
  if (conf > 85) titlePrefix = `🚨 STRONG ${action}:`;
  else if (conf > 70) titlePrefix = `${action} Signal:`;

  return {
    // Ex: "🚨 STRONG BUY: BTCUSD - Entry 98000 (92% Win Prob)"
    title: `${titlePrefix} ${sym} @ ${order?.entry_price || 'Market'} | MZprimer AI`,
    description: `Active trading setup for ${sym}. Entry: ${order?.entry_price}. SL: ${order?.sl_price}. Institutional logic based on Trend & Liquidity. Confidence: ${conf}%.`,
    
    // TRICK: CAPTURE INTENT KEYWORDS
    keywords: [
      `${sym} trade signal`, 
      `buy ${sym} now`, 
      `${sym} entry price today`,
      `${sym} trading strategy`
    ]
  };
}

export default async function TradePage({ params }: Props) {
  // Unwrap the Promise
  const { symbol } = await params;
  const resolvedSymbol = symbol;
  const data = await getSymbolData(symbol);

  // Safety Check: Are there orders?
  const orderData = (data as any)?.pending_orders;
  const activeOrder = orderData?.primary_order || orderData?.pending_orders?.[0];

  if (!data || !activeOrder) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center text-zinc-500 font-mono">
        No Active Signals for {symbol}. Check back later.
      </div>
    );
  }

  const report = generateTradeReport(data);
  const action = activeOrder.type.includes('BUY') ? 'BUY' : 'SELL';
  const isBuy = action === 'BUY';
  const colorClass = isBuy ? 'text-emerald-400 border-emerald-500 bg-emerald-900/10' : 'text-rose-400 border-rose-500 bg-rose-900/10';
  const bgGradient = isBuy ? 'from-emerald-950 to-black' : 'from-rose-950 to-black';
  
  // Setup data for TP levels
  const setup = {
    tp1: activeOrder.tp_price,
  };

  return (
    <div className={`min-h-screen bg-black text-white pb-24 font-sans selection:${isBuy ? 'bg-emerald-500/30' : 'bg-rose-500/30'}`}>
      
      {/* HEADER SECTION */}
      <div className={`pt-32 pb-16 px-6 text-center border-b border-white/5 bg-gradient-to-b ${bgGradient}`}>
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border text-[10px] uppercase font-bold tracking-widest ${colorClass}`}>
          {isBuy ? <TrendingUp size={12}/> : <TrendingUp size={12} className="rotate-180"/>} 
          Active Signal Found
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-4 uppercase tracking-tighter text-white">
          {action} <span className="text-zinc-500">{data.symbol}</span>
        </h1>
        
        <p className="text-zinc-400 font-mono text-xl max-w-xl mx-auto">
          Entry @ {activeOrder.entry_price}
        </p>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 grid md:grid-cols-3 gap-6">
        
        {/* TICKET CARD (Visual Focus) */}
        <div className="md:col-span-2 p-8 rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl relative overflow-hidden">
          {/* Background Texture */}
          <div className="absolute top-0 right-0 p-32 opacity-10 blur-3xl rounded-full bg-white mix-blend-overlay"></div>

          <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-800">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Order Ticket</span>
            <span className="text-xs font-mono text-white bg-zinc-800 px-2 py-1 rounded">ID: {symbol.toUpperCase()}-AI</span>
          </div>

          <div className="space-y-6">
            
            {/* 1. ENTRY */}
            <div className="flex justify-between items-end">
              <div className="text-sm text-zinc-400 uppercase font-bold">Entry Price</div>
              <div className="text-3xl font-mono font-bold text-white">{activeOrder.entry_price}</div>
            </div>

            {/* 2. TP / SL */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-emerald-900/50">
                <span className="block text-emerald-500 text-xs font-bold mb-1">TAKE PROFIT</span>
                <span className="block text-xl font-mono text-white">{activeOrder.tp_price}</span>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-rose-900/50">
                <span className="block text-rose-500 text-xs font-bold mb-1">STOP LOSS</span>
                <span className="block text-xl font-mono text-white">{activeOrder.sl_price}</span>
              </div>
            </div>

            {/* 3. TP DETAILS */}
            <section className="target-levels-container">
              <h4 className="target-levels-title">Target Levels</h4>
              <div className="space-y-2">
                {/* Free TP 1 */}
                <div className="target-level-free">
                  <span>TP 1 (Safe)</span>
                  <span className="target-level-free-value">{setup.tp1}</span>
                </div>

                {/* Blurred Premium Targets */}
                <div className="target-level-premium group">
                  <span>TP 2 (Swing)</span>
                  <div className="target-level-blurred">
                    {Number(setup.tp1) * 1.05} {/* Fake blurred number */}
                  </div>
                  
                  {/* Hover Reveal Overlay */}
                  <div className="target-level-premium-overlay">
                    <a href="/client/login" className="target-level-unlock-link">
                      UNLOCK PREMIUM
                    </a>
                  </div>
                </div>

                {/* Additional Premium TP */}
                <div className="target-level-premium group">
                  <span>TP 3 (Aggressive)</span>
                  <div className="target-level-blurred">
                    {Number(setup.tp1) * 1.1} {/* Fake blurred number */}
                  </div>
                  
                  {/* Hover Reveal Overlay */}
                  <div className="target-level-premium-overlay">
                    <a href="/client/login" className="target-level-unlock-link">
                      UNLOCK PREMIUM
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. EXECUTION BTN (Visual only) */}
            <div className={`w-full py-4 text-center rounded-xl font-black text-lg uppercase tracking-wider border transition-transform hover:scale-[1.01] ${isBuy ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-rose-600 border-rose-400 text-white'}`}>
              Signal Strength: {(data as any).analysis_accuracy || 80}%
            </div>
          </div>
        </div>

        {/* RISK PANEL */}
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-zinc-400 font-bold text-xs uppercase">
              <ShieldAlert size={14}/> Risk Calculator
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="block text-zinc-500 text-xs">Risk / Reward Ratio</span>
                <span className="text-2xl font-bold text-white">1 : {activeOrder.rr_ratio || 2}</span>
              </div>
              <div>
                <span className="block text-zinc-500 text-xs">Pips at Risk</span>
                <span className="text-xl font-bold text-rose-400">-{activeOrder.risk_pips || "Unknown"}</span>
              </div>
              <div>
                <span className="block text-zinc-500 text-xs">Target Gain</span>
                <span className="text-xl font-bold text-emerald-400">+{activeOrder.reward_pips || "Unknown"}</span>
              </div>
            </div>
          </div>

          
        </div>
      </div>

      {/* ANALYSIS SECTION - FIXED */}
<section className="max-w-2xl mx-auto mt-16 px-6">
  {/* Heading */}
  <h3 className="text-xl font-bold text-white mb-6">Setup Analysis</h3>
  
  <div className="space-y-6">
    {/* Rationale - Clean readable text */}
    <p className="text-white leading-relaxed">
      {report.rationale}
    </p>
    
    {/* Execution - Premium Card Box */}
    <div className="analysis-execution-card">
      {report.execution}
    </div>
    
    {/* Risk Disclaimer */}
    <p className="text-sm text-zinc-400 italic">
      Risk Management: {report.risk_manage}
    </p>
  </div>
</section>

      {/* FOOTER SECTION */}
      <SymbolNavigation symbol={resolvedSymbol} />
    </div>
  );
}