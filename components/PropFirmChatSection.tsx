'use client';
import React from 'react';
import { ShieldCheck, Trophy, Landmark } from 'lucide-react';

const PropFirmChatSection = ({ onLaunch }: { onLaunch: (val: string) => void }) => {
  
  return (
    <section id="propfirm" className="ai-chat-section">
      <div className="ai-chat-container">
        <h2 className="ai-chat-title">🏆 Prop Firm Challenge Assistant</h2>
        <p className="ai-chat-subtitle">Institutional compliance for challenge phases. Select an asset or a ruleset to initialize.</p>
        
        {/* ASSET CTAs */}
        <div className="launch-grid-label">Intelligence Assets</div>
        <div className="symbol-launch-grid mb-6">
          {["XAUUSD", "BTCUSD", "US30", "EURUSD"].map(sym => (
            <button key={sym} className="symbol-launch-btn prop-style" onClick={() => onLaunch(sym)}>
              <span className="sym-name">{sym}</span>
              <span className="sym-status">Verify Setup</span>
            </button>
          ))}
        </div>

        {/* COMPANY CTAs */}
        <div className="launch-grid-label">Strategic Rulesets</div>
        <div className="symbol-launch-grid mb-10">
          {["FTMO", "FundedNext", "5%ers", "MFF"].map(firm => (
            <button key={firm} className="symbol-launch-btn firm-style" onClick={() => onLaunch("")}>
              <span className="sym-name">{firm}</span>
              <span className="sym-status">Apply Rules</span>
            </button>
          ))}
        </div>

        {/* Original Terminal Card (Content Preserved per request) */}
        <div className="launch-terminal-card gold-accent" onClick={() => onLaunch("")}>
          <div className="launch-header">
            <div className="pulse-indicator gold"></div>
            <span>Risk Protocol: Calibrated</span>
          </div>
          <div className="launch-icon-box text-amber-500">
            <Trophy size={32} strokeWidth={1.5} />
          </div>
          <button className="launch-terminal-btn gold">Launch Challenge Assistant</button>
          <div className="launch-footer-text">
            <ShieldCheck size={12} /> FTMO / MyForexFunds / FundedNext Compatible
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropFirmChatSection;