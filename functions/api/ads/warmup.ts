export async function onRequestGet(context: any) {
  const { env, request } = context;
  const url = new URL(request.url);
  
  if (url.searchParams.get("key") !== env.ADMIN_KEY) return new Response("Unauthorized", { status: 401 });

  const symbol = url.searchParams.get("symbol");
  const style = url.searchParams.get("style");
  const type = url.searchParams.get("type");
  const size = url.searchParams.get("size");

  if (!symbol || !style || !type || !size) return new Response("Missing params", { status: 400 });

  const version = Math.floor(Date.now() / (12 * 3600000));
  const renderUrl = `${url.origin}/api/ads/render?symbol=${symbol}&style=${style}&type=${type}&size=${size}&v=${version}`;
  
  // ⏱️ SYNC CALL: Wait for the image to be saved in R2
  const res = await fetch(renderUrl);
  if (!res.ok) return new Response(`Fail: ${symbol}`, { status: 500 });

  return new Response(`OK: ${symbol}-${type} v${version}`);
}