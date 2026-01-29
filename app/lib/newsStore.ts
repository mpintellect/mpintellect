// app/lib/newsStore.ts - CLOUDFLARE VERSION
import { getDb, execute } from "@/app/lib/cloudflare/db-simple";
import { SymbolData } from "./fetchData";

export interface NewsEvent {
  id: string;
  slug: string;
  symbol: string;
  title: string;
  signal: string;
  price_at_alert: number;
  timestamp: string;
  generated_at: number;
  created_at: number;
  updated_at: number;
}

export async function createNewsEvent(symbol: string, data: SymbolData): Promise<string | null> {
  try {
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
    const uniqueId = Math.random().toString(36).substring(2, 6);
    const slug = `${cleanSym.toLowerCase()}-${signal}-signal-${dateStr}-${uniqueId}`;
    
    const now = Date.now();
    const newsItem = {
      id: slug,
      slug,
      symbol: data.symbol,
      title,
      signal: data.final_decision,
      price_at_alert: data.trend?.current_price || 0,
      timestamp: new Date().toISOString(),
      generated_at: now,
      created_at: now,
      updated_at: now
    };

    // 2. Save to Cloudflare D1 database
    const result = await execute(
      `INSERT INTO news_articles 
       (id, slug, symbol, title, signal, price_at_alert, timestamp, generated_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        slug,
        data.symbol,
        title,
        data.final_decision,
        data.trend?.current_price || 0,
        new Date().toISOString(),
        now,
        now,
        now
      ]
    );

    if (result.success) {
      console.log(`📰 NEWS GENERATED: ${slug}`);
      return slug;
    } else {
      console.error(`Failed to save news event for ${symbol}`);
      return null;
    }
  } catch (error) {
    console.error(`Error creating news event for ${symbol}:`, error);
    return null;
  }
}

export async function getNewsItem(slug: string): Promise<NewsEvent | null> {
  try {
    const db = getDb();
    if (!db) return null;

    const stmt = db.prepare('SELECT * FROM news_articles WHERE slug = ?');
    const result = await stmt.bind(slug).first();
    
    return result as NewsEvent | null;
  } catch (error) {
    console.error(`Error fetching news item ${slug}:`, error);
    return null;
  }
}

export async function getRecentNews(limit: number = 20): Promise<NewsEvent[]> {
  try {
    const db = getDb();
    if (!db) return [];

    const stmt = db.prepare('SELECT * FROM news_articles ORDER BY created_at DESC LIMIT ?');
    const result = await stmt.bind(limit).all();
    
    return result.results as NewsEvent[];
  } catch (error) {
    console.error('Error fetching recent news:', error);
    return [];
  }
}