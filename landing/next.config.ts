import type { NextConfig } from '@/landing/node_modules/next';

const nextConfig: NextConfig = {
  // Keep exactly as is - Cloudflare Pages needs this
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  
  typescript: { ignoreBuildErrors: true },
  
  images: {
    unoptimized: true,
    qualities: [75, 85],
  },

  // Add ONLY this for local development
  async rewrites() {
    // Proxy API calls to wrangler during local dev
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8788/api/:path*',
        },
      ];
    }
    return [];
  },
};

export default nextConfig;