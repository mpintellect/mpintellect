// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: [
        'http://localhost:3000',
        'https://mzprimer.com'
      ]
    }
  },
  serverExternalPackages: ['bufferutil', 'utf-8-validate'],
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { 
          key: 'X-Content-Type-Options', 
          value: 'nosniff' 
        }
      ]
    }
  ]
}

export default nextConfig