'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) return null;

  return (
    <nav className="w-full flex justify-end items-center py-4 px-6 bg-black fixed top-0 z-50 space-x-6">
      <a href="/" className="text-white hover:text-yellow-400 transition">Home</a>
      <Link href="/#market" className="text-white hover:text-yellow-400 transition">Market</Link>
      <Link href="/#learning" className="text-white hover:text-yellow-400 transition">Learning</Link>
      <Link href="/#accounts" className="text-white hover:text-yellow-400 transition">Accounts</Link>
      <Link href="/#aitrading" className="text-white hover:text-yellow-400 transition">AI Trading</Link>
      <Link href="/ai-robot" className="text-white hover:text-yellow-400 transition">AI Tools</Link>
      <Link href="/#contacts" className="text-white hover:text-yellow-400 transition">Contact</Link>
      <Link href="/#privacy" className="text-white hover:text-yellow-400 transition">Privacy</Link>
      <Link href="/blog" className="text-white hover:text-yellow-400 transition">Blog</Link>
    </nav>
  );
}