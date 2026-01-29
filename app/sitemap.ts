// app/sitemap.ts - CLOUDFLARE VERSION
import { MetadataRoute } from 'next';
import { getAvailableSetupSymbols } from '@/app/lib/fetchSetup';
import { query } from '@/app/lib/cloudflare/db-simple';

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

  // News routes - MIGRATED FROM FIREBASE TO CLOUDFLARE
  const newsRoutes: MetadataRoute.Sitemap = [];
  try {
    // Fetch news from Cloudflare D1 instead of Firebase
    const newsArticles = await query<{
      id: string;
      title: string;
      content: string;
      timestamp: number;
      slug?: string;
      category?: string;
      created_at: number;
    }>('SELECT * FROM news_articles ORDER BY created_at DESC LIMIT 1000');
    
    console.log(`Found ${newsArticles.length} news articles from Cloudflare D1`);
    
    newsArticles.forEach((article) => {
      const newsDate = article.timestamp ? new Date(article.timestamp) : 
                      article.created_at ? new Date(article.created_at) : now;
      
      // Use slug if available, otherwise use ID
      const slug = article.slug || article.id;
      
      newsRoutes.push({
        url: `${baseUrl}/news/${slug}`,
        lastModified: newsDate,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error("Sitemap: Failed to fetch news archive from Cloudflare", error);
  }

  // Blog routes - ADDED: Fetch from blog_posts table
  const blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogPosts = await query<{
      id: string;
      title: string;
      slug: string;
      published_at: number;
      updated_at: number;
      status: string;
    }>('SELECT * FROM blog_posts WHERE status = "published" ORDER BY published_at DESC LIMIT 500');
    
    console.log(`Found ${blogPosts.length} blog posts`);
    
    blogPosts.forEach((post) => {
      const postDate = post.updated_at ? new Date(post.updated_at) : 
                      post.published_at ? new Date(post.published_at) : now;
      
      blogRoutes.push({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: postDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      });
    });
  } catch (error) {
    console.error("Sitemap: Failed to fetch blog posts", error);
  }

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { 
      url: baseUrl, 
      lastModified: now, 
      changeFrequency: 'daily' as const, 
      priority: 1.0 
    },
    { url: `${baseUrl}/ai-chat`, lastModified: now, priority: 0.9 },
    { url: `${baseUrl}/prop-firm-chat`, lastModified: now, priority: 0.9 },
    { url: `${baseUrl}/dashboard`, lastModified: now, priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: now, priority: 0.5 },
    { url: `${baseUrl}/legal`, lastModified: now, priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: now, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, priority: 0.3 },
    { url: `${baseUrl}/faq`, lastModified: now, priority: 0.5 },
    { url: `${baseUrl}/ai-robot`, lastModified: now, priority: 0.7 },
    { url: `${baseUrl}/client/login`, lastModified: now, priority: 0.6 },
    { url: `${baseUrl}/client/register`, lastModified: now, priority: 0.6 },
    { url: `${baseUrl}/pricing`, lastModified: now, priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, priority: 0.4 },
    { url: `${baseUrl}/features`, lastModified: now, priority: 0.6 },
    { url: `${baseUrl}/how-it-works`, lastModified: now, priority: 0.6 },
    { url: `${baseUrl}/testimonials`, lastModified: now, priority: 0.5 },
  ];

  // Combine all routes
  const allRoutes = [...staticRoutes, ...dynamicRoutes, ...newsRoutes, ...blogRoutes];
  
  console.log(`Generated sitemap with ${allRoutes.length} URLs`);
  console.log(`- Static: ${staticRoutes.length}`);
  console.log(`- Dynamic: ${dynamicRoutes.length}`);
  console.log(`- News: ${newsRoutes.length}`);
  console.log(`- Blog: ${blogRoutes.length}`);
  
  return allRoutes;
}