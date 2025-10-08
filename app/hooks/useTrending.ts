'use client';

import { useEffect, useState } from 'react';

export type TrendEntry = {
  symbol: string;
  name: string;
  changePercent: number;
  latestPrice: number;
  trend: 'up' | 'down' | 'sideways';
};

export type TrendData = {
  up: TrendEntry[];
  down: TrendEntry[];
};

export function useTrending(): TrendData | null {
  const [data, setData] = useState<TrendData | null>(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await fetch('/api/trends');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('❌ Failed to load trend data:', error);
      }
    };

    fetchTrends();
    const interval = setInterval(fetchTrends, 5 * 60 * 1000); // refresh every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return data;
}