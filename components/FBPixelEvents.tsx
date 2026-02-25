'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    fbq: (
      command: 'track' | 'trackCustom' | 'init',
      eventName: string,
      parameters?: Record<string, any>
    ) => void;
    _fbq?: any;
  }
}

export default function FBPixelEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 1. Check if FB Pixel is initialized
    if (typeof window === 'undefined' || typeof window.fbq === 'undefined') return;

    // 2. Extract Symbol from URL
    let symbol = '';
    
    // Check URL Params (for AIChat, prop-firm, tools)
    const paramSymbol = searchParams.get('symbol');
    if (paramSymbol) {
      symbol = paramSymbol.toUpperCase();
    } else {
      // Check Path (for /trade/btcusd style URLs)
      const parts = pathname.split('/');
      const lastPart = parts[parts.length - 1];
      if (lastPart && lastPart.length >= 3 && !lastPart.includes('?')) {
        symbol = lastPart.toUpperCase();
      }
    }

    if (!symbol) return;

    // 3. Determine Type based on Page Path
    let type = '';
    let style = 'black'; // Default style

    if (pathname.includes('/AIChat')) {
      type = 'chat';
      style = 'cyber'; // Chat uses cyber style in catalog
    } else if (pathname.includes('/prop-firm')) {
      type = 'test';
      style = 'black'; // Test uses black style
    } else if (pathname.includes('/tools/ai-assistant')) {
      type = 'update';
      style = 'black'; // Update uses black style
    }

    if (!type) return;

    // 4. Extract Size from query params (variant parameter)
    // Default to 'square' for Facebook as per your catalog
    let size = searchParams.get('variant') || 'square';
    
    // Validate size is one of the allowed values
    if (!['standard', 'square', 'portrait'].includes(size)) {
      size = 'square'; // Default to square if invalid
    }

    // 5. Construct the EXACT Catalog ID format: [SYMBOL]-[TYPE]-[SIZE]
    const exactContentID = `${symbol}-${type}-${size}`.toUpperCase();
    
    // Also create the style-specific version that matches your image URL pattern
    const imageStyleID = `${symbol}-${type}-${size}`.toUpperCase(); // Same format
    
    console.log(`📡 FB Pixel Firing: ViewContent`, {
      exactID: exactContentID,
      symbol,
      type,
      size,
      style,
      path: pathname
    });

    // 6. Fire the ViewContent Event with the exact catalog ID
    window.fbq('track', 'ViewContent', {
      content_type: 'product',
      content_ids: [exactContentID], // Send only the exact match
      content_name: `${symbol} ${type.charAt(0).toUpperCase() + type.slice(1)} Tool`,
      content_category: type === 'chat' ? 'Lead_Gen' : 'Tool',
      currency: 'USD',
      value: 0.00
    });

    // 7. Also track a custom event with all parameters for debugging
    window.fbq('trackCustom', 'MZ_ViewContent', {
      symbol,
      type,
      size,
      style,
      content_id: exactContentID,
      page: pathname
    });

  }, [pathname, searchParams]);

  return null;
}