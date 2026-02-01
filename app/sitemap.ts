
import { MetadataRoute } from 'next';
import { getAvailableSetupSymbols } from '@/app/lib/fetchSetup';
import { query } from '@/backend-lib/db-simple';

// ✅ MANDATORY FOR STATIC EXPORT
export const dynamic = 'force-static';

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mzprimer.com';
  const now = new Date();

  // 1. Get symbols (Fallback to hardcoded list if build environment has no DB access)
  let symbols: string[] = [];
  try {
    symbols = await getAvailableSetupSymbols();
  } catch (error) {
    symbols = ["EURUSD", "GBPUSD", "USDJPY", "USDCAD", "AUDUSD",
      "NZDUSD", "USDCHF", "XAUUSD", "XAUEUR", "XAGUSD",
      "PLATINUM", "BRENT", "BTCUSD", "ETHUSD", "XRPUSD",
      "DOGEUSD", "LTCUSD", "US500", "USTEC", "US30",
      "HK50", "CAC", "CHINA50", "UK100", "EURJPY",
      "EURGBP", "GBPJPY", "GBPCHF"];
  }

  const pSeoTypes = ['analysis', 'trade', 'trend', 'forecast', 'volatility', 'momentum', 'zones', 'calculator', 'indicator'];
  const dynamicRoutes: MetadataRoute.Sitemap = [];

  symbols.forEach((sym) => {
    const cleanSymbol = sym.toLowerCase().replace('/', '-');
    pSeoTypes.forEach((pageType) => {
      dynamicRoutes.push({
        url: `${baseUrl}/${pageType}/${cleanSymbol}`,
        lastModified: now,
        changeFrequency: 'always' as const,
        priority: 0.8,
      });
    });
  });

  // 2. News routes (Graceful fallback for Build Phase)
  const newsRoutes: MetadataRoute.Sitemap = [];
  try {
    const newsArticles = await query('SELECT slug, created_at FROM news_articles LIMIT 100');
    if (newsArticles && newsArticles.length > 0) {
      newsArticles.forEach((article: any) => {
        newsRoutes.push({
          url: `${baseUrl}/news/${article.slug}`,
          lastModified: new Date(article.created_at),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        });
      });
    }
  } catch (e) {
    console.warn("Sitemap Build: D1 not available, skipping news articles.");
  }

  // 3. Blog routes (Graceful fallback for Build Phase)
  const blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogPosts = await query('SELECT slug, updated_at FROM blog_posts WHERE status = "published"');
    if (blogPosts && blogPosts.length > 0) {
      blogPosts.forEach((post: any) => {
        blogRoutes.push({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        });
      });
    }
  } catch (e) {
    console.warn("Sitemap Build: D1 not available, skipping blog posts.");
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/AIChat`, lastModified: now, priority: 0.9 },
    { url: `${baseUrl}/prop-firm`, lastModified: now, priority: 0.9 },
    { url: `${baseUrl}/client/dashboard`, lastModified: now, priority: 0.8 },
    { url: `${baseUrl}/markets`, lastModified: now, priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, priority: 0.7 },
    { url: `${baseUrl}/legal`, lastModified: now, priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: now, priority: 0.3 },
    { url: `${baseUrl}/legal#terms`, lastModified: now, priority: 0.3 },
    { url: `${baseUrl}/faq`, lastModified: now, priority: 0.5 },
    { url: `${baseUrl}/ai-robot`, lastModified: now, priority: 0.7 },
    { url: `${baseUrl}/client/login`, lastModified: now, priority: 0.6 },
    { url: `${baseUrl}/client/register`, lastModified: now, priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: now, priority: 0.4 },
    { url: `${baseUrl}/tools/ai-assistant`, lastModified: now, priority: 0.6 },
  ];

  return [...staticRoutes, ...dynamicRoutes, ...newsRoutes, ...blogRoutes];
}