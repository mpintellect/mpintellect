import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  typescript: { 
    ignoreBuildErrors: true 
  },
  images: { 
    unoptimized: true 
  },
  // REMOVED: turbopack: {}, // ❌ Turbopack doesn't work with 'output: export'
  
  // ADDED: Disable source maps to reduce bundle size
  productionBrowserSourceMaps: false,
  
  // ADDED: Better optimization for static export
  compress: true,
  
  // ADDED: Optional - for cleaner URLs (remove trailing slashes)
  trailingSlash: false,
  
  // ADDED: Experimental optimizations
  experimental: {
    // Optimize CSS
    optimizeCss: true,
    // Reduce bundle size
    scrollRestoration: true,
  },
  
  webpack: (config: any, { isServer, dev }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    // ADDED: Optimize bundle size for client build
    if (!isServer && !dev) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          maxSize: 244000, // 244KB per chunk (under Cloudflare's 1MB limit)
          minSize: 20000,
        },
      };
      
      // ADDED: Exclude heavy dependencies from client bundle
      config.externals = {
        ...config.externals,
        // Add any heavy server-only dependencies here
      };
    }
    
    return config;
  },
};

export default nextConfig;