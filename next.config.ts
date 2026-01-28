// next.config.js
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  
  // Add empty Turbopack config
  turbopack: {},
  
  // Base path configuration
  basePath: '', // Keep empty for root domain
  
  // Image configuration
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
  },
  
  // Asset prefix configuration
  assetPrefix: '', // Empty for root
  
  // Webpack configuration for SVG support
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [{
        loader: '@svgr/webpack',
        options: {
          svgo: true,
          svgoConfig: {
            plugins: [{
              name: 'preset-default',
              params: {
                overrides: {
                  // Disable removeViewBox to preserve SVG scaling
                  removeViewBox: false,
                },
              },
            }],
          },
        },
      }],
    });
    
    return config;
  },
  
  productionBrowserSourceMaps: false,
};

export default nextConfig;