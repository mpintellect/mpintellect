import type { NextConfig } from 'next';

const baseConfig: NextConfig = {
  // Keep exactly as is - Cloudflare Pages needs this
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: true,
  typescript: { ignoreBuildErrors: true },

  images: {
    unoptimized: true,
  },

  // Required for Next.js 16 to allow custom build flags/webpack fallbacks
  turbopack: {},

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

export default baseConfig;