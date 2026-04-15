'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import Head from 'next/head'; 
import Image from 'next/image';

// 🛑 UPDATE YOUR LINKS HERE
const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/mpintellect", 
  instagram: "https://www.instagram.com/mpintellect",
  telegram: "https://t.me/mpintellect"
};

// Static year to avoid re-renders
const CURRENT_YEAR = new Date().getFullYear();

// Define proper types for logos
interface LogoConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

type LogoKey = 'mzlogo' | 'stripe' | 'visa' | 'mastercard' | 'applepay' | 'googlepay' | 'pci';

const LOGOS: Record<LogoKey, LogoConfig> = {
  mzlogo: {
    src: '/logos/mzlogo.webp',
    alt: 'MPIntellect Logo',
    width: 120,
    height: 120,
    priority: true
  },
  stripe: {
    src: '/logos/stripe.svg',
    alt: 'Stripe',
    width: 40,
    height: 25
  },
  visa: {
    src: '/logos/visa.svg',
    alt: 'Visa',
    width: 40,
    height: 25
  },
  mastercard: {
    src: '/logos/mastercard.svg',
    alt: 'Mastercard',
    width: 40,
    height: 25
  },
  applepay: {
    src: '/logos/Applepay.svg',
    alt: 'Apple Pay',
    width: 40,
    height: 25
  },
  googlepay: {
    src: '/logos/google.svg',
    alt: 'Google Pay',
    width: 40,
    height: 25
  },
  pci: {
    src: '/logos/pci.svg',
    alt: 'PCI',
    width: 40,
    height: 25
  }
};

// Payment badges only (exclude main logo)
const PAYMENT_LOGOS: LogoKey[] = ['stripe', 'visa', 'mastercard', 'applepay', 'googlepay', 'pci'];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Memoize payment badges to prevent re-renders
  const PaymentBadges = useMemo(() => (
    <div className="payment-badges">
      {PAYMENT_LOGOS.map((key) => {
        const logo = LOGOS[key];
        return (
          <Image 
            key={key}
            src={logo.src}
            alt={logo.alt}
            className="trust-logo"
            width={logo.width || 40}
            height={logo.height || 25}
          />
        );
      })}
    </div>
  ), []);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Basic validation
  if (!email || !email.includes('@')) {
    setStatus('error');
    return;
  }
  
  setStatus('loading');
  
  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({ 
        email,
        timestamp: new Date().toISOString(), // ✅ Changed from Date.now() to ISO string
        source: 'footer'
      }),
    });
    
    const data = await res.json();
    
    if (res.ok && data.success) {
      setStatus('success');
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    } else {
      throw new Error(data.error || 'Subscription failed');
    }
  } catch (error) {
    console.error('Subscription error:', error);
    setStatus('error');
    
    // Reset error message after 3 seconds
    setTimeout(() => {
      setStatus('idle');
    }, 3000);
  }
};

  return (
    <>
      <Head>
        {/* Preload critical logos */}
        <link 
          rel="preload" 
          href={LOGOS.mzlogo.src} 
          as="image" 
          type="image/webp" 
          fetchPriority="high"
        />
      </Head>
      
      <footer className="footer-one-line">
        <div className="footer-content">
          <div className="footer-logo-badges">
            {/* Optimized main logo */}
            <Image
              src={LOGOS.mzlogo.src}
              alt={LOGOS.mzlogo.alt}
              className="footer-logo"
              width={LOGOS.mzlogo.width}
              height={LOGOS.mzlogo.height}
              priority={true}
            />
            
            {/* Memoized payment badges */}
            {PaymentBadges}
          </div>

   <div className="footer-bottom">
  <span className="footer-text">
    © {CURRENT_YEAR} MPIntellect Intelligence. All rights reserved.
  </span>
  
  {/* Concise Financial Disclaimer */}
  <p className="disclaimer-text text-xs text-zinc-500 mt-4 max-w-3xl mx-auto text-center border-t border-[#D4AF37]/20 pt-4">
    <span className="text-[#D4AF37] font-bold">DISCLAIMER:</span> MPIntellect Intelligence provides 
    educational content and analytical tools for informational purposes only. We do not provide 
    financial advice, and nothing on this website should be construed as a recommendation to 
    buy or sell any financial instruments. Trading involves substantial risk of loss. 
    Past performance does not guarantee future results. You alone are responsible for your 
    trading decisions.
  </p>
</div>
        </div>

        <div className="footer-grid">
          <div className="footer-column">
            <h4>AI Tools</h4>
            <ul>
              <li><Link href="/tools/ai-assistant" prefetch={false}>AI Assistant</Link></li>
              <li><Link href="/ai-robot" prefetch={false}>Trading Robots</Link></li>
              <li><Link href="/#aitrading" prefetch={false}>Automation Guide</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Market & Learning</h4>
            <ul>
              <li><Link href="/#learning" prefetch={false}>Learning Hub</Link></li>
              <li><Link href="/blog" prefetch={false}>Blog & Insights</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><Link href="/#contacts" prefetch={false}>Contact Us</Link></li>
              <li><Link href="/about" prefetch={false}>About</Link></li>
              <li><Link href="/faq" prefetch={false}>FAQ</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li><Link href="/legal#privacy" prefetch={false}>Privacy Policy</Link></li>
              <li><Link href="/legal#terms" prefetch={false}>Terms of Use</Link></li>
              <li><Link href="/legal#disclaimer" prefetch={false}>Disclaimer</Link></li>
            </ul>
          </div>

          <div className="footer-subscribe subscribe-column">
            <h4 className="text-sm md:text-base font-semibold text-white mb-3">
              Subscribe to Updates
            </h4>

            <form onSubmit={handleSubmit} className="subscribe-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={status === 'loading'}
                aria-label="Email for newsletter subscription"
                className="subscribe-input"
              />
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="subscribe-button"
                aria-label={status === 'loading' ? 'Subscribing...' : 'Subscribe to newsletter'}
              >
                {status === 'loading' ? (
                  <span className="flex items-center justify-center">
                    <span className="loading-spinner"></span>
                    <span className="ml-2">Subscribing...</span>
                  </span>
                ) : (
                  'Subscribe'
                )}
              </button>
            </form>

            {/* Status Messages */}
            <div className="subscribe-status">
              {status === 'success' && (
                <p className="subscribe-success" role="alert">
                  ✅ Thank you! You've been subscribed.
                </p>
              )}
              {status === 'error' && (
                <p className="subscribe-error" role="alert">
                  ❌ Something went wrong. Please try again.
                </p>
              )}
            </div>

            {/* 👇 SOCIAL SECTION */}
            <div className="mt-6 pt-4 border-t border-zinc-800">
              <h4 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                Follow Us
              </h4>
              <div className="flex flex-wrap gap-3 social-buttons">
                
                {/* Telegram Button */}
                <SocialButton 
                  href={SOCIAL_LINKS.telegram}
                  label="Telegram"
                  className="btn-elegant-social btn-tg"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42l10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.002.001l-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15l4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z"/>
                  </svg>
                  <span>Telegram</span>
                </SocialButton>

                {/* Facebook Button */}
                <SocialButton 
                  href={SOCIAL_LINKS.facebook}
                  label="Facebook"
                  className="btn-elegant-social"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </SocialButton>

                {/* Instagram Button */}
                <SocialButton 
                  href={SOCIAL_LINKS.instagram}
                  label="Instagram"
                  className="btn-elegant-social"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.36-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.2-4.361-2.62-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.163 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                </SocialButton>

              </div>
            </div>
          </div>
        </div>
      </footer>
      
      <style jsx>{`
        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .subscribe-input:disabled,
        .subscribe-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .trust-logo {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
      `}</style>
    </>
  );
}

// Separate Social Button component for better optimization
function SocialButton({ 
  href, 
  label, 
  className, 
  children 
}: { 
  href: string; 
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <a 
      href={href}
      target="_blank" 
      rel="noopener noreferrer"
      className={className}
      aria-label={`Follow us on ${label}`}
    >
      {children}
    </a>
  );
}