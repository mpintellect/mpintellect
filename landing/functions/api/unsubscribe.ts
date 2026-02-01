// functions/api/newsletter/unsubscribe.ts (Move from app/api/newsletter/unsubscribe/route.ts)

import { execute } from '../../landing/backend-lib/db-simple';

/**
 * POST: Handles unsubscribe requests via API/Form
 */
export async function onRequestPost(context: any) {
  const { request } = context;

  try {
    const { email, reason } = await request.json();
    
    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const now = Date.now();
    
    // Update D1 Database
    const result = await execute(
      `UPDATE newsletter_subscribers 
       SET status = 'unsubscribed', updated_at = ?, unsubscribed_at = ?, unsubscribe_reason = ?
       WHERE email = ?`,
      [now, now, reason || 'user_request', normalizedEmail]
    );

    if (result.success) {
      console.log(`📭 Subscriber unsubscribed: ${normalizedEmail}`);
      return Response.json({ 
        success: true, 
        message: 'You have been unsubscribed successfully.',
        timestamp: new Date().toISOString()
      });
    } else {
      return Response.json({ error: 'Subscriber not found' }, { status: 404 });
    }

  } catch (error: any) {
    console.error('❌ Unsubscribe error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET: Handles unsubscribe requests via email links
 */
export async function onRequestGet(context: any) {
  const { request } = context;
  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  
  // Use absolute URLs for redirects in Cloudflare
  const origin = url.origin;
  
  if (!email) {
    return Response.redirect(`${origin}/faq`, 302);
  }
  
  try {
    // Mark as unsubscribed in D1 SQL
    const result = await execute(
      `UPDATE newsletter_subscribers 
       SET status = 'unsubscribed', updated_at = ?, unsubscribed_at = ?, unsubscribe_reason = ?
       WHERE email = ?`,
      [Date.now(), Date.now(), 'link_click', email.toLowerCase().trim()]
    );
    
    if (result.success) {
      // Redirect to a static "success" page
      return Response.redirect(`${origin}/legal`, 302);
    } else {
      return Response.redirect(`${origin}/faq`, 302);
    }
  } catch (err) {
    return Response.redirect(`${origin}/faq`, 302);
  }
}