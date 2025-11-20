// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';

// Change 1: Import the new conditional wrapper instead of the direct component
import ConditionalStickyLogo from '@/components/ConditionalStickyLogo';
import ConditionalMobileMenu from '@/components/ConditionalMobileMenu'; 
import ConditionalNavbar from '@/components/ConditionalNavbar'; 
import Script from 'next/script';
import CtaTracker from '@/components/CTATracker';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MZPrimer – Your Gateway to Smart Trading',
  description:
    'MZPrimer is a premium trading site built to help traders get started with speed, confidence, and security. Access exclusive insights, AI tools, and global markets.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white relative`}>
      

        {/* Change 2: Use the conditional wrapper for Sticky Logo */}
        <ConditionalStickyLogo />
        <ConditionalNavbar />
        {/* Conditional Mobile Menu */}
        <ConditionalMobileMenu />

        {/* Main content */}
        <main className="flex-grow">
          {children}
        </main>
        
        {/* Footer */}
        <Footer />

        {/* ---------------- AdRoll ---------------- */}
        <Script id="adroll-loader" strategy="afterInteractive">
          {`
            window.addEventListener('load', function () {
              var adroll_adv_id = "FWX22H4MLNAEJKP7QZIYBD";
              var adroll_pix_id = "4MT65TY4GVFSXOOPTPEKTF";
              var adroll_version = "2.0";

              (function(w, d, s) {
                w.adroll = w.adroll || [];
                w.adroll.f = ['setProperties','identify','track','identify_email','get_cookie'];
                w.__adroll_loaded = true;

                for (var a = 0; a < w.adroll.f.length; a++) {
                  w.adroll[w.adroll.f[a]] = w.adroll[w.adroll.f[a]] || (function(n) {
                    return function() { w.adroll.push([n, arguments]); };
                  })(w.adroll.f[a]);
                }

                var scr = d.createElement(s);
                scr.async = true;
                scr.src = "https://s.adroll.com/j/" + adroll_adv_id + "/roundtrip.js";
                scr.onload = function () {
                  if (typeof adroll !== 'undefined' && typeof adroll.track === 'function') {
                    adroll.track("pageView");
                  }
                };
                (d.head || d.body).appendChild(scr);
              })(window, document, 'script');
            });
          `}
        </Script>

        {/* ---------------- Google Tag Manager (container only) ---------------- */}
        <Script id="gtm-loader" strategy="afterInteractive">
          {`
            window.addEventListener('load', function () {
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                var f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s),
                    dl = l !== 'dataLayer' ? '&l=' + l : '';
                j.async = true;
                j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode.insertBefore(j, f);
              })(window, document, 'script', 'dataLayer', 'GTM-5M6V2F8L');
            });
          `}
        </Script>

        {/* ---------------- ONE gtag.js loader ---------------- */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y5VJQCKSQE"
          strategy="afterInteractive"
        />

        {/* ---------------- Unified GA4 + Google Ads init ---------------- */}
        <Script id="gtag-base" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // GA4
            gtag('config', 'G-Y5VJQCKSQE', { anonymize_ip: true });

            // Google Ads base
            gtag('config', 'AW-16927724463');
          `}
        </Script>

        <Script src="/cta-tracker.js" strategy="afterInteractive" />
        <CtaTracker />

      </body>
    </html>
  );
}