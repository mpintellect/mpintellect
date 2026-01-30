// next.config.js
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // REMOVE turbopack for OpenNext compatibility
  // turbopack: {},
  webpack: (config, { isServer, dev }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Fix for "Module not found" errors in Cloudflare
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
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
        zlib: false,
        buffer: false,
        util: false,
        url: false,
        assert: false,
      };
    }

    // For OpenNext, we need to handle certain modules differently
    if (isServer && !dev) {
      config.externals.push({
        'node:worker_threads': 'commonjs node:worker_threads',
        'node:child_process': 'commonjs node:child_process',
        'node:fs': 'commonjs node:fs',
        'node:path': 'commonjs node:path',
        'node:os': 'commonjs node:os',
        'node:net': 'commonjs node:net',
        'node:tls': 'commonjs node:tls',
      });
    }

    return config;
  },
  productionBrowserSourceMaps: false,
  // Enable experimental features for OpenNext
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;