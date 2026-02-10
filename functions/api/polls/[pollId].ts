// functions/api/polls/[pollId].ts

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export async function onRequest(context: any) {
  const { request, env, params } = context;
  const pollId = params.pollId;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: HEADERS });
  }

  try {
    // 1. Fetch poll from D1
    const poll: any = await env.DB.prepare("SELECT * FROM market_polls WHERE id = ?")
      .bind(pollId)
      .first();

    // 2. Map SQL columns to the JSON structure your UI expects
    // We return zeros if the poll isn't in the database yet
    const responseData = {
      success: true,
      poll: {
        id: pollId,
        votes: {
          low: poll?.votes_low || 0,
          medium: poll?.votes_medium || 0,
          high: poll?.votes_high || 0
        },
        total_votes: poll?.total_votes || 0,
        question: poll?.question || "",
        symbol: poll?.symbol || "",
        category: poll?.category || ""
      }
    };

    return new Response(JSON.stringify(responseData), { status: 200, headers: HEADERS });

  } catch (error: any) {
    console.error("GET Poll Error:", error.message);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: HEADERS });
  }
}