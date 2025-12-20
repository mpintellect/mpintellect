'use client';

import Link from 'next/link';
import Image from 'next/image';

// Cache logo URL
const LOGO_URL = '/logos/mzlogo.webp';

export default function StickyLogo() {
  return (
    <Link 
      href="/" 
      className="sticky-logo visible"
      aria-label="Go to homepage"
      prefetch={false} // Don't prefetch since it's same page navigation
    >
      <Image
        src={LOGO_URL}
        alt="MZPrimer Logo"
        className="sticky-logo-img"
        width={60}
        height={60}
        quality={75} // Lower quality for small image
        priority={false} // Not critical
        loading="lazy"
        sizes="60px"
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
      />
    </Link>
  );
}