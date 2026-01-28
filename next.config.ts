import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'export', // ← This is the key
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,
  // Remove turbopack config if you have it
};

export default nextConfig;