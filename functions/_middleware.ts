export const onRequest = async (context: any) => {
  const { request, next } = context;
  const url = new URL(request.url);
  const hostname = request.headers.get("host") || "";

  // If visiting intel.mzprimer.com
  if (hostname.startsWith("intel.")) {
    // If they are at the homepage of the subdomain
    if (url.pathname === "/" || url.pathname === "") {
      // Show them the IT services page instead
      const newUrl = new URL("/intel-services", url.origin);
      return next(new Request(newUrl.toString(), request));
    }
  }

  return next();
};