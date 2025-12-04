import { MetadataRoute } from 'next';
import { getAvailableSetupSymbols } from '@/app/lib/fetchSetup';
import { adminDb } from '../app/lib/pushAdminSafe';

export const revalidate = 3600;

// Function to format date correctly
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mzprimer.com';
  const now = new Date();
  const formattedDate = formatDate(now);

  // Get symbols
  let symbols: string[] = [];
  try {
    symbols = await getAvailableSetupSymbols();
  } catch (error) {
    console.error("Sitemap: Failed to fetch symbols", error);
    symbols = ["EURUSD", "GBPUSD", "USDJPY", "USDCAD", "AUDUSD",
      "NZDUSD", "USDCHF", "XAUUSD", "XAUEUR", "XAGUSD",
      "PLATINUM", "BRENT", "BTCUSD", "ETHUSD", "XRPUSD",
      "DOGEUSD", "LTCUSD", "US500", "USTEC", "US30",
      "HK50", "CAC", "CHINA50", "UK100", "EURJPY",
      "EURGBP", "GBPJPY", "GBPCHF"];
  }

  // Page types
  const pSeoTypes = [
    'analysis', 'trade', 'trend', 'forecast', 
    'volatility', 'momentum', 'zones', 'calculator', 'indicator'
  ];

  // Generate dynamic routes
  const dynamicRoutes: MetadataRoute.Sitemap = [];

  symbols.forEach((sym) => {
    const cleanSymbol = sym.toLowerCase().replace('/', '-');
    
    pSeoTypes.forEach((pageType) => {
      dynamicRoutes.push({
        url: `${baseUrl}/${pageType}/${cleanSymbol}`,
        lastModified: now,
        changeFrequency: 'always' as const,
        priority: pageType === 'analysis' ? 0.9 : 0.8,
      });
    });
  });

  // News routes
  const newsRoutes: MetadataRoute.Sitemap = [];
  try {
    const newsSnapshot = await adminDb.collection('news_archive').get();
    console.log(`Found ${newsSnapshot.size} news articles`);
    
    newsSnapshot.forEach((doc) => {
      const data = doc.data();
      const newsDate = data.timestamp ? new Date(data.timestamp) : now;
      
      newsRoutes.push({
        url: `${baseUrl}/news/${doc.id}`,
        lastModified: newsDate,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error("Sitemap: Failed to fetch news archive", error);
  }

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { 
      url: baseUrl, 
      lastModified: now, 
      changeFrequency: 'daily' as const, 
      priority: 1.0 
    },
    { url: `${baseUrl}/AIChat`, lastModified: now, priority: 0.9 },
    { url: `${baseUrl}/dashboard`, lastModified: now, priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: now, priority: 0.5 },
    { url: `${baseUrl}/legal`, lastModified: now, priority: 0.3 },
    { url: `${baseUrl}/faq`, lastModified: now, priority: 0.5 },
    { url: `${baseUrl}/ai-robot`, lastModified: now, priority: 0.7 },
    { url: `${baseUrl}/client/login`, lastModified: now, priority: 0.6 },
  ];

  // Combine all routes
  const allRoutes = [...staticRoutes, ...dynamicRoutes, ...newsRoutes];
  
  console.log(`Generated sitemap with ${allRoutes.length} URLs`);
  console.log(`- Static: ${staticRoutes.length}`);
  console.log(`- Dynamic: ${dynamicRoutes.length}`);
  console.log(`- News: ${newsRoutes.length}`);
  
  return allRoutes;
}