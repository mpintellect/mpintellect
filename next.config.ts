import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  
  // Remove turbopack config entirely
  // turbopack: {}, // DELETE THIS LINE
  
  basePath: '',
  
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
  },
  
  assetPrefix: '',
  
  webpack: (config, { isServer }) => {
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
    
    return config;
  },
  
  productionBrowserSourceMaps: false,
  
  // Remove problematic experimental config
  // experimental: {
  //   esmExternals: 'loose', // This breaks Turbopack
  // },
};

export default nextConfig;