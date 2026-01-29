import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // 1. REMOVE output: 'standalone' <--- DELETE THIS LINE
  
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: true, // Keep this for logos
  },

  webpack: (config, { isServer }) => {
    // Handle SVG support
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    // Fix for Firebase-admin remaining in code
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
      };
    }
    return config;
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;