// functions/_middleware.ts

/**
 * MZ Intelligence Subdomain Router
 * Handles traffic for intel.mzprimer.com
 */
export const onRequest = async (context: any) => {
  const { request, next } = context;
  const url = new URL(request.url);
  const hostname = request.headers.get("host") || "";

  // 1. Check if the visitor is using the 'intel' subdomain
  // This supports both 'intel.mzprimer.com' and the preview URLs
  if (hostname.startsWith("intel.")) {
    
    // 2. If they are at the root, show the IT services page
    if (url.pathname === "/" || url.pathname === "") {
      console.log("🏛️ Routing subdomain request to /intel-services");
      
      // We rewrite the internal path to our new landing page
      const newUrl = new URL("/intel-services", url.origin);
      return next(new Request(newUrl.toString(), request));
    }
  }

  // 3. Otherwise, continue to the normal website
  return next();
};