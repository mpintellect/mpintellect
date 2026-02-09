// functions/api/polls/[pollId].ts

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: HEADERS });
}

export async function onRequest(context: any) {
  const { request, env, params } = context;
  const pollId = params.pollId;

  // --- GET LOGIC (Fetch Stats) ---
  if (request.method === "GET") {
    try {
      const poll: any = await env.DB.prepare("SELECT * FROM market_polls WHERE id = ?").bind(pollId).first();
      const stats = poll ? {
        low: poll.votes_low || 0,
        medium: poll.votes_medium || 0,
        high: poll.votes_high || 0,
        total: poll.total_votes || 0
      } : { low: 0, medium: 0, high: 0, total: 0 };

      return new Response(JSON.stringify({ success: true, poll: stats }), { headers: HEADERS });
    } catch (e) {
      return new Response(JSON.stringify({ success: true, poll: { low: 0, medium: 0, high: 0, total: 0 } }), { headers: HEADERS });
    }
  }

  // --- POST LOGIC (Submit Vote) ---
  if (request.method === "POST") {
    try {
      const { vote, userId, userName } = await request.json();
      const authHeader = request.headers.get('Authorization') || "";
      const token = authHeader.replace('Bearer ', '');

      // 1. Verify Session
      const session = await env.DB.prepare("SELECT user_id FROM sessions WHERE id = ?").bind(token).first();
      if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: HEADERS });

      // 2. Check if voted
      const existing = await env.DB.prepare("SELECT id FROM poll_votes WHERE poll_id = ? AND user_id = ?").bind(pollId, userId).first();
      if (existing) return new Response(JSON.stringify({ success: false, error: "Already voted" }), { status: 200, headers: HEADERS });

      // 3. Atomic Update (The "Master Stroke")
      const voteCol = vote === 'high' ? 'votes_high' : vote === 'medium' ? 'votes_medium' : 'votes_low';
      
      // Ensure poll exists then update in one batch
      await env.DB.batch([
        env.DB.prepare("INSERT OR IGNORE INTO market_polls (id, created_at, updated_at) VALUES (?, datetime('now'), datetime('now'))").bind(pollId),
        env.DB.prepare(`UPDATE market_polls SET ${voteCol} = ${voteCol} + 1, total_votes = total_votes + 1, updated_at = datetime('now') WHERE id = ?`).bind(pollId),
        env.DB.prepare("INSERT INTO poll_votes (id, poll_id, user_id, user_name, vote, voted_at) VALUES (?, ?, ?, ?, ?, datetime('now'))").bind(crypto.randomUUID(), pollId, userId, userName || 'User', vote)
      ]);

      // 4. Return NEW stats immediately
      const updated: any = await env.DB.prepare("SELECT * FROM market_polls WHERE id = ?").bind(pollId).first();
      
      return new Response(JSON.stringify({ 
        success: true, 
        poll: { low: updated.votes_low, medium: updated.votes_medium, high: updated.votes_high, total: updated.total_votes } 
      }), { headers: HEADERS });

    } catch (error: any) {
      console.error("Vote Error:", error.message);
      return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: HEADERS });
    }
  }
}