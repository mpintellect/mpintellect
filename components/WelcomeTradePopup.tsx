'use client';

import { useState, useEffect } from 'react';
import { usePush } from '@/app/hooks/usePush';
import { X, TrendingUp, Bot, Zap, Activity, Share, PlusSquare, ArrowUp } from 'lucide-react'; 

// --- CONFIGURATION ---
const CACHE_KEY = 'mz_popup_market_data';
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 Minutes Client Buffer
const API_URL = '/api/livemarketfeed';   // Your Edge API

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
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [bestTrade, setBestTrade] = useState<TradeSignal | null>(null);
  const [mounted, setMounted] = useState(false);

  // --- HELPER: Detect iOS Browser vs App ---
  // Returns TRUE if user is on iPhone/iPad Safari/Chrome but NOT "Installed" yet.
  const isIOSBrowser = () => {
    if (typeof window === 'undefined') return false;
    const ua = window.navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/.test(ua);
    // display-mode: standalone means "Added to Home Screen" (App Mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    return isIOS && !isStandalone;
  };

  // --- HELPER: Format Time ---
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

  // --- HELPER: Format Trend String ---
  function formatTrend(trendRaw: string) {
    if (!trendRaw) return 'Neutral';
    return trendRaw.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  useEffect(() => {
    setMounted(true);
    
    // 1. If already subscribed, never show.
    if (subscription) return;

    const loadData = async () => {
      let activeSignal: TradeSignal | null = null;

      // 2. Check Local Storage Cache
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

      // 3. Fetch from API
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
      
      // 4. Set State if Data Exists
      if (activeSignal) {
          setBestTrade(activeSignal);
          startTimer();
      }
    };

    loadData();
  }, [subscription]);

  const startTimer = () => {
      // Show after 6 seconds
      const timer = setTimeout(() => setIsVisible(true), 6000); 
      return () => clearTimeout(timer);
  };

  const getBestSignal = (data: MarketIntelligenceResponse) => {
      if (!data.signals || data.signals.length === 0) return null;
      return data.signals.sort((a, b) => b.confidence - a.confidence)[0];
  }

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('tradePopupClosed', 'true'); 
  };

  const handleSubscribe = async () => {
    // A. IPHONE BROWSER DETECTION
    // If iPhone User NOT in App Mode, don't try to subscribe (it will fail).
    // Show them instructions instead.
    if (isIOSBrowser()) {
        setShowIOSPrompt(true);
        return; 
    }

    // B. STANDARD USER (Desktop, Android, or Installed iOS)
    // 1. Scroll to AI Tool
    const el = document.getElementById("aiassistant");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });

    // 2. Trigger Push Logic (Register User)
    await subscribeToPush();
    
    // 3. Close Popup
    setIsVisible(false);
  };

  // --- SAFE RENDER GUARD ---
  if (!mounted) return null;

  // --- VIEW 1: IOS INSTRUCTIONS (Overlay on card) ---
  if (showIOSPrompt && isVisible) {
      return (
        <div className="popup-container">
            {/* Specific Styles for instruction card to stand out */}
            <div className="popup-card" style={{ borderColor: '#ca8a04' }}>
                
                <div className="popup-header">
                    <div className="popup-header-title">
                        <span className="text-yellow-500 flex items-center gap-2">
                            <Share size={14} /> INSTALLATION REQUIRED
                        </span>
                    </div>
                    <button onClick={() => setShowIOSPrompt(false)} className="btn-popup-close">
                        <X size={16}/>
                    </button>
                </div>
                
                <div className="popup-body" style={{ textAlign: 'center', color: '#d4d4d8' }}>
                    <p className="text-sm leading-relaxed mb-4">
                        To receive <strong>Real-time AI Signals</strong> on iPhone, Apple requires you to enable App Mode.
                    </p>

                    <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', textAlign: 'left', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div className="flex items-center gap-3 text-xs mb-3">
                            <Share size={18} className="text-blue-500" /> 
                            <span>1. Tap the <strong>Share</strong> button below</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                            <PlusSquare size={18} className="text-zinc-400" />
                            <span>2. Scroll & Tap <strong>Add to Home Screen</strong></span>
                        </div>
                    </div>

                    <p className="text-[10px] text-zinc-500 mt-4">
                        Open the App from your home screen to start receiving alerts.
                    </p>
                </div>

                {/* Animation Pointer */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <ArrowUp size={24} className="rotate-180 text-yellow-500 drop-shadow-md" />
                </div>
            </div>
        </div>
      );
  }

  // --- VIEW 2: STANDARD TRADE SIGNAL POPUP ---
  // Check basic conditions before rendering
  if (!isVisible || subscription || !bestTrade) return null;

  return (
    <div className="popup-container">
      <div className="popup-card">
        
        {/* PREMIUM HEADER (Pulse Dot + Clean Look) */}
        <div className="popup-header">
          <div className="popup-header-title">
            <span className="live-dot" /> 
            <span className="text-zinc-400">AI SIGNAL</span>
            <span className="w-px h-3 bg-white/10 mx-2"></span> 
            <span className="text-yellow-500 font-bold">LIVE</span>
          </div>

          <div className="flex items-center gap-3">
             <span className="header-time-text">
               {getTimeAgo(bestTrade.timestamp)}
             </span>
             <button onClick={handleClose} className="btn-popup-close">
                <X size={14} />
             </button>
          </div>
        </div>

        {/* BODY CONTENT */}
        <div className="popup-body">
            
            {/* TOP ROW: Symbol & Action Badge */}
            <div className="popup-symbol-row">
                <h3 className="popup-symbol flex items-center gap-2">
                    {bestTrade.symbol}
                    {bestTrade.action === 'BUY' ? (
                        <TrendingUp size={20} className="text-emerald-400 drop-shadow-md" />
                    ) : (
                        <TrendingUp size={20} className="text-red-400 rotate-180 transform drop-shadow-md" />
                    )}
                </h3>
                
                {/* Applies Global Animation Class */}
                <span className={`popup-badge ${bestTrade.action === 'BUY' ? 'popup-badge-buy' : 'popup-badge-sell'}`}>
                   {bestTrade.action}
                </span>
            </div>
            
            {/* DATA GRID: Price & Trend | Confidence */}
            <div className="grid grid-cols-2 gap-3 mb-4 mt-2">
                {/* Left: Price */}
                <div className="space-y-2">
                    <div>
                        <p className="popup-label">Entry Zone</p>
                        {/* Applies Digital Glow Class */}
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
                
                {/* Right: Confidence with Gold Effect */}
                <div className="text-right flex flex-col justify-center bg-slate-800/40 rounded p-2 border border-white/5 shadow-inner">
                    <p className="popup-label flex justify-end items-center gap-1 text-yellow-500 font-bold mb-1">
                        <Zap size={14} fill="currentColor" /> AI Confidence
                    </p>
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