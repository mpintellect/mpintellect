// components/InstitutionalSessionMonitor.tsx
"use client";

import { useEffect, useState } from "react";

const MARKET_SESSIONS = [
  { name: "SYDNEY", open: 22, close: 7, centers: "Australia, NZ", vol: "Low" },
  { name: "TOKYO", open: 0, close: 9, centers: "Japan, Singapore", vol: "Medium" },
  { name: "LONDON", open: 7, close: 16, centers: "UK, Europe", vol: "High" },
  { name: "NEW YORK", open: 13, close: 22, centers: "USA, Canada", vol: "Very High" },
];

export default function InstitutionalSessionMonitor() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (!now) return null;

  const dayUTC = now.getUTCDay(); // 0 = Sun, 1 = Mon... 5 = Fri, 6 = Sat
  const hourUTC = now.getUTCHours();

  // ✅ Market Open Logic: Sunday 22:00 UTC to Friday 22:00 UTC
  const isWeekend = (dayUTC === 6) || (dayUTC === 0 && hourUTC < 22) || (dayUTC === 5 && hourUTC >= 22);

  const activeSessions = isWeekend ? [] : MARKET_SESSIONS.filter((s) => {
    return s.open > s.close 
      ? (hourUTC >= s.open || hourUTC < s.close)
      : (hourUTC >= s.open && hourUTC < s.close);
  });

  return (
    <div className="terminal-session-monitor">
      <div className="monitor-header">
        <div className="terminal-clock">
          <span className={`live-pulse ${isWeekend ? 'offline' : 'online'}`}></span>
          {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="liquidity-status">
          {isWeekend ? "TRADING HALT" : `ACTIVE EXCHANGES: ${activeSessions.length}`}
        </div>
      </div>

      <div className="active-center-grid">
        {!isWeekend ? (
          activeSessions.length > 0 ? (
            activeSessions.map((s) => (
             <div key={s.name} className="center-card">
                <div className="center-header">
                  <span className="center-name">{s.name} OPEN</span>
                  <span className={`vol-tag ${s.vol.toLowerCase().replace(' ', '-')}`}>
                    {s.vol} VOL
                  </span>
                </div>
                <div className="center-details">
                  <span className="centers-list">📍 {s.centers}</span>
                  <span className="center-window">⏰ {s.open}:00 - {s.close}:00 UTC</span>
                </div>
              </div>
            ))
          ) : (
            <div className="market-note">ROLLOVER GAP - WAITING FOR LONDON OPEN</div>
          )
        ) : (
          <div className="market-closed-state">
            <div className="closed-icon">💤</div>
            <div className="closed-text">
               <h4>INSTITUTIONAL MARKETS CLOSED</h4>
               <p>Traditional exchanges are offline. Setups will resume Sunday 22:00 UTC.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}