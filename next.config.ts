import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 1. Mandatory for Native Cloudflare (Path A)
  output: 'export',
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 2. Mandatory for Logos/Hero images
  images: {
    unoptimized: true,
  },
  
  // 3. Mandatory for Next.js 16 to allow Webpack engine
  turbopack: {},

  webpack: (config: any) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  
  productionBrowserSourceMaps: false,
};

export default nextConfig;