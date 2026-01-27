import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,
  
  webpack: (config, { isServer, dev }) => {
    // Disable source maps completely
    if (!dev) {
      config.devtool = false;
    }
    
    // Split chunks to reduce size
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        maxSize: 200000, // 200KB max chunk size
        minSize: 10000,
      },
    };
    
    return config;
  },
};

export default nextConfig;