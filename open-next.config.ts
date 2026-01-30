import type { OpenNextConfig } from "@opennextjs/cloudflare";

const config = {
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
    external: false, // Keeps middleware bundled to prevent ENOENT bug
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
    },
  },
} as any; 

export default config;