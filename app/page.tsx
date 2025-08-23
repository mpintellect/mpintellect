import StickyLogo from '@/components/StickyLogo';
import LiveTicker from '@/components/LiveTicker';
import Navbar from '@/components/Navbar';
import MobileMenu from '@/components/MobileMenu';
import Hero from '@/components/Hero';
import MarketSection from '@/components/MarketSection';
import LearningHub from '@/components/LearningHub';
import MZCalculatorSection from '@/components/MZCalculatorSection';
import AccountsSection from '@/components/AccountsSection';
import AiToolsSection from '@/components/AiToolsSection';
import ContactSection from '@/components/ContactSection';
import PrivacySection from '@/components/PrivacySection';
import TrustSection from '@/components/TrustSection';
import DisclaimerSection from '@/components/DisclaimerSection';
export const metadata = {
  title: 'MZPrimer – Your Gateway to Smart Trading',
  description:
    'Start faster with MZPrimer: AI trading tools, education, and practical market insights for Forex, metals, indices, and crypto.',
  openGraph: {
    title: 'MZPrimer – Your Gateway to Smart Trading',
    description:
      'AI tools, calculators, and education to help you trade with clarity. Forex, metals, indices, and crypto.',
    url: 'https://mzprimer.com/',
    siteName: 'MZPrimer',
    images: [
      { url: 'https://mzprimer.com/og/home.jpg', width: 1200, height: 630, alt: 'MZPrimer' },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MZPrimer – Your Gateway to Smart Trading',
    description:
      'AI tools, calculators, and education to help you trade with clarity.',
    images: ['https://mzprimer.com/og/home.jpg'],
  },
};
export default function Home() {
  return (
    <>
      <StickyLogo />
      <LiveTicker />
      <Navbar />
      <MobileMenu />
      <Hero />
      <MarketSection />
      <LearningHub />
      <MZCalculatorSection />
      <AccountsSection />
      <AiToolsSection />
      <ContactSection />
      <PrivacySection />
      <TrustSection />
      <DisclaimerSection />
    </>
  );
}