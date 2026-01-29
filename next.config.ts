import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  
  turbopack: {},
  
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
    
    // ✅ CRITICAL FIX: Handle Node.js modules for Cloudflare
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        http: false,
        https: false,
        zlib: false,
        os: false,
        path: false,
        child_process: false,
      };
    }
    
    // ✅ Exclude problematic packages from client bundles
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
  
  // ✅ For Cloudflare compatibility
  experimental: {
    esmExternals: 'loose',
  },
  
  // ✅ Important for Cloudflare Pages
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;