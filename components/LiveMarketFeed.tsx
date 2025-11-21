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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/livemarketfeed");
        const data = await res.json();
        setSignals(data?.signals || []);
      } catch (err) {
        console.error("Failed to load feed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Render Card Helper
  const renderCard = (item: MarketSignal, index: number, keyPrefix: string) => {
    const isBuy = item.action === "BUY";
    return (
      <div
        key={`${keyPrefix}-${item.symbol}-${index}`}
        className={`feed-card ${isBuy ? "buy-trend" : "sell-trend"}`}
      >
        <div className="card-row-top">
          <div className="symbol-group">
            <span className="symbol-text">{item.symbol}</span>
            <span className="price-text">{item.current_price}</span>
          </div>
          <div className={`mini-badge ${isBuy ? "green" : "red"}`}>
            {item.action}
          </div>
        </div>
        <div className={`card-stats-grid ${isBuy ? "buy-trend" : "sell-trend"}`}>
          <div className="stat-item">
            <span className="stat-label">Trend</span>
            <span className="stat-value gold">
              {item.trend.trend.replace(/_/g, " ").toUpperCase()}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Confidence</span>
            <span className="stat-value">{item.confidence}%</span>
          </div>
        </div>
        <div className="locked-data">
          <div className="blur-line w-3/4"></div>
          <div className="blur-line w-1/2"></div>
          <div className="lock-overlay">
            <Link href="/client/register" className="unlock-link">
              🔓 Unlock
            </Link>
          </div>
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <div className="feed-container">
        <div className="feed-loading">
          <div className="pulse-bar"></div>
          <p>Calibrating AI Feed...</p>
        </div>
      </div>
    );

  if (signals.length === 0) return null;

  const displaySignals = signals.slice(0, 6);
  const row1 = displaySignals.slice(0, 3);
  const row2 = displaySignals.slice(3, 6);

  return (
    <div className="feed-container">
      <div className="feed-header">
        <div className="live-badge">
          <span className="blink-dot"></span> LIVE FEED
        </div>
        <h3>Real-time market opportunities detected by MZPrimer AI Trading Expert</h3>
      </div>

      {/* DESKTOP GRID (Static) */}
      <div className="feed-grid desktop-grid-view">
        {displaySignals.map((item, index) => renderCard(item, index, "desk"))}
      </div>

      {/* MOBILE INTERACTIVE SCROLLER */}
      <div className="mobile-scroll-view">
        
        {/* Row 1: Auto Scrolls Left, User can Swipe */}
        <MobileScrollRow direction="left" speed={0.8}>
          {/* Triple duplication ensures smooth scrolling even on big phones */}
          {[...row1, ...row1, ...row1].map((item, index) =>
            renderCard(item, index, "m1")
          )}
        </MobileScrollRow>

        {/* Row 2: Auto Scrolls Right, User can Swipe */}
        <MobileScrollRow direction="right" speed={0.8}>
          {[...row2, ...row2, ...row2].map((item, index) =>
            renderCard(item, index, "m2")
          )}
        </MobileScrollRow>
      </div>
    </div>
  );
}