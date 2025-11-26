'use client';

import { useState, useEffect } from 'react';
import { usePush } from '@/app/hooks/usePush';
// Removed Wallet, Added ArrowUpRight for Chrome pointer
import { 
  X, TrendingUp, Bot, Zap, Activity, 
  Share, PlusSquare, ArrowDown, ArrowUpRight, 
  Smartphone, BellRing, MessageCircle 
} from 'lucide-react'; 

// --- LINKS ---
const TELEGRAM_LINK = "https://t.me/mzprimer"; 

// CONFIG
const CACHE_KEY = 'mz_popup_market_data';
const CACHE_DURATION_MS = 5 * 60 * 1000; 
const API_URL = '/api/livemarketfeed';   

// INTERFACES
interface TrendInfo { trend: string; }
interface TradeSignal { symbol: string; action: string; entry: number; tp: number; sl: number; trend: TrendInfo; confidence: number; timestamp: string; }
interface MarketIntelligenceResponse { generated_at: string; signals: TradeSignal[]; }

export default function WelcomeTradePopup() {
  const { subscription, subscribeToPush, loading } = usePush();
  
  // STATE
  const [isVisible, setIsVisible] = useState(false);
  const [showIOSMenu, setShowIOSMenu] = useState(false);
  const [bestTrade, setBestTrade] = useState<TradeSignal | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isAppMode, setIsAppMode] = useState(false);
  
  // 'safari' (bottom) or 'chrome' (top right)
  const [iosBrowserType, setIosBrowserType] = useState<'safari' | 'chrome'>('safari');

  // --- HELPERS ---
  const getMobileOS = () => {
    if (typeof window === 'undefined') return 'unknown';
    const ua = navigator.userAgent || navigator.vendor;
    if (/android/i.test(ua)) return 'android';
    if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) return 'ios';
    return 'desktop';
  };

  const checkPWA = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches;
  }

  function getTimeAgo(dateString: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    if (date > now) return 'Just now'; 
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    const min = Math.floor(diff / 60);
    if (min < 60) return `${min}m ago`;
    return '1d ago';
  }

  function formatTrend(trendRaw: string) {
    if (!trendRaw) return 'Neutral';
    return trendRaw.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  // --- LOAD LOGIC ---
  useEffect(() => {
    setMounted(true);
    if (subscription) return;

    const inApp = checkPWA();
    setIsAppMode(inApp);

    // DETECT IOS BROWSER TYPE (Chrome vs Safari)
    if (typeof window !== 'undefined') {
        const ua = navigator.userAgent;
        if (ua.match('CriOS')) {
            setIosBrowserType('chrome'); // Chrome on iOS
        } else {
            setIosBrowserType('safari'); // Safari
        }
    }

    const loadData = async () => {
      let activeSignal: TradeSignal | null = null;
      const cached = localStorage.getItem(CACHE_KEY);
      
      // Cache Logic
      if (cached) {
        try {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION_MS) {
                activeSignal = getBestSignal(data);
            }
        } catch (e) { localStorage.removeItem(CACHE_KEY); }
      }

      // Network Logic
      if (!activeSignal) {
        try {
            const res = await fetch(API_URL);
            if (res.ok) {
                const rawData = await res.json();
                localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: rawData }));
                activeSignal = getBestSignal(rawData);
            }
        } catch (error) { console.error(error); }
      }
      
      if (activeSignal) {
          setBestTrade(activeSignal);
          const delay = inApp ? 50 : 6000; 
          setTimeout(() => setIsVisible(true), delay);
      }
    };

    loadData();
  }, [subscription]);

  const getBestSignal = (data: MarketIntelligenceResponse) => {
      if (!data.signals || data.signals.length === 0) return null;
      return data.signals.sort((a, b) => b.confidence - a.confidence)[0];
  }

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('tradePopupClosed', 'true'); 
  };

  // --- MAIN ACTION HANDLER ---
  const handleMainClick = async () => {
    const os = getMobileOS();
    const isInstalled = checkPWA();

    // 1. IOS BROWSER -> OPEN MENU OVERLAY
    if (os === 'ios' && !isInstalled) {
        setShowIOSMenu(true);
        return;
    }

    // 2. OTHERS (Android/Desktop/PWA) -> PUSH SUBSCRIBE
    const el = document.getElementById("aiassistant");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    
    await subscribeToPush();
    setIsVisible(false);
  };

  // RENDER SAFEGUARD
  if (!mounted || !isVisible || subscription || !bestTrade) return null;

  // ===============================================================
  // 1. THE IOS "CHOICE MENU" (Native Guide + Telegram)
  // ===============================================================
  if (showIOSMenu) {
      return (
        <div 
            className="ios-guide-overlay"
            onClick={() => setShowIOSMenu(false)}
        >
            {/* THE CHOICE CARD (Middle) */}
            <div 
                className="ios-guide-card" 
                onClick={e => e.stopPropagation()}
            >
                {/* CLOSE */}
                <button onClick={() => setShowIOSMenu(false)} className="absolute top-4 right-4 text-zinc-600 p-1 hover:text-white">
                    <X size={18} />
                </button>

                <div className="p-6">
                    <div className="text-center mb-5">
                        <h3 className="text-white font-bold text-xl mb-1">Choose Alert Method</h3>
                        <p className="text-zinc-500 text-xs uppercase tracking-wide font-semibold">
                            {iosBrowserType === 'chrome' ? 'Chrome detected' : 'Instant AI Signals'}
                        </p>
                    </div>

                    <div className="space-y-4">
                        
                        {/* OPTION 1: WEB APP (Native) */}
                        <div className="ios-pwa-box">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase">Option A: Native Web App</span>
                            </div>
                            <div className="ios-step-row">
                                <div className="ios-icon-circle text-blue-500"><Share size={14}/></div>
                                <span>Tap <strong>Share</strong> {iosBrowserType === 'chrome' ? '(Top Right)' : 'in toolbar'}</span>
                            </div>
                            <div className="ios-step-row">
                                <div className="ios-icon-circle text-zinc-400"><PlusSquare size={14}/></div>
                                <span>Tap <strong>Add to Home Screen</strong></span>
                            </div>
                        </div>

                        {/* DIVIDER */}
                        <div className="relative flex items-center opacity-50">
                            <div className="flex-grow border-t border-zinc-800"></div>
                            <span className="flex-shrink mx-2 text-[9px] text-zinc-600 uppercase font-bold">Fast Alternative</span>
                            <div className="flex-grow border-t border-zinc-800"></div>
                        </div>

                        {/* OPTION 2: TELEGRAM */}
                        <a href={TELEGRAM_LINK} target="_blank" className="btn-telegram">
                            <MessageCircle size={18} /> Join Telegram Channel
                        </a>

                    </div>
                </div>
            </div>

            {/* SMART POINTER (Context Aware) */}
            {iosBrowserType === 'chrome' ? (
                // CHROME: Points Top Right
                <div className="ios-pointer-container ios-pos-chrome" onClick={e => e.stopPropagation()}>
                    <ArrowUpRight size={48} className="arrow-animated mb-2 text-yellow-500" />
                    <div className="arrow-label-capsule">Tap Share Button</div>
                </div>
            ) : (
                // SAFARI: Points Bottom Right
                <div className="ios-pointer-container ios-pos-safari" onClick={e => e.stopPropagation()}>
                    <div className="arrow-label-capsule">Browser Menu</div>
                    <ArrowDown size={48} className="arrow-animated mt-1 text-yellow-500" />
                </div>
            )}

        </div>
      );
  }

  // ===============================================================
  // 2. STANDARD POPUP (Desktop / Android / PWA)
  // ===============================================================
  return (
    <div className="popup-container">
      <div className={`popup-card ${isAppMode ? 'ring-2 ring-green-500/50' : ''}`}>
        
        {/* HEADER */}
        <div className="popup-header">
          <div className="popup-header-title">
            {isAppMode ? (
               <span className="text-green-400 flex items-center gap-2 font-bold animate-pulse">
                  <BellRing size={16} /> TAP TO ACTIVATE
               </span>
            ) : (
               <>
                 <span className="live-dot" /> <span className="text-zinc-400">AI TRADING SIGNAL</span>
                 <span className="w-px h-3 bg-white/10 mx-2"></span> <span className="text-yellow-500 font-bold">LIVE</span>
               </>
            )}
          </div>
          <div className="flex items-center gap-3">
             <span className="header-time-text">{getTimeAgo(bestTrade.timestamp)}</span>
             <button onClick={handleClose} className="btn-popup-close"><X size={14} /></button>
          </div>
        </div>

        {/* BODY */}
        <div className="popup-body">
            {/* SYMBOL */}
            <div className="popup-symbol-row">
                <h3 className="popup-symbol flex items-center gap-2">
                    {bestTrade.symbol}
                    {bestTrade.action === 'BUY' ? <TrendingUp size={20} className="text-emerald-400 drop-shadow-md"/> : <TrendingUp size={20} className="text-red-400 rotate-180 drop-shadow-md"/>}
                </h3>
                <span className={`popup-badge ${bestTrade.action === 'BUY' ? 'popup-badge-buy' : 'popup-badge-sell'}`}>
                   {bestTrade.action}
                </span>
            </div>
            
            {/* STATS */}
            <div className="grid grid-cols-2 gap-3 mb-4 mt-2">
                <div className="space-y-2">
                    <div>
                        <p className="popup-label">Entry</p>
                        <p className="effect-price-glow inline-block">
                            {bestTrade.entry.toLocaleString(undefined, { maximumFractionDigits: 5 })}
                        </p>
                    </div>
                    <div>
                        {/* FIX: Activity used here */}
                        <p className="popup-label">
                            <Activity size={10} /> Trend
                        </p>
                        <p className="text-xs font-bold text-white/80 capitalize">{formatTrend(bestTrade.trend?.trend)}</p>
                    </div>
                </div>
                
                <div className="text-right flex flex-col justify-center bg-slate-800/40 rounded p-2 border border-white/5 shadow-inner">
                    <p className="popup-label flex justify-end items-center gap-1 text-yellow-500 font-bold">
                        <Zap size={14} fill="currentColor" /> Confidence
                    </p>
                    <p className="effect-confidence-score">{bestTrade.confidence}%</p>
                </div>
            </div>

            {/* PRIMARY CTA (Push) */}
            <button 
                onClick={handleMainClick}
                disabled={loading}
                className={`btn-popup-cta ${isAppMode ? '!bg-green-600 hover:!bg-green-500' : ''}`}
            >
                {loading ? 'Loading...' : (
                    <>
                        {isAppMode ? <BellRing size={18} /> : <Bot size={18} />}
                        <span>{isAppMode ? 'Final Step: Enable Alerts' : 'Get AI Trades'}</span>
                    </>
                )}
            </button>

            {/* SECONDARY CTA (Telegram Link for Non-PWA users) */}
            {!isAppMode && (
                <a 
                    href={TELEGRAM_LINK} 
                    target="_blank" 
                    className="block text-center mt-3 text-[10px] text-zinc-500 hover:text-blue-400 transition"
                >
                    Or join <span className="underline">Telegram Channel</span>
                </a>
            )}

        </div>
      </div>
    </div>
  );
}