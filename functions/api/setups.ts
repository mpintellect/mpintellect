// functions/api/setups.ts

const HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-mz-token",
};

export async function onRequest(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: HEADERS });

  try {
    // 1. TRY ALL CHANNELS FOR THE TOKEN
    const headerAuth = request.headers.get('Authorization') || request.headers.get('authorization');
    const customAuth = request.headers.get('x-mz-token');
    const urlAuth = url.searchParams.get('token');

    let token = "";
    if (headerAuth) token = headerAuth.replace('Bearer ', '').trim();
    else if (customAuth) token = customAuth.trim();
    else if (urlAuth) token = urlAuth.trim();

    if (!token) {
      console.log("❌ Setups API: Still no token. Params:", url.searchParams.toString());
      return new Response(JSON.stringify({ error: "Unauthorized: Token missing" }), { status: 401, headers: HEADERS });
    }

    // 2. FETCH SESSION
    const session: any = await env.DB.prepare("SELECT user_id, expires_at FROM sessions WHERE id = ?").bind(token).first();

    if (!session || new Date(session.expires_at).getTime() < Date.now()) {
      return new Response(JSON.stringify({ error: "Unauthorized: Session invalid" }), { status: 401, headers: HEADERS });
    }

    // 3. GET LOGIC
    if (request.method === "GET") {
      const { results } = await env.DB.prepare("SELECT * FROM setups WHERE user_id = ? ORDER BY created_at DESC").bind(session.user_id).all();
      return new Response(JSON.stringify({ success: true, setups: results }), { status: 200, headers: HEADERS });
    }

    // 4. POST LOGIC
    if (request.method === "POST") {
      const body = await request.json();
      const setupId = crypto.randomUUID();
      const now = new Date().toISOString();
      await env.DB.prepare(`INSERT INTO setups (id, user_id, symbol, entry_price, take_profit, stop_loss, lot_size, capital, risk_reward, status, created_at, generated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`)
        .bind(setupId, session.user_id, body.symbol, body.entry_price, body.take_profit, body.stop_loss, body.lot_size, body.capital, body.risk_reward, now, now).run();
      return new Response(JSON.stringify({ success: true, id: setupId }), { status: 200, headers: HEADERS });
    }

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: HEADERS });
  }
}