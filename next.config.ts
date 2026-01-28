import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  
  // ADD THIS:
  basePath: '', // Keep empty for root domain
  
  images: {
    unoptimized: true,
  },
  
  // ADD THIS to fix asset paths:
  assetPrefix: '', // Empty for root
  
  productionBrowserSourceMaps: false,
};

export default nextConfig;