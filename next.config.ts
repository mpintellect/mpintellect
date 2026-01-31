import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 1. Mandatory for Path A
  output: 'export',
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 2. Mandatory for Cloudflare Images (Logos/Hero)
  images: {
    unoptimized: true,
  },
  
  // 3. Mandatory for Next.js 16 to allow Webpack usage
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