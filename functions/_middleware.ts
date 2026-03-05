// functions/_middleware.ts
export const onRequest = async (context: any) => {
  const { request, next } = context;
  const url = new URL(request.url);
  const hostname = request.headers.get("host") || "";

  // Map intel.mzprimer.com to the NEW /intel page
  if (hostname.startsWith("intel.")) {
    if (url.pathname === "/" || url.pathname === "") {
      // Rewrite to the new internal path
      const newUrl = new URL("/intel", request.url);
      return context.env.ASSETS.fetch(new Request(newUrl, request));
    }
  }

  return next();
};