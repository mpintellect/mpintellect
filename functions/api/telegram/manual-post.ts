// functions/api/telegram/manual-post.ts

export async function onRequestPost(context: any): Promise<Response> {
  const { request, env } = context;
  
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${env.ADMIN_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const body = await request.json();
  const symbol = body.symbol;
  
  if (!symbol) {
    return new Response(JSON.stringify({ error: 'Symbol required' }), { status: 400 });
  }
  
  // Forward to smart-post with forced symbol
  const postRes = await fetch(`${env.API_URL}/api/telegram/smart-post`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.ADMIN_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ symbol }),
  });
  
  const result = await postRes.json();
  
  return new Response(JSON.stringify(result), { status: 200 });
}