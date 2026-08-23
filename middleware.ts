import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'experimental-edge';

const VALID_TOOLS = [
  'analysis',
  'trade',
  'trend',
  'momentum',
  'zones',
  'volatility',
  'calculator',
  'indicator',
  'forecast',
];

const VALID_LOCALES = ['en', 'ar'];

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // Normalize path segments by stripping leading/trailing slashes
  const segments = pathname.replace(/^\/+|\/+$/g, '').split('/');

  // Case 1: /<tool>/<symbol> (Missing locale, e.g. /analysis/eurusd -> /en/analysis/eurusd)
  if (segments.length === 2) {
    const [tool, symbol] = segments;
    const lowerTool = tool.toLowerCase();
    if (VALID_TOOLS.includes(lowerTool)) {
      url.pathname = `/en/${lowerTool}/${symbol.toLowerCase()}/`;
      return NextResponse.redirect(url, { status: 301 });
    }
  }

  // Case 2: /<locale>/<tool>/<symbol> (e.g. /en/analysis/EURUSD -> /en/analysis/eurusd)
  if (segments.length === 3) {
    const [locale, tool, symbol] = segments;
    const lowerLocale = locale.toLowerCase();
    const lowerTool = tool.toLowerCase();

    if (VALID_LOCALES.includes(lowerLocale) && VALID_TOOLS.includes(lowerTool)) {
      const lowerSymbol = symbol.toLowerCase();
      // If symbol or tool has uppercase characters, redirect to clean lowercase canonical URL
      if (symbol !== lowerSymbol || tool !== lowerTool || locale !== lowerLocale) {
        url.pathname = `/${lowerLocale}/${lowerTool}/${lowerSymbol}/`;
        return NextResponse.redirect(url, { status: 301 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public files with extensions (.png, .jpg, .svg, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
};