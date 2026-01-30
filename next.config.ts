import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
  serverExternalPackages: ['web-push'], 
  turbopack: {},
  
  webpack: (config, { isServer, dev, webpack }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    if (!isServer) {
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
      
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        })
      );
    }

    if (isServer) {
      config.externals.push('node:crypto', 'node:stream', 'node:util', 'node:events', 'node:buffer');
    }
    
    // Optimize for Cloudflare 25MB limit
    if (!isServer && !dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 10000,
          maxSize: 50000, // 50KB max chunks
        },
      };
      
      // Disable source maps
      config.devtool = false;
    }
    
    return config;
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;