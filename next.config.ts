import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  
  basePath: '',
  
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
  },
  
  assetPrefix: '',
  
  webpack: (config, { isServer, dev }) => {
    // Handle SVG support
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
                  removeViewBox: false,
                },
              },
            }],
          },
        },
      }],
    });
    
    // Handle Node.js modules for Cloudflare
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        os: false,
        path: false,
        child_process: false,
      };
    }
    
    // Exclude problematic packages from client bundles
    if (!isServer) {
      config.externals = [
        ...(config.externals || []),
        'web-push',
        'firebase',
        'firebase-admin'
      ];
    }
    
    return config;
  },
  
  productionBrowserSourceMaps: false,
  
  // Remove experimental.turbo entirely - just don't use Turbopack
  // To disable Turbopack, use --no-turbopack flag in build command
};

export default nextConfig;