'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function FBPixelEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 1. Check if FB Pixel is initialized
    if (typeof window === 'undefined' || !(window as any).fbq) return;

    // 2. Extract Symbol from URL
    // Supports: /trade/btcusd, /calculator/btcusd, /AIChat?symbol=BTCUSD
    let symbol = '';
    
    // Check URL Params (for AIChat)
    const paramSymbol = searchParams.get('symbol');
    if (paramSymbol) {
      symbol = paramSymbol.toUpperCase();
    } else {
      // Check Path (for /trade/btcusd)
      const parts = pathname.split('/');
      const lastPart = parts[parts.length - 1];
      // Simple regex to check if last part looks like a symbol (e.g., XAUUSD, BTCUSD)
      if (lastPart && lastPart.length >= 3) {
        symbol = lastPart.toUpperCase();
      }
    }

    if (!symbol) return; // No symbol found, do nothing

    // 3. Determine Product Suffix based on Page
    let suffix = '';
    let category = '';

    if (pathname.includes('/AIChat')) {
      suffix = '-CHAT';
      category = 'Lead_Gen';
    } else if (pathname.includes('/trade/') || pathname.includes('/forecast/')) {
      suffix = '-SETUP';
      category = 'Strategy_Tool';
    } else if (pathname.includes('/calculator/') || pathname.includes('/zones/')) {
      suffix = '-RISK';
      category = 'Utility_Tool';
    }

    if (!suffix) return; // Not a product page

    // 4. Construct the Exact ID from your Catalog
    const contentID = `${symbol}${suffix}`; // e.g., "BTCUSD-CHAT"

    console.log(`📡 FB Pixel Firing: ViewContent for ${contentID}`);

    // 5. Fire the Event
    (window as any).fbq('track', 'ViewContent', {
      content_type: 'product',
      content_ids: [contentID], // ⚠️ CRITICAL: Must match Catalog ID exactly
      content_name: `${symbol} ${category}`,
      content_category: 'Software',
      currency: 'USD',
      value: 0.00 // You can set this to 4.50 for SETUP/RISK pages
    });

  }, [pathname, searchParams]);

  return null;
}