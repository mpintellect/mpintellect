import { AD_SYMBOLS } from "../../../backend-lib/ad-config";

export async function onRequestGet(context: any) {
  const { env, request } = context;
  const url = new URL(request.url);

  // 🛡️ Security: Only the scheduler can trigger this
  if (url.searchParams.get("key") !== env.ADMIN_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  await env.DB.prepare("DELETE FROM ad_queue").run();

  const symbols = ["EURUSD", "XAUUSD", "BTCUSD", "ETHUSD", "BRENT"];
  const types = ["test", "update", "chat"];
  const sizes = ["standard", "square", "portrait"];
  const statements = [];

  for (const sym of symbols) {
    for (const type of types) {
      const style = (type === 'chat') ? 'cyber' : 'black';
      for (const size of sizes) {
        statements.push(
          env.DB.prepare("INSERT INTO ad_queue (symbol, type, style, size, status) VALUES (?, ?, ?, ?, 'pending')")
            .bind(sym, type, style, size)
        );
      }
    }
  }
  await env.DB.batch(statements);
  return new Response("✅ Queue Refilled");
}