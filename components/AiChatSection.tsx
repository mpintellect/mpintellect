'use client';
import React from 'react';
import { Bot, Zap } from 'lucide-react';

const AiChatSection = ({ onLaunch }: { onLaunch: (sym: string) => void }) => {
  const handleSymbolClick = (symbol: string) => {
    onLaunch(symbol);
  };

  const handleTerminalLaunch = () => {
    onLaunch(""); // Empty string for full terminal launch
  };

  return (
    <section id="aiassistant" className="ai-chat-section">
      <div className="ai-chat-container">
        <h2 className="ai-chat-title">AI Intel Terminal</h2>
        <p className="ai-chat-subtitle">Direct access to institutional technical analysis. Select an asset to begin.</p>
        
        {/* Quick Symbol Grid */}
        <div className="symbol-launch-grid mb-6">
          {["XAUUSD", "BTCUSD", "EURUSD", "USDJPY"].map(sym => (
            <button 
              key={sym} 
              className="symbol-launch-btn ai-style" 
              onClick={() => handleSymbolClick(sym)}
            >
              <div className="launch-pill-icon">
                <Zap size={20} strokeWidth={1.5} />
              </div>
              <span className="sym-name">{sym}</span>
              <span className="sym-status">Analyze</span>
            </button>
          ))}
        </div>

        {/* Terminal Launch Card */}
        <div 
          className="launch-terminal-card ai-accent" 
          onClick={handleTerminalLaunch}
        >
          <div className="launch-header">
            <div className="pulse-indicator ai"></div>
            <span>System Status: Online</span>
          </div>
          <div className="launch-icon-box">
            <Bot size={48} />
          </div>
          <button className="launch-terminal-btn ai">Launch AI Intel Terminal</button>
          <div className="launch-footer-text">
            <Zap size={12} /> Instant technical analysis available
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiChatSection;