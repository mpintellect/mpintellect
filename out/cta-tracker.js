/* global gtag, dataLayer */
(function () {
  // Ensure dataLayer exists for GTM/GA4
  window.dataLayer = window.dataLayer || [];

  // Find the nearest ancestor with data-cta="true"
  function findCTA(el) {
    while (el && el !== document.body) {
      if (el.matches && el.matches('[data-cta="true"]')) return el;
      el = el.parentElement;
    }
    return null;
  }

  // Fire GA4 event via dataLayer (GTM can listen for this)
  function fireGA4Event(payload) {
    try {
      window.dataLayer.push({
        event: 'cta_click',
        ...payload,
      });
    } catch (e) {
      // no-op
    }
  }

  // Fire Google Ads conversion if configured on the element
  function fireGoogleAdsConversion(el) {
    const sendTo = el.getAttribute('data-ads-send-to');
    if (!sendTo) return; // not configured for this CTA

    const value = Number(el.getAttribute('data-value') || '0') || 0;
    const currency = el.getAttribute('data-currency') || 'USD';

    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          send_to: sendTo,
          value,
          currency,
        });
      }
    } catch (e) {
      // no-op
    }
  }

  // Grab some context for debugging/analysis
  function getContext(el) {
    const name =
      el.getAttribute('data-cta-name') ||
      el.getAttribute('aria-label') ||
      (el.textContent || '').trim().slice(0, 60);
    const href = el.getAttribute('href') || el.getAttribute('data-href') || '';
    const category = el.getAttribute('data-cta-category') || 'cta';
    const location = el.getAttribute('data-cta-location') || 'page';
    const variant = el.getAttribute('data-cta-variant') || '';
    return { name, href, category, location, variant };
  }

  // Single delegated click handler for the whole doc
  document.addEventListener(
    'click',
    function (e) {
      const target = e.target;
      const el = findCTA(target);
      if (!el) return;

      const { name, href, category, location, variant } = getContext(el);

      // 1) GA4/GTM event
      fireGA4Event({
        cta_name: name,
        cta_href: href,
        cta_category: category,
        cta_location: location,
        cta_variant: variant,
        page_path: window.location.pathname,
        page_title: document.title,
        utm_source: new URLSearchParams(window.location.search).get('utm_source') || '',
        utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || '',
        utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || '',
      });

      // 2) Google Ads conversion (optional per element)
      fireGoogleAdsConversion(el);

      // Don’t block navigation: let the default click proceed
      // (sendBeacon/gtag queues will flush in the background)
    },
    // Use capture to catch clicks before they’re stopped by other handlers
    true
  );
})();