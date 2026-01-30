// next.config.js
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
  serverExternalPackages: ['web-push'], // Correct for Next.js 16
  // Correct way to disable Turbopack in Next.js 16+
  // Remove the experimental.turbo property entirely
  
  // Add empty turbopack config
  turbopack: {},
  
  // Webpack config for Cloudflare
  webpack: (config, { isServer, dev, webpack }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Handle Node.js built-in modules
    if (!isServer) {
      // Provide fallbacks for Node.js built-ins
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        os: false,
        path: false,
        stream: require.resolve('stream-browserify'),
        crypto: require.resolve('crypto-browserify'),
        http: false,
        https: false,
        dns: false,
        dgram: false,
        zlib: false,
        util: false,
        url: false,
        querystring: false,
        assert: false,
        buffer: require.resolve('buffer/'),
      };
      
      // Provide polyfills
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        })
      );
    }

    // Optimize for production
    if (!isServer && !dev) {
      config.devtool = false;
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 200000,
        },
      };
    }

    return config;
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  compress: true,
};

export default nextConfig;