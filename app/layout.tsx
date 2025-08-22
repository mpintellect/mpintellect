import './globals.css';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import StickyLogo from '@/components/StickyLogo';
import Footer from '@/components/Footer';
import MobileMenu from '@/components/MobileMenu'; // ✅ Add this line
import Script from 'next/script';

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
        {/* ✅ Global Navbar on all pages */}
        <Navbar />

        {/* ✅ Sticky MP logo in top-left */}
        <StickyLogo />
         {/* ✅ Mobile Hamburger Menu */}
        <MobileMenu />
        {/* ✅ Main page content */}
        {children}
        {/* ✅ Global Footer */}
        <Footer />
        <Script id="adroll-loader" strategy="afterInteractive">
  {`
    window.addEventListener('load', function () {
      var adroll_adv_id = "FWX22H4MLNAEJKP7QZIYBD";
      var adroll_pix_id = "4MT65TY4GVFSXOOPTPEKTF";
      var adroll_version = "2.0";

      (function(w, d, s, u) {
        w.adroll = w.adroll || [];
        w.adroll.f = ['setProperties', 'identify', 'track', 'identify_email', 'get_cookie'];
        w.__adroll_loaded = true;

        for (var a = 0; a < w.adroll.f.length; a++) {
          w.adroll[w.adroll.f[a]] = w.adroll[w.adroll.f[a]] || (function(n) {
            return function() {
              w.adroll.push([n, arguments]);
            };
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
<Script id="google-ads-conversion" strategy="afterInteractive">
  {`
    window.addEventListener('load', function () {
      if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
          'send_to': 'AW-16927724463/n3hlCNmcy6oaEK-n4oc_',
          'value': 1.0,
          'currency': 'MAD'
        });
      }
    });
  `}
</Script>
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
{/* Google Analytics (GA4) */}
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-Y5VJQCKSQE"
  strategy="afterInteractive"
/>
<Script id="ga4-init" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-Y5VJQCKSQE', { anonymize_ip: true });
  `}
</Script>
      </body>
    </html>
  );
}