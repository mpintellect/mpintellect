import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // 1. Remove output: 'standalone' (Cloudflare Pages doesn't need it)
  
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,
  
  // 2. Webpack config will only work if you build without the --turbo flag
  webpack: (config, { isServer, dev }) => {
    if (!dev) {
      // Disable source maps
      config.devtool = false;
      
      // Split chunks more aggressively to stay under 25MB
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxSize: 15000000, // 15MB limit to be safe
          minSize: 10000,
        },
      };
    }
    return config;
  },
};

export default nextConfig;