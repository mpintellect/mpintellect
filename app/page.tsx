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
          <div className="max-w-7xl mx-auto px-6">
            <div className="h-32 bg-zinc-900/50 animate-pulse mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[1,2,3].map(i => (
                <div key={i} className="h-96 bg-zinc-900/30 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      }>
        <LatestInsights />
      </Suspense>
      
      <ContactSection />
    </>
  );
}