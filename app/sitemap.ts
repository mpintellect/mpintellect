import { MetadataRoute } from 'next';
import { getAvailableSetupSymbols } from '@/app/lib/fetchSetup';
import { adminDb } from '../app/lib//pushAdminSafe'; // Ensure path matches your project structure

// Cache for 1 hour to balance server load vs freshness
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mzprimer.com';

  // ============================================
  // 1. DYNAMIC pSEO PAGES (The 9 Pillars)
  // ============================================
  
  // Fetch symbols from your existing logic
  let symbols: string[] = [];
  try {
    symbols = await getAvailableSetupSymbols();
  } catch (error) {
    console.error("Sitemap: Failed to fetch symbols", error);
    // Fallback list to ensure sitemap never crashes entirely
    symbols = ["EURUSD", "GBPUSD", "USDJPY", "USDCAD", "AUDUSD",
  "NZDUSD", "USDCHF", "XAUUSD", "XAUEUR", "XAGUSD",
  "PLATINUM", "BRENT", "BTCUSD", "ETHUSD", "XRPUSD",
  "DOGEUSD", "LTCUSD", "US500", "USTEC", "US30",
  "HK50", "CAC", "CHINA50", "UK100", "EURJPY",
  "EURGBP", "GBPJPY", "GBPCHF"]; 
  }

  // COMPLETE list of all 9 Page Types
  const pSeoTypes = [
    'analysis',   // Main summary
    'trade',      // Specific setup
    'trend',      // Direction
    'forecast',   // AI Prediction
    'volatility', // Risk
    'momentum',   // Speed
    'zones',      // S/R Levels
    'calculator', // Position Size Tool (Added)
    'indicator'   // Technical Score (Added)
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [];

  // Loop: Symbol x Page Type
  symbols.forEach((sym) => {
    // Ensure clean URL format (e.g. BTC/USD -> btcusd or btc-usd)
    const cleanSymbol = sym.toLowerCase().replace('/', '-');

    pSeoTypes.forEach((pageType) => {
      dynamicRoutes.push({
        url: `${baseUrl}/${pageType}/${cleanSymbol}`,
        lastModified: new Date(),
        // Important: These pages update every 5 minutes with market data
        changeFrequency: 'always' as const, 
        priority: pageType === 'analysis' ? 0.9 : 0.8, 
      });
    });
  });

  // ============================================
  // 2. BREAKING NEWS ARCHIVE (From Firebase)
  // ============================================
  
  const newsRoutes: MetadataRoute.Sitemap = [];
  
  try {
    // Fetch all news documents created by your "Signal Flip" logic
    const newsSnapshot = await adminDb.collection('news_archive').get();
    
    newsSnapshot.forEach((doc) => {
      const data = doc.data();
      newsRoutes.push({
        url: `${baseUrl}/news/${doc.id}`, // Uses the slug as ID
        // Use the actual generated date, fallback to now
        lastModified: data.timestamp ? new Date(data.timestamp) : new Date(),
        // News articles are static once written, they don't change
        changeFrequency: 'never' as const, 
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error("Sitemap: Failed to fetch news archive", error);
    // We swallow the error so the rest of the sitemap still works
  }

  // ============================================
  // 3. STATIC PAGES
  // ============================================
  const staticRoutes: MetadataRoute.Sitemap = [
    { 
      url: baseUrl, 
      lastModified: new Date(), 
      changeFrequency: 'daily', 
      priority: 1.0 
    },
    { url: `${baseUrl}/client/login`, lastModified: new Date(), priority: 0.6 },
    { url: `${baseUrl}/AIChat`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/dashboard`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/legal`, lastModified: new Date(), priority: 0.3 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/ai-robot`, lastModified: new Date(), priority: 0.7 },
  ];

  // Return Combined List
  return [...staticRoutes, ...dynamicRoutes, ...newsRoutes];
}