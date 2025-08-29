import StickyLogo from '@/components/StickyLogo';
import Navbar from '@/components/Navbar';
import MobileMenu from '@/components/MobileMenu';
import Hero from '@/components/Hero';
import TraderAssistantLite from "@/components/TraderAssistantLite";
import LearningHub from '@/components/LearningHub';
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
      <Navbar />
      <MobileMenu />
      <Hero />
      <section id="ai-assistant" className="ta-anchor-offset ta-home-block ai-assistant-section">
  <h2 className="ta-title">AI Trader Assistant</h2>
  <p className="ta-subtitle">
    AI-powered trading assistant: set your balance, symbol, leverage, and style to instantly calculate SL/TP levels, margin requirements, risk metrics, and view a simulated M5 price path — all in one clean, beginner-friendly tool.
  </p>

  <TraderAssistantLite />
</section>
      <LearningHub />
      <AiToolsSection />
      <ContactSection />
      <PrivacySection />
      <TrustSection />
      <DisclaimerSection />
    </>
  );
}