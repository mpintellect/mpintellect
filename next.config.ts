import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Only use export for production builds
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  
  typescript: { ignoreBuildErrors: true },
  
  images: {
    unoptimized: true,
    qualities: [75, 85], // Fixes your mzlogo.webp warning
  },

  turbopack: {},
  webpack: (config: any) => {
    config.module.rules.push({ test: /\.svg$/, use: ['@svgr/webpack'] });
    return config;
  },
};

export default nextConfig;