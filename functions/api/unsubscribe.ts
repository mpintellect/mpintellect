// functions/api/newsletter/unsubscribe.ts

// Helper function for CORS headers
const HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * OPTIONS: Handle CORS preflight
 */
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: HEADERS
  });
}

/**
 * POST: Handles unsubscribe requests via API/Form
 */
export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const { email, reason } = await request.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }), 
        { status: 400, headers: HEADERS }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const now = Date.now();
    
    // Check if subscriber exists first
    const existing = await env.DB.prepare(
      'SELECT id FROM newsletter_subscribers WHERE email = ?'
    ).bind(normalizedEmail).first();

    if (!existing) {
      return new Response(
        JSON.stringify({ error: 'Subscriber not found' }), 
        { status: 404, headers: HEADERS }
      );
    }
    
    // Update D1 Database
    const result = await env.DB.prepare(
      `UPDATE newsletter_subscribers 
       SET status = 'unsubscribed', updated_at = ?, unsubscribed_at = ?, unsubscribe_reason = ?
       WHERE email = ?`
    ).bind(
      now, 
      now, 
      reason || 'user_request', 
      normalizedEmail
    ).run();

    if (result.success) {
      console.log(`📭 Subscriber unsubscribed: ${normalizedEmail}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'You have been unsubscribed successfully.',
          timestamp: new Date().toISOString()
        }),
        { status: 200, headers: HEADERS }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Failed to unsubscribe' }), 
        { status: 500, headers: HEADERS }
      );
    }

  } catch (error: any) {
    console.error('❌ Unsubscribe error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: HEADERS }
    );
  }
}

/**
 * GET: Handles unsubscribe requests via email links
 */
export async function onRequestGet(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  
  // Use absolute URLs for redirects in Cloudflare
  const origin = url.origin;
  
  if (!email) {
    return Response.redirect(`${origin}/faq`, 302);
  }
  
  try {
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if subscriber exists
    const existing = await env.DB.prepare(
      'SELECT id FROM newsletter_subscribers WHERE email = ?'
    ).bind(normalizedEmail).first();
    
    if (!existing) {
      console.log(`⚠️ Unsubscribe attempt for non-existent email: ${normalizedEmail}`);
      return Response.redirect(`${origin}/legal`, 302); // Redirect anyway to avoid email enumeration
    }
    
    // Mark as unsubscribed in D1 SQL
    const result = await env.DB.prepare(
      `UPDATE newsletter_subscribers 
       SET status = 'unsubscribed', updated_at = ?, unsubscribed_at = ?, unsubscribe_reason = ?
       WHERE email = ?`
    ).bind(
      Date.now(), 
      Date.now(), 
      'link_click', 
      normalizedEmail
    ).run();
    
    if (result.success) {
      console.log(`📭 Subscriber unsubscribed via link: ${normalizedEmail}`);
      // Redirect to a static "success" page
      return Response.redirect(`${origin}/legal`, 302);
    } else {
      return Response.redirect(`${origin}/faq`, 302);
    }
  } catch (err) {
    console.error('❌ Unsubscribe GET error:', err);
    return Response.redirect(`${origin}/faq`, 302);
  }
}