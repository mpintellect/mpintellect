'use client';

import Link from 'next/link';

export default function StickyLogo() {
  return (
    <Link href="/" className="sticky-logo visible">
      <img
  src="/logos/mzlogo.webp"
  alt="MZPrimer Logo"
  className="sticky-logo-img"
  loading="lazy"
  width="60"
  height="60"
/>
    </Link>
  );
}