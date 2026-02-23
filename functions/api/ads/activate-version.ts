// functions/api/ads/activate-version.ts
export async function onRequestGet(context: any) {
  const { env, request } = context;
  if (new URL(request.url).searchParams.get("key") !== env.ADMIN_KEY) return new Response("Unauthorized", { status: 401 });

  const version = Math.floor(Date.now() / (12 * 3600000));
  await env.DB.prepare("INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)")
    .bind('current_ad_version', version.toString())
    .run();

  return new Response(`Activated v${version}`);
}