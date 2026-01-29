import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ensure output: 'standalone' is NOT here.
  
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
  },
  
  // ADD THIS LINE for Next.js 16 compatibility
  turbopack: {},

  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;