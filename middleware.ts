import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = ['/admin'];

export function middleware(req: NextRequest) {
  const { pathname, protocol } = req.nextUrl;

  // ✅ FORCE HTTPS IN PRODUCTION (add this)
  if (process.env.NODE_ENV === 'production' && protocol === 'http:') {
    const httpsUrl = req.nextUrl.clone();
    httpsUrl.protocol = 'https:';
    return NextResponse.redirect(httpsUrl);
  }

  // Existing admin protection
  if (!PROTECTED.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const user = process.env.ADMIN_BASIC_USER || '';
  const pass = process.env.ADMIN_BASIC_PASS || '';

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