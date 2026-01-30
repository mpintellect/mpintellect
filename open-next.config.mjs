/** @type {import('@opennextjs/cloudflare').OpenNextConfig} */
export default {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
  edgeExternals: ["node:crypto"],
  middleware: {
    // FIX: Setting this to false bundles middleware with the main app
    // This stops the ENOENT "file not found" crash
    external: false, 
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
    },
  },
};