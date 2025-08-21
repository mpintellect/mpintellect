import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = ['/admin']; // protect the Admin UI routes

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only gate /admin (your APIs already use x-admin-key)
  if (!PROTECTED.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const user = process.env.ADMIN_BASIC_USER || '';
  const pass = process.env.ADMIN_BASIC_PASS || '';

  // If creds aren’t set, don’t block (useful in dev)
  if (!user || !pass) return NextResponse.next();

  const auth = req.headers.get('authorization') || '';
  const [scheme, encoded] = auth.split(' ');
  if (scheme !== 'Basic' || !encoded) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
    });
  }

  const decoded = Buffer.from(encoded, 'base64').toString('utf8');
  const [u, p] = decoded.split(':');

  if (u === user && p === pass) return NextResponse.next();

  return new NextResponse('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
  });
}

export const config = {
  matcher: ['/admin/:path*'],
};