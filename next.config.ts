import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
  // Correct key for Next.js 16
  serverExternalPackages: ['web-push'], 
  
  turbopack: {},
  webpack: (config: any, { isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    if (isServer) {
      // Mark node modules as external for Cloudflare nodejs_compat
      config.externals.push('node:crypto', 'node:stream', 'node:util', 'node:events', 'node:buffer');
    }
    return config;
  },
};

export default nextConfig;