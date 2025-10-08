// app/aiassistant/page.tsx
'use client';

import React, { useState } from "react";
import AiChatBox from "@/components/AiChatBox";

export default function AiAssistantPage() {
  const [startChat, setStartChat] = useState(false);

  return (
    <section className="ai-chat-section">
      <div className="ai-chat-container">
        <h2 className="ai-chat-title">🤖 AI Trading Assistant</h2>
        <p className="ai-chat-subtitle">
          Ask your question and get smart trade setups using real-time market data.
        </p>

        {!startChat ? (
          <button
            onClick={() => setStartChat(true)}
            className="ai-chat-button"
          >
            🚀 Start Chat
          </button>
        ) : (
          <div className="ai-chat-box-wrapper">
            <AiChatBox />
          </div>
        )}
      </div>
    </section>
  );
}