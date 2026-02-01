"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

// --- TYPES ---
interface MarketSignal {
  symbol: string;
  action: "BUY" | "SELL";
  current_price: number;
  trend: { trend: string };
  confidence: number;
}

// --- HELPER: HANDLES SCROLL, PAUSE & SUB-PIXEL PRECISION ---
const MobileScrollRow = ({
  children,
  direction = "left",
  speed = 1, // Increased to 1 for stability
}: {
  children: React.ReactNode;
  direction?: "left" | "right";
  speed?: number;
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  const reqRef = useRef<number | null>(null);
  const scrollPos = useRef(0); // NEW: Tracks precise float value

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    // Initialize Position
    const startPos = direction === "right" ? el.scrollWidth / 2 : 0;
    el.scrollLeft = startPos;
    scrollPos.current = startPos;

    const animate = () => {
      if (!el) return;

      if (!isPaused.current) {
        // 1. Detect Manual Swipe: If DOM drifts far from our tracker, user moved it.
        if (Math.abs(el.scrollLeft - scrollPos.current) > 5) {
          scrollPos.current = el.scrollLeft;
        }

        // 2. Move exact amount
        const move = direction === "left" ? speed : -speed;
        scrollPos.current += move;
        el.scrollLeft = scrollPos.current;

        // 3. Infinite Loop Logic
        const halfWidth = el.scrollWidth / 2;
        if (direction === "left" && scrollPos.current >= halfWidth) {
          scrollPos.current = 0;
          el.scrollLeft = 0;
        } else if (direction === "right" && scrollPos.current <= 0) {
          scrollPos.current = halfWidth;
          el.scrollLeft = halfWidth;
        }
      }
      reqRef.current = requestAnimationFrame(animate);
    };

    reqRef.current = requestAnimationFrame(animate);

    return () => {
      if (reqRef.current !== null) cancelAnimationFrame(reqRef.current);
    };
  }, [direction, speed]);

  return (
    <div
      ref={scrollerRef}
      className="manual-scroll-container"
      style={{ maxWidth: "100%", width: "100%" }}
      onMouseEnter={() => (isPaused.current = true)}
      onMouseLeave={() => (isPaused.current = false)}
      onTouchStart={() => (isPaused.current = true)}
      onTouchEnd={() => setTimeout(() => (isPaused.current = false), 1000)}
    >
      <div className="scroll-content">{children}</div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function LiveMarketFeed() {
  const [signals, setSignals] = useState<MarketSignal[]>([]);
  const [loading, setLoading] = useState(true);

  // In your LiveMarketFeed component's useEffect:
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch("/api/livemarketfeed");
      const data = await res.json();
      
      // Get signals from the response object
      setSignals(data?.signals || []);  // ← This is the fix
      
    } catch (err) {
      console.error("Failed to load feed", err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

  const renderCard = (item: MarketSignal, index: number, keyPrefix: string) => {
    const isBuy = item.action === "BUY";
    return (
      <div key={`${keyPrefix}-${item.symbol}-${index}`} className="terminal-slat">
        <div className="slat-timestamp">[{new Date().toLocaleTimeString([], {hour12: false, hour:'2-digit', minute:'2-digit'})}]</div>
        <div className="slat-symbol">{item.symbol}</div>
        <div className={`slat-action ${isBuy ? "up" : "down"}`}>
          {isBuy ? "▲ LONG" : "▼ SHORT"}
        </div>
        <div className="slat-price">{item.current_price.toFixed(2)}</div>
        <div className="slat-conf">
          <span className="gold-text">{item.confidence}%</span>
          <div className="conf-bar-bg"><div className="conf-bar-fill" style={{width: `${item.confidence}%`}}></div></div>
        </div>
        <div className="slat-lock">
          <div className="slat-blur">TARGET_HIDDEN</div>
          <Link href="/client/register" className="slat-unlock">TRADE</Link>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="feed-container">
      <div className="feed-loading"><div className="pulse-bar"></div><p>Calibrating AI Feed...</p></div>
    </div>
  );

  if (signals.length === 0) return null;

  // Split signals for two rows
  const displaySignals = signals.slice(0, 6);
  const row1 = displaySignals.slice(0, 3);
  const row2 = displaySignals.slice(3, 6);

  return (
    <div className="feed-container">
      <div className="feed-header">
        <div className="live-badge"><span className="blink-dot"></span> LIVE FEED</div>
        <h3>Real-time market opportunities detected by MZPrimer AI Trading Expert</h3>
      </div>

      {/* UNIFIED SCROLL VIEW FOR BOTH DESKTOP & MOBILE */}
      <div className="terminal-scroll-view">
        
        {/* Row 1: Loops Left */}
        <MobileScrollRow direction="left" speed={0.8}>
          {[...row1, ...row1, ...row1, ...row1].map((item, index) =>
            renderCard(item, index, "r1")
          )}
        </MobileScrollRow>

        {/* Row 2: Loops Left (Unified Direction) */}
        <MobileScrollRow direction="left" speed={0.8}>
          {[...row2, ...row2, ...row2, ...row2].map((item, index) =>
            renderCard(item, index, "r2")
          )}
        </MobileScrollRow>
      </div>
    </div>
  );
}