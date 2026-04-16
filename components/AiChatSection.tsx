'use client';
import React, { useState } from 'react';
import { createPortal } from "react-dom";
import { Bot, Zap, X } from 'lucide-react';
import AiChatBox from "@/components/AiChatBox";

const AiChatSection = ({ onLaunch }: { onLaunch?: (sym: string) => void }) => {
  // Internal state for modal
  const [showModal, setShowModal] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  // Internal modal handlers
  const openModal = (symbol: string | null = null) => {
    console.log('🔵 Opening AI modal with symbol:', symbol);
    setSelectedSymbol(symbol);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSymbol(null);
    document.body.style.overflow = 'auto';
  };

  const handleSymbolClick = (symbol: string) => {
    if (onLaunch && typeof onLaunch === 'function') {
      onLaunch(symbol);
    } else {
      console.log('Using internal AI modal logic for symbol:', symbol);
      openModal(symbol);
    }
  };

  const handleTerminalLaunch = () => {
    if (onLaunch && typeof onLaunch === 'function') {
      onLaunch(""); // Empty string for full terminal launch
    } else {
      console.log('Using internal AI modal logic for full terminal');
      openModal(null);
    }
  };

  // Quick symbols array
  const quickSymbols = ["XAUUSD", "BTCUSD", "EURUSD", "USDJPY"];

  return (
    <>
      <section id="aiassistant" className="ai-chat-section">
        <div className="ai-chat-container">
          <h2 className="ai-chat-title">AI Intel Terminal</h2>
          <p className="ai-chat-subtitle">
            Direct access to institutional technical analysis. Select an asset to begin.
          </p>
          
          {/* Quick Symbol Grid */}
          <div className="symbol-launch-grid mb-6">
            {quickSymbols.map(sym => (
              <button 
                key={sym} 
                className="symbol-launch-btn ai-style" 
                onClick={() => handleSymbolClick(sym)}
                type="button"
                aria-label={`Launch AI analysis for ${sym}`}
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
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleTerminalLaunch();
                e.preventDefault();
              }
            }}
            aria-label="Launch full AI Intel Terminal"
          >
            <div className="launch-header">
              <div className="pulse-indicator ai"></div>
              <span>System Status: Online</span>
            </div>
            <div className="launch-icon-box">
              <Bot size={48} />
            </div>
            <button 
              className="launch-terminal-btn ai"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleTerminalLaunch();
              }}
            >
              Launch AI Intel Terminal
            </button>
            <div className="launch-footer-text">
              <Zap size={12} /> Instant technical analysis available
            </div>
          </div>
        </div>
      </section>

      {/* INTERNAL AI MODAL - Only shows when onLaunch is NOT provided */}
      {showModal && !onLaunch && typeof document !== "undefined" && createPortal(
        <div className="immersive-modal-overlay">
          <div className="immersive-modal-container">
            <div className="immersive-header">
              <div className="tool-identity">
                <span className="live-pulse"></span>
                AI  Terminal
              </div>
              <button onClick={closeModal} className="immersive-close-btn">
                <X size={24} /> <span>CLOSE</span>
              </button>
            </div>

            <div className="immersive-content">
              <AiChatBox 
                mode="section" 
                onClose={closeModal} 
                autoStart={true}
                preselectedSymbol={selectedSymbol}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default AiChatSection;