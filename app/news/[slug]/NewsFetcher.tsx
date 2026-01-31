'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import NewsClientView from '@/components/NewsClientView'; // You'll need to create this

interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  symbol: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  price_at_alert: number;
  timestamp: string;
  [key: string]: any;
}

export default function NewsFetcher({ slug }: { slug: string }) {
  const [news, setNews] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`[NewsFetcher] Fetching news article: ${slug}`);
        
        const response = await fetch(`/api/news?slug=${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        setNews(result);
        console.log(`[NewsFetcher] News article loaded: ${slug}`);
        
      } catch (err) {
        console.error(`[NewsFetcher] Error loading news:`, err);
        if (err instanceof Error && err.message.includes('404')) {
          notFound();
        }
        setError(err instanceof Error ? err.message : 'Failed to load news article');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Update metadata client-side
  useEffect(() => {
    if (news) {
      // Update page title
      document.title = news.title;
      
      // Update meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 
          `Market Flash: ${news.symbol} just hit ${news.price_at_alert} with a confirmed ${news.signal} signal. Read the full AI breakdown.`
        );
      }
    }
  }, [news]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-zinc-400">Loading news article...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">News Unavailable</h1>
          <p className="text-zinc-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!news) {
    notFound();
  }

  // Success - render the client view
  return <NewsClientView news={news} />;
}