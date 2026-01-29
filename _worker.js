// _worker.js - REQUIRED for @cloudflare/next-on-pages
import { createPagesRoute } from "@cloudflare/next-on-pages/next-dev";

const { onRequest } = createPagesRoute();

export { onRequest };