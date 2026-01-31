import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Mandatory
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true }, // Mandatory
  turbopack: {}, // Prevents the engine crash
  webpack: (config: any) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;