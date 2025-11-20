 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface MarketSignal {
  symbol: string;
  action: "BUY" | "SELL";
  current_price: number;
  entry: number;
  tp: number;
  sl: number;
  trend: {
    trend: string;
  };
  confidence: number;
  timestamp: string;
}
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

  if (loading) return (
    <div className="feed-container">
       <div className="feed-loading">
         <div className="pulse-bar"></div>
         <p>Calibrating AI Feed...</p>
       </div>
    </div>
  );

  if (signals.length === 0) return null;

  // Take top 6 signals
  const displaySignals = signals.slice(0, 6);

  return (
    <div className="feed-container">
      <div className="feed-header">
        <div className="live-badge">
          <span className="blink-dot"></span> LIVE FEED
        </div>
        <h3>Real-time market opportunities detected by MZPrimer AI Trading Expert</h3>
      </div>

      <div className="feed-grid">
        {displaySignals.map((item, index) => {
          const isBuy = item.action === "BUY";
          // const cardClass = isBuy ? "signal-buy" : "signal-sell"; // Moved style to CSS logic
          
          return (
            <div key={`${item.symbol}-${index}`} className="feed-card">
              {/* Header: Symbol + Action Badge */}
              <div className="card-row-top">
                <div className="symbol-group">
                  <span className="symbol-text">{item.symbol}</span>
                  <span className="price-text">{item.current_price}</span>
                </div>
                <div className={`mini-badge ${isBuy ? 'green' : 'red'}`}>
                  {item.action}
                </div>
              </div>

              {/* Stats Grid (Compact) */}
              <div className="card-stats-grid">
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

              {/* Locked Data (Blurred Lines) */}
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
        })}
      </div>
    </div>
  );
}