"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useNews, NewsItem } from "../app/hooks/useNews";
import { useSession } from "../app/hooks/useSession"; // Added for session context
import MarketPollModal from "./news/MarketPollModal";

interface MarketSignal {
  symbol: string;
  action: "BUY" | "SELL";
  current_price: number;
  confidence: number;
}

const ScrollRow = ({ children, direction = "left", speed = 1 }: { children: React.ReactNode; direction?: "left" | "right"; speed?: number; }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  const scrollPos = useRef(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const animate = () => {
      if (!el || isPaused.current) {
        requestAnimationFrame(animate);
        return;
      }
      const move = direction === "left" ? speed : -speed;
      scrollPos.current += move;
      el.scrollLeft = scrollPos.current;
      if (direction === "left" && scrollPos.current >= el.scrollWidth / 2) scrollPos.current = 0;
      else if (direction === "right" && scrollPos.current <= 0) scrollPos.current = el.scrollWidth / 2;
      requestAnimationFrame(animate);
    };
    const req = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(req);
  }, [direction, speed]);

  return (
    <div ref={scrollerRef} className="feed-scroll-row"
      onMouseEnter={() => (isPaused.current = true)}
      onMouseLeave={() => (isPaused.current = false)}
      onTouchStart={() => (isPaused.current = true)}
      onTouchEnd={() => (isPaused.current = false)}
    >
      <div className="feed-scroll-content">{children}</div>
    </div>
  );
};

export default function LiveMarketFeed() {
  const { news } = useNews();
  const { sessionName, isWeekend } = useSession();
  const [signals, setSignals] = useState<MarketSignal[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/livemarketfeed").then(res => res.json()).then(data => setSignals(data?.signals || []));
  }, []);

  if (!signals.length || !news.length) return null;

  const duplicatedSignals = [...signals, ...signals, ...signals, ...signals];
  const duplicatedNews = [...news, ...news, ...news];

  return (
    <div className="terminal-feed-wrapper">
      {/* 🏛️ SESSION CONTROL BADGE */}
      <div className="feed-header-tier">
        <div className="session-status-badge">
          <span className={`pulse-dot ${isWeekend ? 'red' : 'green'}`}></span>
          <span className="session-info">{isWeekend ? "MARKETS CLOSED" : `${sessionName} SESSION ACTIVE`}</span>
        </div>
        <div className="feed-description">MZ  Real-Time Order Flow</div>
      </div>

      <div className="dual-feed-container">
        {/* ROW 1: SIGNALS */}
        <ScrollRow direction="left" speed={0.8}>
          {duplicatedSignals.map((item, idx) => (
  <div key={`sig-${idx}`} className="feed-slat signal">
    <span className="slat-label">{item.symbol}</span>
    <span className={`slat-value ${item.action.toLowerCase()}`}>
      {item.action === "BUY" ? "↑" : "↓"}
    </span>
    <span className="slat-price">{item.current_price.toFixed(2)}</span>
    <span className="slat-conf">{item.confidence}% ACC</span>
  </div>
))}
        </ScrollRow>

        {/* ROW 2: NEWS */}
        <ScrollRow direction="right" speed={0.5}>
          {duplicatedNews.map((item, idx) => (
            <button key={`news-${idx}`} onClick={() => setSelectedNews(item)} className="feed-slat news">
              <span className="news-tag">NEWS</span>
              <span className="news-symbol">{item.symbol}</span>
              <span className="news-text">{item.headline}</span>
            </button>
          ))}
        </ScrollRow>
      </div>

      {mounted && selectedNews && createPortal(
        <MarketPollModal data={selectedNews} onClose={() => setSelectedNews(null)} />,
        document.body
      )}
    </div>
  );
}