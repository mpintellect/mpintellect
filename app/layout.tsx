// app/layout.tsx
import './globals.css';
import { ReactNode, Suspense } from 'react';
import { Inter } from 'next/font/google';

import ClientLayoutWrapper from '@/components/ClientLayoutWrapper'; // ✅ This now handles ALL conditional layout components
// Component Imports
import CtaTracker from '@/components/CTATracker';
import FacebookPixel from "@/components/FacebookPixel";
import FBPixelEvents from '@/components/FBPixelEvents'; // ✅ Imported
import CookieConsent from '@/components/CookieConsent';

import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MPIntellect  – Your Gateway to Smart Trading',
  description:
    'MPIntellect  is a premium platform built to help traders get started with speed, confidence, and security. Access exclusive insights, AI tools, and global markets.',
  manifest: '/manifest.json',
};

export default function Layout({ children }: { children: ReactNode }) {
  
  return (
    <html lang="en" suppressHydrationWarning> 
      <head>
        {/* 🔥 MOBILE FIX: Add viewport meta tag to prevent zoom and ensure proper scaling */}
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, shrink-to-fit=no" 
        />
      </head>
      
      <body 
        className={`${inter.className} bg-black text-white relative`}
        suppressHydrationWarning 
      >      
        {/* ---------------- 1. GOOGLE CONSENT MODE DEFAULT ---------------- */}
        <Script id="consent-mode-defaults" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Set default consent to 'denied'
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied'
            });
          `}
        </Script>

        {/* --- THE FIX: ClientLayoutWrapper now handles ALL conditional layout components (Navbar, Footer, StickyLogo, MobileMenu) --- */}
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>

        {/* ---------------- 2. ANALYTICS & TRACKING ---------------- */}
        
        {/* ✅ FIX: Added FBPixelEvents inside Suspense */}
        {/* Both components use searchParams, so they need Suspense to not break static generation */}
        <Suspense fallback={null}>
          <FacebookPixel />
          <FBPixelEvents /> 
        </Suspense>

        {/* Google Tag Manager */}
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

        {/* Google Analytics & Ads Base Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y5VJQCKSQE"
          strategy="afterInteractive"
        />

        {/* Init GA4 & Ads */}
        <Script id="gtag-base" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // GA4 Configuration
            gtag('config', 'G-Y5VJQCKSQE', { anonymize_ip: true });

            // Google Ads Configuration
            gtag('config', 'AW-16927724463');
          `}
        </Script>

        {/* Internal Tracker */}
        <Script src="/cta-tracker.js" strategy="afterInteractive" />
        <CtaTracker />

        {/* ---------------- 3. THE CUSTOM COOKIE UI ---------------- */}
        <CookieConsent />
        
        <Suspense fallback={null}>
          {/* Empty Suspense - kept for structure */}
        </Suspense>

      </body>
    </html>
  );
}