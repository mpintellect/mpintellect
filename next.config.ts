import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // 1. Static export for production
  output: isProd ? 'export' : undefined,
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  
  // 2. THE PROXY: Only enabled in development. 
  // In production (Cloudflare), the /functions folder handles /api automatically.
  async rewrites() {
    if (isProd) return []; 
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8788/api/:path*',
      },
    ];
  },
  
  // 3. Webpack configuration (Next.js 16)
  webpack: (config: any) => {
    config.module.rules.push({ test: /\.svg$/, use: ['@svgr/webpack'] });
    return config;
  },
};

export default nextConfig;