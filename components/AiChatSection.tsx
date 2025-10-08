// components/AiChatSection.tsx
'use client';

import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import AiChatBox from './AiChatBox';

const AiChatSection = forwardRef((_, ref) => {
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
    <section id="aiassistant" className="ai-chat-section">
      <div className="ai-chat-container">
        <h2 className="ai-chat-title">🤖 AI Trading Assistant</h2>
        <p className="ai-chat-subtitle">
          Ask your question and get smart trade setups using real-time market data.
        </p>

        <div className="ai-chat-box-wrapper">
          <AiChatBox autoStart={startChat} />
        </div>
      </div>
    </section>
  );
});

export default AiChatSection;