// functions/api/ads/warmup.ts
export async function onRequestGet(context: any) {
  const { env, request } = context;
  const url = new URL(request.url);
  
  if (url.searchParams.get("key") !== env.ADMIN_KEY) return new Response("Unauthorized", { status: 401 });

  const symbol = url.searchParams.get("symbol");
  const style = url.searchParams.get("style");
  const type = url.searchParams.get("type");
  const size = url.searchParams.get("size");

  if (!symbol || !style || !type || !size) return new Response("Missing params", { status: 400 });

  // ✅ INTERNAL MATH: Cloudflare calculates the version itself
  const version = Math.floor(Date.now() / (12 * 3600000));

  const renderUrl = `${url.origin}/api/ads/render?symbol=${symbol}&style=${style}&type=${type}&size=${size}&v=${version}`;
  
  // Trigger the render
  const res = await fetch(renderUrl);
  
  return new Response(`Baked v${version}: ${symbol}-${type}`);
}