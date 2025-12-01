import Link from 'next/link';
import { ArrowRight, Zap, Globe, BarChart2, Activity } from 'lucide-react';

export const metadata = {
  title: 'Global Markets | Real-Time AI Analysis',
  description: 'Select a market to view live technical analysis, AI forecasts, and volatility reports.',
};

// --- DATA SOURCE (Your Exact List) ---
const SYMBOL_NAMES: Record<string, string> = {
  // Forex Majors
  "EURUSD": "Euro / US Dollar",
  "GBPUSD": "British Pound / US Dollar",
  "USDJPY": "US Dollar / Japanese Yen",
  "USDCAD": "US Dollar / Canadian Dollar",
  "AUDUSD": "Australian Dollar / US Dollar",
  "NZDUSD": "New Zealand Dollar / US Dollar",
  "USDCHF": "US Dollar / Swiss Franc",
  
  // Forex Crosses
  "EURJPY": "Euro / Japanese Yen",
  "EURGBP": "Euro / British Pound",
  "GBPJPY": "British Pound / Japanese Yen",
  "GBPCHF": "British Pound / Swiss Franc",

  // Commodities
  "XAUUSD": "Gold / US Dollar",
  "XAUEUR": "Gold / Euro",
  "XAGUSD": "Silver / US Dollar",
  "PLATINUM": "Platinum / US Dollar",
  "BRENT": "US Crude Oil",

  // Crypto
  "BTCUSD": "Bitcoin / US Dollar",
  "ETHUSD": "Ethereum / US Dollar",
  "XRPUSD": "Ripple / US Dollar",
  "DOGEUSD": "Dogecoin / US Dollar",
  "LTCUSD": "Litecoin / US Dollar",

  // Indices
  "US500": "S&P 500 Index (US)",
  "USTEC": "NASDAQ 100 Index (US)",
  "US30": "Dow Jones 30 Index",
  "HK50": "Hong Kong 50 Index",
  "FRANCE40": "CAC 40 Index (France)",
  "DE40": "DAX 40 Index (Germany)",
  "UK100": "FTSE 100 Index (UK)",
};

// Organize them into Categories for display
const CATEGORIES = {
  CRYPTO: ['BTCUSD', 'ETHUSD', 'XRPUSD', 'SOLUSD', 'DOGEUSD', 'LTCUSD'],
  FOREX_MAJORS: ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCAD', 'AUDUSD', 'USDCHF'],
  CROSSES_METALS: ['EURJPY', 'GBPJPY', 'XAUUSD', 'XAUEUR', 'BRENT', 'PLATINUM'],
  INDICES: ['US30', 'US500', 'USTEC', 'DE40', 'UK100', 'HK50']
};

export default function MarketsHub() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-24 px-6">
      
      {/* 1. HERO TITLE */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <span className="text-yellow-500 font-bold uppercase tracking-[0.2em] text-xs mb-4 block">Institutional Intelligence</span>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
          Live Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Command Center</span>
        </h1>
        <p className="text-zinc-400 text-lg">
          Select an asset below to initialize AI-Trend algorithms and view live trade setups.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* --- GROUP 1: CRYPTO --- */}
        <div>
            <div className="category-header-pill text-blue-400 border-blue-500/30">
                <Zap size={16} />CRYPTO ASSETS
            </div>
            <div className="space-y-3">
                {CATEGORIES.CRYPTO.map(sym => (
                    <AssetButton key={sym} ticker={sym} name={SYMBOL_NAMES[sym]} />
                ))}
            </div>
        </div>

        {/* --- GROUP 2: FOREX MAJORS --- */}
        <div>
            <div className="category-header-pill text-green-400 border-green-500/30">
                <Globe size={16} />FX MAJORS
            </div>
            <div className="space-y-3">
                {CATEGORIES.FOREX_MAJORS.map(sym => (
                    <AssetButton key={sym} ticker={sym} name={SYMBOL_NAMES[sym]} />
                ))}
            </div>
        </div>

        {/* --- GROUP 3: METALS & CROSSES --- */}
        <div>
            <div className="category-header-pill text-orange-400 border-orange-500/30">
                <Activity size={16} />COMMODITIES & CROSS
            </div>
            <div className="space-y-3">
                {CATEGORIES.CROSSES_METALS.map(sym => (
                    <AssetButton key={sym} ticker={sym} name={SYMBOL_NAMES[sym]} />
                ))}
            </div>
        </div>

        {/* --- GROUP 4: INDICES --- */}
        <div>
            <div className="category-header-pill text-purple-400 border-purple-500/30">
                <BarChart2 size={16} /> GLOBAL INDICES
            </div>
            <div className="space-y-3">
                {CATEGORIES.INDICES.map(sym => (
                    <AssetButton key={sym} ticker={sym} name={SYMBOL_NAMES[sym]} />
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}

// Sub Component for Cleaner Code
function AssetButton({ ticker, name }: { ticker: string, name?: string }) {
    if(!name) return null; // Safety if sym not in list
    
    return (
        <Link href={`/analysis/${ticker.toLowerCase()}`} className="market-asset-card group">
            <div>
                <span className="asset-ticker group-hover:text-white transition-colors">{ticker}</span>
                <span className="asset-name">{name}</span>
            </div>
            <ArrowRight size={16} className="text-zinc-600 group-hover:text-yellow-500 transform group-hover:translate-x-1 transition-all" />
        </Link>
    )
}