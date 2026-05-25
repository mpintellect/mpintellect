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

// Check which build we're running
const buildTarget = process.env.NEXT_PUBLIC_BUILD_TARGET || 'main';

// Build the appropriate config based on target
let finalConfig: NextConfig;

if (buildTarget === 'intel') {
  // INTEL-ONLY BUILD: Only export the /intel page
  finalConfig = {
    ...baseConfig,
    exportPathMap: async () => ({
      '/': { page: '/intel' },
      '/intel': { page: '/intel' },
    }),
  };
} else {
  // MAIN BUILD: Export all pages EXCEPT /intel
  finalConfig = {
    ...baseConfig,
    exportPathMap: async (defaultPathMap: Record<string, { page: string }>) => {
      const allPaths = { ...defaultPathMap };
      // Remove the intel page from the main build
      delete allPaths['/intel'];
      return allPaths;
    },
  };
}

export default finalConfig;