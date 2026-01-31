// _worker.js - OpenNext entry point
import { createRequestHandler } from "@opennextjs/cloudflare/next";

// Create the request handler
const handleRequest = createRequestHandler({
  // OpenNext will automatically configure this
  buildId: context.env.BUILD_ID || "next-build",
  // You can add custom middleware or configuration here
});

// Cloudflare Worker export
export default {
  fetch: handleRequest,
  
  // Optional: For scheduled tasks
  // scheduled: async (event, env, ctx) => {
  //   // Handle scheduled events
  // },
};