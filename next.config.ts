import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 1. Static export for production, normal server for dev
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  
  // 2. THE PROXY: This connects your UI (3000) to your Database (8788)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8788/api/:path*',
      },
    ];
  },
  
  // 3. Next.js 16 requirements
  turbopack: {},
  webpack: (config: any) => {
    config.module.rules.push({ test: /\.svg$/, use: ['@svgr/webpack'] });
    return config;
  },
};

export default nextConfig;