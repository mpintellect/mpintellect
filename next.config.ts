import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
  serverExternalPackages: ['web-push'], 
  turbopack: {},
  webpack: (config: any, { isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    if (isServer) {
      // This allows Cloudflare to provide these modules natively
      config.externals.push('node:crypto', 'node:stream', 'node:util', 'node:events', 'node:buffer');
    }
    return config;
  },
};

export default nextConfig;