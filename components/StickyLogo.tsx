'use client';

import Link from 'next/link';
import Image from 'next/image';

// Cache logo URL
const LOGO_URL = '/logos/mzlogo.webp';

export default function StickyLogo({ isDashboard = false }) {
  return (
    <Link 
      href="/" 
      className={`sticky-logo ${isDashboard ? 'dashboard-logo' : ''}`}
      aria-label="Go to homepage"
      prefetch={false}
    >
      <Image
        src={LOGO_URL}
        alt="MPIntellect Logo"
        className="sticky-logo-img"
        width={60}
        height={60}
        quality={75}
        priority={false}
        sizes="60px"
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
      />
    </Link>
  );
}