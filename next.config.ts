// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ESLint configuration is in .eslintrc.json - DO NOT include here
  
  typescript: {
    ignoreBuildErrors: true,
  },

  // CRITICAL: This creates a self-contained build without external symlinks
  output: 'standalone',
  
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: [
        'http://localhost:3000',
        'https://mzprimer.com',
      ],
    },
    // Disable features that create symlinks
    disableOptimizedLoading: true,
    // Remove invalid property
    // staticWorkerRequestDeduping: false, // Remove this line
  },

  // IMPORTANT: Remove or comment out edge runtime from pages that don't need it
  // Check your pages for: export const runtime = 'edge';
  // Only keep it on API routes that truly need edge runtime

  serverExternalPackages: ['bufferutil', 'utf-8-validate'],

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.postimg.cc' },
      { protocol: 'https', hostname: 'mzprimer.com' },
    ],
    // Disable image optimization for Cloudflare compatibility
    unoptimized: true,
  },

  headers: async () => {
    const headers = [
      {
        source: '/logos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable, stale-while-revalidate=86400'
          },
          {
            key: 'CDN-Cache-Control',
            value: 'max-age=31536000'
          }
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self' data: blob: https:; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; " +
              "style-src 'self' 'unsafe-inline' https:; " +
              "img-src 'self' data: blob: https:; " +
              "frame-src https://s.tradingview.com https://www.tradingview.com https://mzprimer.com https://i.postimg.cc; " +
              "connect-src *;",
          },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), camera=(), microphone=(), usb=(), payment=()',
          },
        ],
      },
    ];
    
    return headers;
  },

  webpack: (config, { isServer, dev }) => {
    // DISABLE SYMLINKS - This is crucial for Cloudflare Pages
    config.resolve.symlinks = false;
    
    // Disable symlink following in loaders
    if (config.module?.rules) {
      config.module.rules.forEach((rule: any) => {
        if (rule.resolve && rule.resolve.symlinks !== undefined) {
          rule.resolve.symlinks = false;
        }
      });
    }
    
    // Optimize build output for Cloudflare
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 20, // Reduced for Cloudflare compatibility
        minSize: 10000, // Increased minimum size
        cacheGroups: {
          default: false,
          vendors: false,
          // Create separate chunks
          framework: {
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            priority: 40,
            reuseExistingChunk: true,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name: (module: { context: string }) => {
              const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
              return match ? `npm.${match[1].replace('@', '')}` : null;
            },
            priority: 30,
            reuseExistingChunk: true,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
        },
      },
    };
    
    // Disable source maps in production for smaller output
    if (!dev) {
      config.devtool = false;
    }
    
    return config;
  },
  
  // Enable compression
  compress: true,
  
  // Production optimizations
  poweredByHeader: false,
  generateEtags: true,
  
  // Additional settings to prevent symlink issues
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;