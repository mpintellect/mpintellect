// next.config.js
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true }, // Required for Cloudflare
  productionBrowserSourceMaps: false,
  
  
  // Webpack config for Cloudflare
  webpack: (config, { isServer, dev }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    if (!isServer && !dev) {
      config.devtool = false;
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 200000, // 200KB max per chunk
        },
      };
    }

    // Cloudflare compatibility
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        os: false,
        path: false,
        stream: false,
        crypto: false,
        http: false,
        https: false,
        dns: false,
        dgram: false,
      };
    }

    return config;
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  compress: true,
};

export default nextConfig;