import StickyLogo from '@/components/StickyLogo';
import Navbar from '@/components/Navbar';
import NotificationButton from '@/components/NotificationButton'; 
import Hero from '@/components/Hero';
import MobileMenu from '@/components/MobileMenu';
import LiveMarketFeed from "@/components/LiveMarketFeed";
import WelcomeTradePopup from '@/components/WelcomeTradePopup';  
import AiChatSection from "@/components/AiChatSection";
import TraderAssistantLite from '@/components/TraderAssistantLite';
import LearningHub from '@/components/LearningHub';
import AiToolsSection from '@/components/AiToolsSection';
import AIRobotCards from '@/components/AIRobotCards';
import ContactSection from '@/components/ContactSection';
import FundamentalTicker from '@/components/news/FundamentalTicker'



export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      <StickyLogo />
      <Navbar />
      <FundamentalTicker />
      <NotificationButton /> 
      <Hero />
      <LiveMarketFeed />
      <WelcomeTradePopup />
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