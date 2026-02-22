import { AD_SYMBOLS } from "../../../backend-lib/ad-config";

export async function onRequestGet(context: any) {
  const { env } = context;

  // 1. Clear the old list
  await env.DB.prepare("DELETE FROM ad_queue").run();

  const types = ["test", "chat", "update", "volatility"];
  const sizes = ["standard", "square", "portrait"];

  // 2. Fill the list with 144 tasks
  const statements = [];
  for (const sym of AD_SYMBOLS) {
    for (const type of types) {
      const styles = (type === 'test' || type === 'chat') ? ['black', 'cyber'] : ['black'];
      for (const style of styles) {
        for (const size of sizes) {
          statements.push(
            env.DB.prepare("INSERT INTO ad_queue (symbol, type, style, size) VALUES (?, ?, ?, ?)")
              .bind(sym.id, type, style, size)
          );
        }
      }
    }
  }

  // Execute all inserts in one batch
  await env.DB.batch(statements);

  return new Response(`✅ 144 Tasks Created. Cloudflare will now bake them minute-by-minute.`);
}