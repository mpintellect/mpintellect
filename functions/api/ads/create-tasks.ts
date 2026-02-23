// functions/api/ads/create-tasks.ts
export async function onRequestGet(context: any) {
  const { env } = context;
  await env.DB.prepare("DELETE FROM ad_queue").run();

  const types = ["test", "update", "chat"];
  const symbols = ["EURUSD", "XAUUSD", "BTCUSD", "ETHUSD", "USTEC", "BRENT"];
  const statements = [];

  for (const sym of symbols) {
    for (const type of types) {
      const styles = (type === 'chat') ? ['black', 'cyber'] : ['black'];
      for (const style of styles) {
        statements.push(
          env.DB.prepare("INSERT INTO ad_queue (symbol, type, style, status) VALUES (?, ?, ?, 'pending')")
            .bind(sym, type, style)
        );
      }
    }
  }
  await env.DB.batch(statements);
  return new Response("✅ Queue Ready: 24 Batches (72 images total).");
}