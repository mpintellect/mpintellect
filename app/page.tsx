import StickyLogo from '@/components/StickyLogo';
import Navbar from '@/components/Navbar';
import MobileMenu from '@/components/MobileMenu';
import Hero from '@/components/Hero';
import TraderAssistantLite from '@/components/TraderAssistantLite';
import LearningHub from '@/components/LearningHub';
import AiToolsSection from '@/components/AiToolsSection';
import AIRobotCards from '@/components/AIRobotCards';
import ContactSection from '@/components/ContactSection';
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      <StickyLogo />
      <Navbar />
      <MobileMenu />
      <Hero />
      <TraderAssistantLite />
      <LearningHub />
      <AiToolsSection />
      <AIRobotCards />
      <ContactSection />
    </>
  );
}