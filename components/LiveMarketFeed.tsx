"use client";

import { useState } from "react";
import { useSession } from "../app/hooks/useSession"; // Added for session context
import { useMarketSignals } from "../app/hooks/useMarketSignals";
import { getDecimals } from "../app/lib/fetchData";

/* Pure-CSS marquee (transform: translateX, compositor-driven) instead of
   the previous rAF loop that mutated scrollLeft every frame - that was
   main-thread work fighting layout each tick and reads as noticeably
   less smooth than a GPU-accelerated CSS animation. Pausing on hover is
   handled purely in CSS; touch still needs a bit of React state since
   there's no CSS pseudo-class for "held down" on mobile. */
const ScrollRow = ({ children, direction = "left", duration = 40 }: { children: React.ReactNode; direction?: "left" | "right"; duration?: number; }) => {
  const [touchPaused, setTouchPaused] = useState(false);

  return (
    <div
      className="feed-scroll-row"
      onTouchStart={() => setTouchPaused(true)}
      onTouchEnd={() => setTouchPaused(false)}
    >
      <div
        className={`feed-scroll-content ${direction === "right" ? "reverse" : ""} ${touchPaused ? "paused" : ""}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {children}
      </div>
    </div>
  );
};

export default function LiveMarketFeed() {
  const { sessionName, isWeekend } = useSession();
  const signals = useMarketSignals();

  if (!signals.length) return null;

  // Even number of copies, repeated generously - the CSS marquee below
  // loops by translating exactly -50%, so the first half of the content
  // needs to already be at least one viewport wide for the loop to be
  // seamless (no gap) even with a short signals list.
  const duplicatedSignals = [...signals, ...signals, ...signals, ...signals, ...signals, ...signals];

  return (
    <div className="terminal-feed-wrapper">
      {/* 🏛️ SESSION CONTROL BADGE */}
      <div className="feed-header-tier">
        <div className={`session-status-badge ${isWeekend ? 'closed' : 'active'}`}>
          <span className={`pulse-dot ${isWeekend ? 'red' : 'green'}`}></span>
          <span className="session-info">{isWeekend ? "Markets Closed" : `${sessionName} Session Active`}</span>
        </div>
        <div className="feed-description">Real-Time Order Flow</div>
      </div>

      <div className="livefeed-rows">
        <ScrollRow direction="left" duration={85}>
          {duplicatedSignals.map((item, idx) => (
            <div key={`sig-${idx}`} className="feed-slat signal">
              <span className="slat-label">{item.symbol}</span>
              <span className={`slat-value ${item.action.toLowerCase()}`}>
                {item.action === "BUY" ? "↑" : "↓"}
              </span>
              <span className="slat-price">{item.current_price.toFixed(getDecimals(item.symbol))}</span>
              {typeof item.tp === "number" && (
                <span className={`slat-tp ${item.action.toLowerCase()}`}>
                  <span className="slat-tp-label">Target</span> {item.tp.toFixed(getDecimals(item.symbol))}
                </span>
              )}
              <span className="slat-conf">{item.confidence}% acc</span>
            </div>
          ))}
        </ScrollRow>
      </div>
    </div>
  );
}