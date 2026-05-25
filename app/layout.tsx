// app/layout.tsx
// @ts-ignore
import './globals.css';
import { ReactNode, Suspense } from 'react';
import { Inter } from 'next/font/google';

import ClientLayoutWrapper from '@/components/ClientLayoutWrapper';
import CtaTracker from '@/components/CTATracker';
import FacebookPixel from "@/components/FacebookPixel";
import FBPixelEvents from '@/components/FBPixelEvents';
import CookieConsent from '@/components/CookieConsent';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MPIntellect – Your Gateway to Smart Trading',
  description:
    'MPIntellect is a premium platform built to help traders get started with speed, confidence, and security. Access exclusive insights, AI tools, and global markets.',
  manifest: '/manifest.json',
};

// 🔥 Build-time environment variable
const isIntelOnlyBuild = process.env.NEXT_PUBLIC_BUILD_TARGET === 'intel';

export default function Layout({ children }: { children: ReactNode }) {
  
  return (
    <html lang="en" suppressHydrationWarning> 
      <head>
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, shrink-to-fit=no" 
        />
      </head>
      
      <body 
        className={`${inter.className} bg-black text-white relative`}
        suppressHydrationWarning 
      >      
        <Script id="consent-mode-defaults" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied'
            });
          `}
        </Script>

        <ClientLayoutWrapper isIntelOnlyBuild={isIntelOnlyBuild}>
          {children}
        </ClientLayoutWrapper>

        {/* Analytics & Tracking - Only load on main build */}
        {!isIntelOnlyBuild && (
          <>
            <Suspense fallback={null}>
              <FacebookPixel />
              <FBPixelEvents /> 
            </Suspense>

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

            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-Y5VJQCKSQE"
              strategy="afterInteractive"
            />

            <Script id="gtag-base" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-Y5VJQCKSQE', { anonymize_ip: true });
                gtag('config', 'AW-16927724463');
              `}
            </Script>

            <Script src="/cta-tracker.js" strategy="afterInteractive" />
            <CtaTracker />
          </>
        )}

        <CookieConsent />
        
        <Suspense fallback={null} />

      </body>
    </html>
  );
}