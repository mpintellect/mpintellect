'use client';

import Link from 'next/link';
import { useState } from 'react';

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
      src="https://i.postimg.cc/5ypD6FmV/mzlogotransap.png"
      alt="MZPrimer Logo"
      className="footer-logo"
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
</div>
      </div>
    </footer>
  );
}