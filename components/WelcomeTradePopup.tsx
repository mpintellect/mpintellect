'use client';

import { useState, useEffect } from 'react';
import { usePush } from '@/app/hooks/usePush';
import { X, TrendingUp, Bot, Zap, Activity } from 'lucide-react'; 

// --- CONFIGURATION ---
const CACHE_KEY = 'mz_popup_market_data';
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 Minutes Buffer
const API_URL = '/api/livemarketfeed';   // Edge API

// --- INTERFACES ---
interface TrendInfo {
  trend: string; 
}

interface TradeSignal {
  symbol: string;      
  action: string;      
  entry: number;
  tp: number;
  sl: number;
  trend: TrendInfo;
  confidence: number;  
  timestamp: string;  
}

interface MarketIntelligenceResponse {
  generated_at: string;
  signals: TradeSignal[];
}

export default function WelcomeTradePopup() {
  const { subscription, subscribeToPush, loading } = usePush();
  const [isVisible, setIsVisible] = useState(false);
  const [bestTrade, setBestTrade] = useState<TradeSignal | null>(null);
  const [mounted, setMounted] = useState(false);

  // HELPER: Format Time (e.g., "5m ago")
  function getTimeAgo(dateString: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    if (date > now) return 'Just now'; 
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return '1d ago';
  }

  // HELPER: Format Trend (weak_neutral -> Weak Neutral)
  function formatTrend(trendRaw: string) {
    if (!trendRaw) return 'Neutral';
    return trendRaw.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  useEffect(() => {
    setMounted(true);
    // 1. If Subscribed, stop completely.
    if (subscription) return;

    const loadData = async () => {
      let activeSignal: TradeSignal | null = null;

      // 2. CHECK LOCAL STORAGE CACHE (0ms latency)
      const cached = localStorage.getItem(CACHE_KEY);
      const now = Date.now();

      if (cached) {
        try {
            const { data, timestamp } = JSON.parse(cached);
            const age = now - timestamp;
            if (age < CACHE_DURATION_MS) {
                activeSignal = getBestSignal(data);
                if (activeSignal) {
                    setBestTrade(activeSignal);
                    startTimer();
                    return; 
                }
            }
        } catch (e) {
            localStorage.removeItem(CACHE_KEY);
        }
      }

      // 3. FETCH EDGE API (Fast CDN)
      try {
          const res = await fetch(API_URL);
          if (!res.ok) throw new Error('API Failed');
          const rawData: MarketIntelligenceResponse = await res.json();

          localStorage.setItem(CACHE_KEY, JSON.stringify({
              timestamp: Date.now(),
              data: rawData
          }));

          activeSignal = getBestSignal(rawData);

      } catch (error) {
          console.error("POPUP: Data Fetch Error", error);
      }
      
      // 4. INIT TIMER
      if (activeSignal) {
          setBestTrade(activeSignal);
          startTimer();
      }
    };

    loadData();
  }, [subscription]);

  const startTimer = () => {
      const timer = setTimeout(() => setIsVisible(true), 6000); // 6 Sec delay
      return () => clearTimeout(timer);
  };

  const getBestSignal = (data: MarketIntelligenceResponse) => {
      if (!data.signals || data.signals.length === 0) return null;
      // Sort Confidence Descending
      return data.signals.sort((a, b) => b.confidence - a.confidence)[0];
  }

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('tradePopupClosed', 'true'); 
  };

  const handleSubscribe = async () => {
    // 1. SCROLL to AI section instantly (UX)
    const el = document.getElementById("aiassistant");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // 2. TRIGGER Subscribe logic (Auth -> Key -> Register)
    await subscribeToPush();
    // 3. Close UI
    setIsVisible(false);
  };

  // Safe Render Logic
  if (!mounted || !isVisible || subscription || !bestTrade) return null;

  return (
    // Uses Global Classes: .popup-container, .popup-card
    <div className="popup-container">
      <div className="popup-card">
        
      {/* HEADER */}
        <div className="popup-header">
          
          {/* Left Side: Pulse Dot + Title */}
          <div className="popup-header-title">
            <span className="live-dot" /> {/* The Pulsing Dot */}
            <span className="text-zinc-400">AI SIGNAL</span>
            {/* Tiny vertical divider */}
            <span className="w-px h-3 bg-white/10 mx-1"></span> 
            <span className="text-yellow-500 font-bold">LIVE</span>
          </div>

          {/* Right Side: Subtle Time + Ghost Close Button */}
          <div className="flex items-center gap-3">
             <span className="header-time-text">
               {getTimeAgo(bestTrade.timestamp)}
             </span>
             
             <button onClick={handleClose} className="btn-popup-close">
                <X size={14} />
             </button>
          </div>
          
        </div>

        {/* BODY */}
        <div className="popup-body">
            
            {/* ROW 1: Symbol + Badge (Animated via .popup-badge-buy/sell classes) */}
            <div className="popup-symbol-row">
                <h3 className="popup-symbol flex items-center gap-2">
                    {bestTrade.symbol}
                    {bestTrade.action === 'BUY' ? (
                        <TrendingUp size={20} className="text-emerald-400 drop-shadow-md" />
                    ) : (
                        <TrendingUp size={20} className="text-red-400 rotate-180 transform drop-shadow-md" />
                    )}
                </h3>
                
                {/* Dynamically applying Pulse Animation Class */}
                <span className={`popup-badge ${bestTrade.action === 'BUY' ? 'popup-badge-buy' : 'popup-badge-sell'}`}>
                   {bestTrade.action}
                </span>
            </div>
            
            {/* ROW 2: Data Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4 mt-2">
                <div className="space-y-2">
                    <div>
                        <p className="popup-label">Entry Zone</p>
                        
                        {/* ANIMATED PRICE (Digital Glow Class) */}
                        <p className="effect-price-glow inline-block">
                            {bestTrade.entry > 10 
                             ? bestTrade.entry.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 }) 
                             : bestTrade.entry.toLocaleString(undefined, { maximumFractionDigits: 5 })
                            }
                        </p>
                    </div>
                    <div>
                        <p className="popup-label flex items-center gap-1">
                            <Activity size={10} /> Market Trend
                        </p>
                        <p className="text-xs font-bold text-white/80 capitalize border-l-2 border-white/20 pl-2">
                            {formatTrend(bestTrade.trend?.trend)}
                        </p>
                    </div>
                </div>
                
                {/* Right: Confidence (Liquid Gold Animation) */}
                <div className="text-right flex flex-col justify-center bg-slate-800/40 rounded p-2 border border-white/5 shadow-inner">
                    <p className="popup-label flex justify-end items-center gap-1 text-yellow-500 font-bold mb-1">
                        <Zap size={14} fill="currentColor" /> AI Confidence
                    </p>
                    {/* ANIMATED SCORE */}
                    <p className="effect-confidence-score">
                       {bestTrade.confidence}%
                    </p>
                </div>
            </div>

            {/* ACTION BUTTON */}
            <button 
                onClick={handleSubscribe}
                disabled={loading}
                className="btn-popup-cta bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
            >
                {loading ? 'Connecting AI...' : (
                    <>
                        <Bot size={18} />
                        <span>Get AI Trades</span>
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
}