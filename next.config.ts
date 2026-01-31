import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 1. SET OUTPUT TO EXPORT
  output: 'export',
  
  typescript: { ignoreBuildErrors: true },
  
  // 2. IMAGES MUST BE UNOPTIMIZED FOR STATIC EXPORT
  images: {
    unoptimized: true,
  },

  // 3. Keep your SVGR logic
  webpack(config: any) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;