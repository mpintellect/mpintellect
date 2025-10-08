import StickyLogo from '@/components/StickyLogo';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MobileMenu from '@/components/MobileMenu';
import AiChatSection from "@/components/AiChatSection";
import TraderAssistantLite from '@/components/TraderAssistantLite';
import LearningHub from '@/components/LearningHub';
import AiToolsSection from '@/components/AiToolsSection';
import AIRobotCards from '@/components/AIRobotCards';
import ContactSection from '@/components/ContactSection';
import AiChatWidget from "@/components/AiChatWidget";
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      <StickyLogo />
      <Navbar />
      <Hero />
      <MobileMenu />
      <AiChatSection />
      <TraderAssistantLite />
      <LearningHub />
      <AiToolsSection />
      <AIRobotCards />
      <ContactSection />
    </>
  );
}