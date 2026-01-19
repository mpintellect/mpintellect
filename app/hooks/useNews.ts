'use client';

import { useState, useEffect } from 'react';

export interface NewsItem {
  id: string;
  symbol: string;
  headline: string;
  question: string;
  aiContext: string;
  category: string;
}

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Fetch from our local proxy API
        const res = await fetch('/api/news');
        if (res.ok) {
          const data = await res.json();
          // Safety check: ensure it's an array
          if (Array.isArray(data)) {
            setNews(data);
          }
        }
      } catch (e) {
        console.error("News hook error", e);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return { news, loading };
}