// app/hooks/useMarketSignals.ts
"use client";

import { useEffect, useState } from "react";

export interface MarketSignal {
  symbol: string;
  action: "BUY" | "SELL";
  current_price: number;
  tp: number;
  confidence: number;
}

// Module-level cache + in-flight dedup: LiveMarketFeed (the ticker) and
// HeroMissionControl both want this same endpoint on the homepage - without this,
// two components mounting at once fire two identical requests. Every caller
// after the first resolve gets the cached array with no extra network call.
let cachedSignals: MarketSignal[] | null = null;
let inFlight: Promise<MarketSignal[]> | null = null;

function fetchSignals(): Promise<MarketSignal[]> {
  if (cachedSignals) return Promise.resolve(cachedSignals);
  if (!inFlight) {
    inFlight = fetch("/api/livemarketfeed")
      .then((res) => res.json())
      .then((data: { signals?: MarketSignal[] }) => {
        cachedSignals = data?.signals || [];
        return cachedSignals;
      })
      .catch(() => {
        cachedSignals = [];
        return cachedSignals;
      })
      .finally(() => {
        inFlight = null;
      });
  }
  return inFlight;
}

export function useMarketSignals(): MarketSignal[] {
  const [signals, setSignals] = useState<MarketSignal[]>(cachedSignals || []);

  useEffect(() => {
    let cancelled = false;
    fetchSignals().then((data) => {
      if (!cancelled) setSignals(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return signals;
}
