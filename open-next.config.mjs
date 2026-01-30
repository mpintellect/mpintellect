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
  // We disable the separate middleware bundle to fix the ENOENT bug
  // The middleware will still run inside the main worker
  middleware: {
    external: false, 
  },
};