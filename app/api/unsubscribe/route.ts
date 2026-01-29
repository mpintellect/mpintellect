// app/api/newsletter/unsubscribe/route.ts
import { NextResponse } from 'next/server';
import { getDb, execute } from '@/app/lib/cloudflare/db-simple';

export async function POST(request: Request) {
  try {
    const { email, reason } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const now = Date.now();
    
    const result = await execute(
      `UPDATE newsletter_subscribers 
       SET status = 'unsubscribed', updated_at = ?, unsubscribed_at = ?, unsubscribe_reason = ?
       WHERE email = ?`,
      [now, now, reason || 'user_request', normalizedEmail]
    );

    if (result.success) {
      console.log(`📭 Subscriber unsubscribed: ${normalizedEmail}`);
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'You have been unsubscribed successfully.',
          timestamp: new Date().toISOString()
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      );
    }

  } catch (error: any) {
    console.error('❌ Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Also support GET for unsubscribe links
export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  
  if (!email) {
    return NextResponse.redirect(new URL('/newsletter/unsubscribe-error', request.url));
  }
  
  // Mark as unsubscribed
  const result = await execute(
    `UPDATE newsletter_subscribers 
     SET status = 'unsubscribed', updated_at = ?, unsubscribed_at = ?, unsubscribe_reason = ?
     WHERE email = ?`,
    [Date.now(), Date.now(), 'link_click', email.toLowerCase().trim()]
  );
  
  if (result.success) {
    return NextResponse.redirect(new URL('/newsletter/unsubscribed', request.url));
  } else {
    return NextResponse.redirect(new URL('/newsletter/unsubscribe-error', request.url));
  }
}