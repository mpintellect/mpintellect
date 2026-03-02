// app/page.tsx
"use client";

import { Suspense, useState } from "react";
import { createPortal } from "react-dom";
import { X } from 'lucide-react';
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

import PropFirmChatSection from '@/components/PropFirmChatSection';
import AiChatBox from "@/components/AiChatBox";
import PropFirmChat from "@/components/PropFirmChat";
import LatestInsights from '@/components/LatestInsights';



export default function Home() {
  const [activeTool, setActiveTool] = useState<'ai' | 'prop' | null>(null);
  const [startSymbol, setStartSymbol] = useState<string | null>(null);

  const openTool = (tool: 'ai' | 'prop', symbol: string | null = null) => {
    setStartSymbol(symbol);
    setActiveTool(tool);
    document.body.style.overflow = 'hidden';
  };

  const closeTool = () => {
    setActiveTool(null);
    setStartSymbol(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
    
      <Navbar />
      
      <NotificationButton /> 
      <LiveMarketFeed />
      <Hero />
      
      <WelcomeTradePopup />
      <MobileMenu />

      {/* Existing Sections */}
      <AiChatSection onLaunch={(sym) => openTool('ai', sym)} />
      <PropFirmChatSection onLaunch={(sym) => openTool('prop', sym)} />

      {/* 🚀 THE FIX: Wrap TraderAssistantLite in Suspense */}
      <Suspense fallback={<div className="py-10 text-center opacity-50">Loading Assistant...</div>}>
        <TraderAssistantLite />
      </Suspense>

      <LearningHub />
      <AiToolsSection />
      <AIRobotCards />
       <LatestInsights /> 
      <ContactSection />

      {activeTool && typeof document !== "undefined" && createPortal(
        <div className="immersive-modal-overlay">
          <div className="immersive-modal-container">
            <div className="immersive-header">
              <div className="tool-identity">
                <span className="live-pulse"></span>
                {activeTool === 'ai' ? 'Intelligence Terminal' : 'Prop Firm Security Protocol'}
              </div>
              <button onClick={closeTool} className="immersive-close-btn">
                <X size={24} /> <span>CLOSE</span>
              </button>
            </div>

            <div className="immersive-content">
               {activeTool === 'ai' ? (
                 <AiChatBox 
                   mode="section" 
                   onClose={closeTool} 
                   autoStart={true}
                   preselectedSymbol={startSymbol}
                 />
               ) : (
                 <PropFirmChat 
                   onClose={closeTool} 
                   preselectedSymbol={startSymbol}
                 />
               )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}