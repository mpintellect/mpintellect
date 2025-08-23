'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    // Generic gtag signature without `any`
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type MaybeAnchor = HTMLElement & Partial<HTMLAnchorElement>;

// Params we might send to the conversion event
type ConversionParams = {
  send_to: string;
  value?: number;
  currency?: string;
  // gtag supports a callback param called event_callback
  // (we keep it optional)
  event_callback?: () => void;
};

/**
 * Global CTA tracker:
 * - Looks for clicks on any element with data-cta="true"
 * - Sends GA4 event (default: select_content)
 * - Sends Google Ads conversion if data-ads-send-to is present
 * - Safely handles navigation so events aren’t lost
 */
export default function CtaTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest(
        '[data-cta="true"]'
      ) as MaybeAnchor | null;

      if (!el) return;

      const name = el.getAttribute('data-cta-name') || 'cta_click';
      const gaEvent = el.getAttribute('data-ga-event') || 'select_content';
      const adsSendTo = el.getAttribute('data-ads-send-to') || '';
      const valueAttr = el.getAttribute('data-value');
      const currency = el.getAttribute('data-currency') || undefined;

      const value =
        typeof valueAttr === 'string' && valueAttr.trim() !== ''
          ? Number(valueAttr)
          : undefined;

      // Fire GA4 event
      window.gtag?.('event', gaEvent, {
        event_category: 'cta',
        event_label: name,
        content_type: 'cta',
        ...(value !== undefined ? { value } : {}),
        ...(currency ? { currency } : {}),
      });

      const fireAdsConversion = (cb?: () => void) => {
        if (!adsSendTo) {
          cb?.();
          return;
        }
        const params: ConversionParams = { send_to: adsSendTo };
        if (value !== undefined) params.value = value;
        if (currency) params.currency = currency;
        if (cb) params.event_callback = cb;

        window.gtag?.('event', 'conversion', params);
      };

      // If it's a link opening in the same tab, delay navigation very briefly
      const isAnchor = el.tagName === 'A';
      const href =
        isAnchor && typeof el.href === 'string' ? el.href : null;
      const newTab = isAnchor && el.target === '_blank';

      if (href && !newTab) {
        e.preventDefault();
        let navigated = false;
        const go = () => {
          if (!navigated) {
            navigated = true;
            window.location.href = href;
          }
        };

        // Try to use event_callback; also set a timeout fallback
        fireAdsConversion(go);
        setTimeout(go, 400);
      } else {
        // No navigation to wait for (or opens in new tab)
        fireAdsConversion();
      }
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}