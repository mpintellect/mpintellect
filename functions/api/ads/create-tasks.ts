// functions/api/ads/create-tasks.ts
export async function onRequestGet(context: any) {
  const { env } = context;
  await env.DB.prepare("DELETE FROM ad_queue").run();

  const symbols = ["EURUSD", "XAUUSD", "BTCUSD", "ETHUSD", "BRENT"];
  const types = ["test", "update", "chat"];
  const sizes = ["standard", "square", "portrait"];
  const statements = [];

  for (const sym of symbols) {
    for (const type of types) {
      // ✅ STYLE LOGIC: chat gets cyber, others get black. No duplicates.
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
  return new Response(`✅ Queue Created: 45 individual images scheduled.`);
}