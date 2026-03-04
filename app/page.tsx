// app/page.tsx
import { Suspense } from "react";
import HomeClientContainer from '@/components/HomeClientContainer';
import NotificationButton from '@/components/NotificationButton'; 
import Hero from '@/components/Hero';
import LiveMarketFeed from "@/components/LiveMarketFeed";
import WelcomeTradePopup from '@/components/WelcomeTradePopup';  
import TraderAssistantLite from '@/components/TraderAssistantLite';
import LearningHub from '@/components/LearningHub';
import AiToolsSection from '@/components/AiToolsSection';
import AIRobotCards from '@/components/AIRobotCards';
import ContactSection from '@/components/ContactSection';
import LatestInsights from '@/components/LatestInsights';

export default function Home() {
  return (
    <>
      <NotificationButton /> 
      <LiveMarketFeed />
      <Hero />
      
      <WelcomeTradePopup />

      {/* Existing Sections */}
      <HomeClientContainer /> {/* ✅ This now handles the modal logic */}

      {/* 🚀 THE FIX: Wrap TraderAssistantLite in Suspense */}
      <Suspense fallback={<div className="py-10 text-center opacity-50">Loading Assistant...</div>}>
        <TraderAssistantLite />
      </Suspense>

      <LearningHub />
      <AiToolsSection />
      <AIRobotCards />
      
       {/* Latest Insights with Premium Animations */}
      <Suspense fallback={
        <div className="latest-insights bg-[#050505] py-24">
        </div>
      }>
        <LatestInsights />
      </Suspense>
      
      <ContactSection />
    </>
  );
}