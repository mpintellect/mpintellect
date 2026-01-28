import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // REMOVE THIS LINE: output: 'standalone',
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,
  turbopack: {},
  webpack: (config, { dev }) => {
    if (!dev) {
      config.devtool = false;
    }
    return config;
  },
};

export default nextConfig;