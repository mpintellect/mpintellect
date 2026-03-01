// app/hooks/useSession.ts
"use client";

import { useState, useEffect } from "react";

interface SessionInfo {
  sessionName: string;
  isWeekend: boolean;
  currentHourUTC: number;
}

const MARKET_SESSIONS = [
  { name: "SYDNEY", open: 22, close: 7, priority: 1 },
  { name: "TOKYO", open: 0, close: 9, priority: 2 },
  { name: "LONDON", open: 7, close: 16, priority: 4 }, // London is highest priority
  { name: "NEW YORK", open: 13, close: 22, priority: 3 },
];

export function useSession(): SessionInfo {
  const [sessionData, setSessionData] = useState<SessionInfo>({
    sessionName: "OFFLINE",
    isWeekend: true,
    currentHourUTC: 0,
  });

  useEffect(() => {
    const checkMarketStatus = () => {
      const now = new Date();
      const day = now.getUTCDay(); // 0 = Sun, 1 = Mon... 6 = Sat
      const hour = now.getUTCHours();

      // 1. Weekend Logic: Market closes Friday 22:00 UTC, Opens Sunday 22:00 UTC
      const isWeekend = 
        (day === 6) || // Saturday
        (day === 0 && hour < 22) || // Sunday morning/afternoon
        (day === 5 && hour >= 22); // Friday night after NY close

      // 2. Determine Active Session
      let activeSessions = MARKET_SESSIONS.filter((s) => {
        return s.open > s.close 
          ? (hour >= s.open || hour < s.close) // Sydney cross-midnight
          : (hour >= s.open && hour < s.close);
      });

      // Sort by priority (London > NY > Tokyo > Sydney) to show the most important one
      activeSessions.sort((a, b) => b.priority - a.priority);

      setSessionData({
        sessionName: activeSessions.length > 0 ? activeSessions[0].name : "ROLLOVER",
        isWeekend: isWeekend,
        currentHourUTC: hour,
      });
    };

    // Initial check
    checkMarketStatus();

    // Sync every 60 seconds
    const interval = setInterval(checkMarketStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return sessionData;
}