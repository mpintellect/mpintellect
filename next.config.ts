// next.config.js or next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true }, // Required for Cloudflare Pages
  productionBrowserSourceMaps: false,
  serverExternalPackages: ['web-push'], 
  turbopack: {},
  
  // Remove output: 'export' if present (not compatible with APIs)
  
  webpack: (config: any, { isServer, dev, webpack }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    if (!isServer) {
      // Client-side polyfills for Cloudflare
      config.resolve.fallback = {
        fs: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
      };
      
      // Provide polyfills
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        })
      );
    }

    if (isServer) {
      // This allows Cloudflare to provide these modules natively
      config.externals.push('node:crypto', 'node:stream', 'node:util', 'node:events', 'node:buffer');
    }
    
    // Optimize for Cloudflare 25MB limit
    if (!isServer && !dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxSize: 200000, // 200KB chunks
        },
      };
    }
    
    return config;
  },
};

export default nextConfig;