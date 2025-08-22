// next.config.ts
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
      // allow postimg host used in BlogSection
      { protocol: 'https', hostname: 'i.postimg.cc' },
      // (optional) allow your own domain if you’ll serve images there
      { protocol: 'https', hostname: 'mzprimer.com' },
      // add more hosts as needed
      // { protocol: 'https', hostname: 'your-cdn-or-domain.com' },
    ],
  },

  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
      ],
    },
  ],
};

export default nextConfig;