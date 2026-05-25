// next.config.intel.mjs
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  
  // ONLY export the intel page and homepage (redirect to intel)
  exportPathMap: async function () {
    return {
      '/': { page: '/intel' },
      '/intel': { page: '/intel' },
    };
  },
};

export default nextConfig;