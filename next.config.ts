// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: [
        'http://localhost:3000',
        'https://mzprimer.com',
      ],
    },
    // Optional: disable legacy browsers
    // legacyBrowsers: false,
  },

  serverExternalPackages: ['bufferutil', 'utf-8-validate'],

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.postimg.cc' },
      { protocol: 'https', hostname: 'mzprimer.com' },
    ],
  },

  headers: async () => [
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
  ],

  webpack: (config) => {
    // Fixes: Warning: No serializer registered
    config.cache = { type: 'memory' };
    return config;
  },
};

export default nextConfig;