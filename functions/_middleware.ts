// functions/_middleware.ts - Cloudflare Pages Functions Middleware

export async function onRequest(context: any) {
  const { request, next } = context;

  // Handle preflight OPTIONS requests for API
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-mz-token",
        "Access-Control-Max-Age": "86400"
      }
    });
  }

  // Pass request to next handler
  const response = await next();

  // Add CORS headers to response if it's an API route
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/")) {
    const newHeaders = new Headers(response.headers);
    if (!newHeaders.has("Access-Control-Allow-Origin")) {
      newHeaders.set("Access-Control-Allow-Origin", "*");
    }
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }

  return response;
}