import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
  },
  
  turbopack: {},

  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // We only block these on the client side to prevent size issues,
    // but we MUST allow 'firebase' because your hooks use it.
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
      };
      
      // REMOVED 'firebase' from externals so the build can find it
      config.externals = [
        ...(config.externals || []),
        'firebase-admin' 
      ];
    }
    return config;
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;