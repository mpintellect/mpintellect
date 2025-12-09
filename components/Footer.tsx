'use client';

import Link from 'next/link';
import { useState } from 'react';

// 🛑 UPDATE YOUR LINKS HERE
const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/mzprimer", 
  instagram: "https://www.instagram.com/mzprimer",
  telegram: "https://t.me/mzprimer" // 👈 Added Telegram
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        throw new Error('Subscription failed');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <footer className="footer-one-line">
      <div className="footer-content">
        <div className="footer-logo-badges">
          <img
            src="/logos/mzlogo.webp"
            alt="MZPrimer Logo"
            className="footer-logo"
            loading="lazy"
            width="120"
            height="120"
          />
          <div className="payment-badges">
            <img src="/logos/stripe.svg" alt="Stripe" className="trust-logo" />
            <img src="/logos/visa.svg" alt="Visa" className="trust-logo" />
            <img src="/logos/mastercard.svg" alt="Mastercard" className="trust-logo" />
            <img src="/logos/Applepay.svg" alt="Apple Pay" className="trust-logo" />
            <img src="/logos/google.svg" alt="Google Pay" className="trust-logo" />
            <img src="/logos/pci.svg" alt="PCI" className="trust-logo" />
          </div>
        </div>

        <span className="footer-text">
          © {new Date().getFullYear()} MZPrimer LTD. All rights reserved.
        </span>
      </div>

      <div className="footer-grid">
        <div className="footer-column">
          <h4>AI Tools</h4>
          <ul>
            <li><Link href="/tools/ai-assistant">AI Assistant</Link></li>
            <li><Link href="/ai-robot">Trading Robots</Link></li>
            <li><Link href="/#aitrading">Automation Guide</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Market & Learning</h4>
          <ul>
            <li><Link href="/#learning">Learning Hub</Link></li>
            <li><Link href="/blog">Blog & Insights</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Company</h4>
          <ul>
            <li><Link href="/#contacts">Contact Us</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Legal</h4>
          <ul>
            <li><Link href="/legal#privacy">Privacy Policy</Link></li>
            <li><Link href="/legal#terms">Terms of Use</Link></li>
            <li><Link href="/legal#disclaimer">Disclaimer</Link></li>
          </ul>
        </div>

        <div className="footer-subscribe subscribe-column">
          <h4 className="text-sm md:text-base font-semibold text-white mb-3">Subscribe to Updates</h4>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
            <button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          {status === 'success' && (
            <p className="subscribe-success">✅ Subscribed!</p>
          )}
          {status === 'error' && (
            <p className="subscribe-error">❌ Try again</p>
          )}

          {/* 👇 SOCIAL SECTION */}
          <div className="mt-6 pt-4 border-t border-zinc-800">
            <h4 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">Follow Us</h4>
            <div className="flex flex-wrap gap-3">
              
              {/* Telegram Button (New) */}
              <a 
                href={SOCIAL_LINKS.telegram}
                target="_blank" 
                rel="noreferrer"
                className="btn-elegant-social btn-tg" // Added btn-tg class
              >
                <svg viewBox="0 0 24 24">
                   <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42l10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.002.001l-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15l4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z"/>
                </svg>
                <span>Telegram</span>
              </a>

              {/* Facebook Button */}
              <a 
                href={SOCIAL_LINKS.facebook}
                target="_blank" 
                rel="noreferrer"
                className="btn-elegant-social"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </a>

              {/* Instagram Button */}
              <a 
                href={SOCIAL_LINKS.instagram}
                target="_blank" 
                rel="noreferrer"
                className="btn-elegant-social"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.36-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.2-4.361-2.62-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.163 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </a>

            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}