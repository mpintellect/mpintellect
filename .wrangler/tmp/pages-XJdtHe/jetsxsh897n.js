// <define:__ROUTES__>
var define_ROUTES_default = {
  version: 1,
  include: ["/*"],
  exclude: ["/_next/static/*"]
};

// node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "/Users/mezganimez/Downloads/mzprimer/mzprimer-nextjs-v1 /.wrangler/tmp/pages-XJdtHe/functionsWorker-0.39497630689153085.mjs";
import { isRoutingRuleMatch } from "/Users/mezganimez/Downloads/mzprimer/mzprimer-nextjs-v1 /node_modules/wrangler/templates/pages-dev-util.ts";
export * from "/Users/mezganimez/Downloads/mzprimer/mzprimer-nextjs-v1 /.wrangler/tmp/pages-XJdtHe/functionsWorker-0.39497630689153085.mjs";
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = worker;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_dev_pipeline_default as default
};
//# sourceMappingURL=jetsxsh897n.js.map
