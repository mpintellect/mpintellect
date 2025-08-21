'use client';

import { useSearchParams } from 'next/navigation';
import StickyLogo from '@/components/StickyLogo';
import BlogSection from '@/components/BlogSection';

export default function BlogPage() {
  return (
    <>
      <StickyLogo />
      <main className="min-h-screen bg-black">
        <BlogSection />
      </main>
    </>
  );
}