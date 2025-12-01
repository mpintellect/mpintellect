// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getAvailableSetupSymbols } from '@/app/lib/fetchSetup';

// Cache for 1 hour to balance server load vs freshness
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mzprimer.com';

  // 1. DYNAMIC pSEO PAGES (The 7 Pillars per Symbol)
  const symbols = await getAvailableSetupSymbols();
  
  // Define all the pSEO folder names we just linked
  const pSeoTypes = [
    'analysis',   // Main summary
    'trade',      // Specific setup
    'trend',      // Direction
    'forecast',   // AI Prediction
    'volatility', // Risk
    'momentum',   // Speed
    'zones'       // S/R Levels
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [];

  // Loop through every symbol AND every page type
  symbols.forEach((sym) => {
    const cleanSymbol = sym.toLowerCase().replace('/', '-');

    pSeoTypes.forEach((pageType) => {
      dynamicRoutes.push({
        url: `${baseUrl}/${pageType}/${cleanSymbol}`,
        lastModified: new Date(),
        changeFrequency: 'hourly' as const, // Important: Signals update hourly
        priority: 0.8, 
      });
    });
  });

  // 2. STATIC PAGES
  const staticRoutes: MetadataRoute.Sitemap = [
    { 
      url: baseUrl, 
      lastModified: new Date(), 
      changeFrequency: 'daily', 
      priority: 1.0 
    },
    { url: `${baseUrl}/client/login`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/AIChat`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/legal`, lastModified: new Date(), priority: 0.3 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/ai-robot`, lastModified: new Date(), priority: 0.7 },
  ];

  // Return combined list (Static + Dynamic)
  return [...staticRoutes, ...dynamicRoutes];
}