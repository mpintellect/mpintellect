'use client';

import Link from 'next/link';

export default function StickyLogo() {
  return (
    <Link href="/" className="sticky-logo visible">
      <img
        src="https://i.postimg.cc/5ypD6FmV/mzlogotransap.png"
        alt="MZPrimer Logo"
        className="sticky-logo-img"
      />
    </Link>
  );
}