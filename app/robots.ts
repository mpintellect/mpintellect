import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://mzprimer.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',          // Don't let bots waste budget crawling raw JSON
        '/admin-console-x9z/', // Block your admin path (from your logs earlier)
        '/client/',       // Block internal client dashboard pages
        '/_next/',        // Block internal Next.js build files (optional, but saves budget)
        '/private/',      // Block any private folders
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}