import StickyLogo from '@/components/StickyLogo';
import LiveTicker from '@/components/LiveTicker';
import Navbar from '@/components/Navbar';
import MobileMenu from '@/components/MobileMenu';
import Hero from '@/components/Hero';
import MarketSection from '@/components/MarketSection';
import LearningHub from '@/components/LearningHub';
import AccountsSection from '@/components/AccountsSection';
import AiToolsSection from '@/components/AiToolsSection';
import ContactSection from '@/components/ContactSection';
import PrivacySection from '@/components/PrivacySection';
import TrustSection from '@/components/TrustSection';
import DisclaimerSection from '@/components/DisclaimerSection';
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
      <AccountsSection />
      <AiToolsSection />
      <ContactSection />
      <PrivacySection />
      <TrustSection />
      <DisclaimerSection />
    </>
  );
}