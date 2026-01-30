import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  output: 'export', // ← ADD THIS LINE
  webpack: (config, { isServer }) => {
    config.module.rules.push({ test: /\.svg$/, use: ['@svgr/webpack'] });
    if (!isServer) {
      config.resolve.fallback = { fs: false, net: false, tls: false, child_process: false, os: false, path: false, stream: false, crypto: false, http: false, https: false };
    }
    return config;
  },
  productionBrowserSourceMaps: false,
  serverExternalPackages: [],
};

export default nextConfig;