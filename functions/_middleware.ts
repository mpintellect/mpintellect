export const onRequest = async (context: any) => {
  const { request, next } = context;
  const url = new URL(request.url);
  const hostname = request.headers.get("host") || "";

  // Map intel.mzprimer.com to the /intel folder
  if (hostname.startsWith("intel.")) {
    if (url.pathname === "/" || url.pathname === "") {
      const newUrl = new URL("/intel", url.origin);
      return next(new Request(newUrl.toString(), request));
    }
  }

  return next();
};