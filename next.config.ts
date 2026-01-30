import type { NextConfig } from 'next';
const CompressionPlugin = require('compression-webpack-plugin');

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
      config.externals = {
        ...config.externals,
        'sharp': 'commonjs sharp',
        'web-push': 'commonjs web-push',
      };
      
      config.resolve.fallback = {
        fs: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
        http: false,
        https: false,
      };
      
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        })
      );
      
      if (!dev) {
        config.optimization = {
          ...config.optimization,
          splitChunks: {
            chunks: 'all',
            minSize: 10000,
            maxSize: 30000, // 30KB MAX
            cacheGroups: {
              default: false,
              vendors: false,
              framework: {
                name: 'framework',
                test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
                priority: 50,
                enforce: true,
              },
              // Add type annotation here to fix the error
              lib: {
                test: /[\\/]node_modules[\\/]/,
                name: (module: { context: string }) => {
                  const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
                  const packageName = match ? match[1] : 'unknown';
                  return `npm.${packageName.replace('@', '').substring(0, 10)}`;
                },
                priority: 40,
                minChunks: 1,
                reuseExistingChunk: true,
              },
            },
          },
          runtimeChunk: 'single',
        };
        
        config.devtool = false;
        
        config.plugins.push(
          new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8,
          })
        );
      }
    }

    if (isServer) {
      config.externals.push('node:crypto', 'node:stream', 'node:util', 'node:events', 'node:buffer');
    }
    
    return config;
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;