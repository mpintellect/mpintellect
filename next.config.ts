import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // We remove 'standalone' because Cloudflare Pages manages its own bundling
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,
  // Explicitly disable source maps for webpack builds
  webpack: (config, { dev }) => {
    if (!dev) {
      config.devtool = false;
    }
    return config;
  },
};

export default nextConfig;