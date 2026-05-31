// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;
  
  // Match pattern: /locale/tool/SYMBOL (where SYMBOL is uppercase)
  // Example: /en/forecast/XAUUSD → /en/forecast/xauusd
  const match = pathname.match(/^\/([a-z]{2})\/([a-z]+)\/([A-Z]+)$/);
  
  if (match) {
    const [, locale, tool, symbol] = match;
    const lowercaseSymbol = symbol.toLowerCase();
    const newPathname = `/${locale}/${tool}/${lowercaseSymbol}`;
    
    // Redirect to lowercase version
    url.pathname = newPathname;
    return NextResponse.redirect(url, { status: 301 });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};