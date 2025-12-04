// lib/newsStore.ts
import { adminDb } from "./pushAdminSafe"; // Your firebase admin instance
import { SymbolData } from "./fetchData";

export interface NewsEvent {
  slug: string;
  symbol: string;
  title: string;
  signal: string;
  price_at_alert: number;
  timestamp: string;
  generated_at: any; // Firestore Timestamp
}

export async function createNewsEvent(symbol: string, data: SymbolData) {
  const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const cleanSym = symbol.replace('/', '');
  const signal = data.final_decision.toLowerCase(); // 'buy', 'sell'
  
  // 1. Generate SEO-friendly Title & Slug
  const headlines = [
    `${symbol} Breaking: Trend Flipped to ${signal.toUpperCase()}`,
    `Market Alert: ${symbol} Signals Major ${signal.toUpperCase()} Move`,
    `${symbol} Technical Update: Why AI Just Signaled ${signal.toUpperCase()}`
  ];
  // Pick random headline to avoid duplicate content penalties
  const title = headlines[Math.floor(Math.random() * headlines.length)];
  
  // Slug: audusd-buy-signal-nov-27-2025-xf3
  // Added random string at end to ensure uniqueness if multiple signals happen same day
  const uniqueId = Math.random().toString(36).substring(2, 6);
  const slug = `${cleanSym}-${signal}-signal-${dateStr}-${uniqueId}`;

  const newsItem: NewsEvent = {
    slug,
    symbol: data.symbol,
    title,
    signal: data.final_decision,
    price_at_alert: data.trend.current_price,
    timestamp: new Date().toISOString(),
    generated_at: new Date()
  };

  // 2. Save to Firestore "news_archive" collection
  await adminDb.collection('news_archive').doc(slug).set(newsItem);

  console.log(`📰 NEWS GENERATED: ${slug}`);
  return slug;
}