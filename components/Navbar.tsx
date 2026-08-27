"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // This layout scrolls `document.body` itself in some viewports rather
    // than `window`/documentElement, so a plain `window.scrollY` listener
    // silently never fires - read whichever of the three is actually moving.
    const getScrollTop = () =>
      Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop);
    const onScroll = () => setScrolled(getScrollTop() > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scroll', onScroll, true);
    };
  }, []);

  return (
    <nav className={`navbar-desktop ${scrolled ? 'scrolled' : ''}`}>
      <Link href="/">Home</Link>
      <Link href="/AIChat">AI Chat</Link>
      <Link href="/charts">Live Charts</Link>
      <Link href="/news">News</Link>
      <Link href="/markets" className="navbar-live-link">
        <span className="navbar-live-dot">
          <span className="navbar-live-dot-ping" />
          <span className="navbar-live-dot-core" />
        </span>
        Live Markets
      </Link>
      <Link href="/prop-firm">AI Funded</Link>
      <Link href="/ai-robot">EA</Link>
      <Link href="/tools/ai-assistant">AI Assistant</Link>
      <Link href="/#contacts">Contact</Link>
      <Link href="/legal">Privacy</Link>
      <Link href="/blog">Blog</Link>
      <Link href="/client/login" className="navbar-login-link">Login</Link>
    </nav>
  );
}