// app/ai-robot/page.tsx  (SERVER component — no "use client")
import type { Metadata } from 'next';
import AIRobotCards from '@/components/AIRobotCards';

export const metadata: Metadata = {
  title: 'AI Trading Robots – MZPrimer Intelligence',
  description:
    'Automate parts of your trading with tested AI robots for MetaTrader. Simple setup and clear risk options.',
  openGraph: {
    title: 'AI Trading Robots – MZPrimer Intelligence',
    description:
      'Automate parts of your trading with tested AI robots for MetaTrader. Simple setup and clear risk options.',
    url: 'https://mzprimer.com/ai-robot',
    siteName: 'MZPrimer', 
    images: [{ url: 'https://mzprimer.com/og/ai-robots.jpg', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Trading Robots – MZPrimer Intelligence',
    description:
      'Automate parts of your trading with tested AI robots for MetaTrader. Simple setup and clear risk options.',
    images: ['https://mzprimer.com/og/ai-robots.jpg'],
  },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-12">
       
        {/* This can be a Client Component; it’s fine to render it here */}
        <AIRobotCards />
      </div>
    </main>
  );
}