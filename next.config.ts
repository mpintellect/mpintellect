import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone', // ← This is important
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;