/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESLint config is no longer supported here in Next 16.
  // Use .eslintrc.* instead if you need custom lint rules.

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
      },
    ],
  },
};

export default nextConfig;