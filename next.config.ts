import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
  serverExternalPackages: ['web-push'], 
  
  turbopack: {},
  
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Let Cloudflare handle Node.js modules natively
    if (isServer) {
      config.externals.push('node:crypto', 'node:stream', 'node:util', 'node:buffer', 'node:events');
    } else {
      // On client side, just ignore them
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
      };
    }

    return config;
  },
};

export default nextConfig;