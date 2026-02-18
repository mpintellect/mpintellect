// functions/api/download-robot.ts

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId) return new Response("Forbidden: Missing Session ID", { status: 403 });

  try {
    // 1. Check D1 Database: Did this user actually pay for this session?
    const purchase: any = await env.DB.prepare(
      "SELECT status, price_id FROM stripe_purchases WHERE stripe_session_id = ?"
    ).bind(sessionId).first();

    // 2. Security Check: Block if not paid or wrong product
    const SCALPER_PRICE_ID = "price_1T2EdfDoB4i1qeaLM647it0F";
    
    if (!purchase || purchase.status !== 'completed' || purchase.price_id !== SCALPER_PRICE_ID) {
      return new Response("Access Denied: Invalid Purchase", { status: 401 });
    }

    // 3. Fetch from Private R2 Bucket
    const file = await env.VAULT.get("MZPrimer_Scalper_X1_V.1.ex5");

    if (!file) return new Response("File Not Found", { status: 404 });

    // 4. Stream the file directly to the browser
    const headers = new Headers();
    file.writeHttpMetadata(headers);
    headers.set("Content-Type", "application/octet-stream");
    headers.set("Content-Disposition", 'attachment; filename="MZPrimer_Scalper_X1_V.1.ex5"');

    return new Response(file.body, { headers });

  } catch (e: any) {
    return new Response("Server Error: " + e.message, { status: 500 });
  }
}