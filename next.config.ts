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

  // Proxy API calls in local development
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          // First try local wrangler (port 8788); if not running, this falls through
          // In practice during local dev without wrangler, we proxy to production API
          source: '/api/:path*',
          destination: process.env.LOCAL_API === 'true'
            ? 'http://localhost:8788/api/:path*'
            : 'https://mpintellect.com/api/:path*',
        },
      ];
    }
    return [];
  },
};

export default baseConfig;