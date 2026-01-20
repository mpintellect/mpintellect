// components/PropFirmChatSection.tsx
'use client';

import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import PropFirmChat from './PropFirmChat';

const PropFirmChatSection = forwardRef((_, ref) => {
  const [startChat, setStartChat] = useState(false);

  // ✅ Auto-start chat when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setStartChat(true);
    }, 500); // Small delay to ensure everything is loaded
    
    return () => clearTimeout(timer);
  }, []);

  useImperativeHandle(ref, () => ({
    triggerChat() {
      setStartChat(true);
    },
  }));

  return (
    <section id="propfirm" className="ai-chat-section">
      <div className="ai-chat-container">
        <h2 className="ai-chat-title">🏆 Prop Firm AI Assistant</h2>
        <p className="ai-chat-subtitle">
          Get prop firm compliant trade setups with automated risk management for FTMO, FundedNext, MFF & The5%ers.
        </p>

        <div className="ai-chat-box-wrapper">
          <PropFirmChat />
        </div>
      </div>
    </section>
  );
});

export default PropFirmChatSection;