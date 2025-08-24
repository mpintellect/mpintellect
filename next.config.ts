import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: [
        'http://localhost:3000',
        'https://mzprimer.com',
      ],
    },
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
        // Existing + full recommended security headers
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        { key: 'Content-Security-Policy', value: "default-src 'self'; img-src 'self' https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'" },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Referrer-Policy', value: 'no-referrer-when-downgrade' },
        { key: 'Permissions-Policy', value: 'geolocation=(), camera=(), microphone=()' },
      ],
    },
  ],
};

export default nextConfig;