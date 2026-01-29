// opennext.config.js
/** @type {import('@opennextjs/cloudflare').CloudflareConfig} */
const config = {
  // Build output directory
  outDir: ".opennext",
  
  // Cloudflare-specific settings
  runtime: "edge",
  compatibilityFlags: ["nodejs_compat"],
  
  // Minify output
  minify: true,
  
  // Cache configuration
  cache: {
    // Enable ISR (Incremental Static Regeneration)
    isr: true,
    // Cache API responses
    api: true,
  },
  
  // Build optimization
  build: {
    // Target browser compatibility
    target: "es2022",
    // Bundle splitting
    splitChunks: true,
  },
  
  // Environment variables to include
  env: {
    // Include all environment variables starting with these prefixes
    include: ["NEXT_PUBLIC_", "CF_", "DB_"],
  },
  
  // Custom headers
  headers: {
    "/**": {
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    "/api/**": {
      "Cache-Control": "no-store, max-age=0",
    },
  },
};

export default config;