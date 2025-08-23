// app/blog/page.tsx  (SERVER component: no "use client")
import type { Metadata } from 'next';
import StickyLogo from '@/components/StickyLogo';
import BlogSection from '@/components/BlogSection';

export const metadata: Metadata = {
  title: 'Trading Blog & Guides – MZPrimer',
  description:
    'Short, actionable trading guides: lot size, risk, strategies, and weekly market structure.',
  openGraph: {
    title: 'Trading Blog & Guides – MZPrimer',
    description:
      'Short, actionable trading guides and weekly market structure.',
    url: 'https://mzprimer.com/blog',
    siteName: 'MZPrimer',
    images: [
      { url: 'https://mzprimer.com/og/blog.jpg', width: 1200, height: 630, alt: 'MZPrimer Blog' },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trading Blog & Guides – MZPrimer',
    description:
      'Short, actionable trading guides and weekly market structure.',
    images: ['https://mzprimer.com/og/blog.jpg'],
  },
};

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