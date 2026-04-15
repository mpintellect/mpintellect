import React from 'react';

export default function AboutPage() {
  return (
    <main className="section-container about-container">
      <h1 className="section-title">👋 About MPIntellect Intelligence</h1>

      <p className="about-text">
        MPIntellect Intelligence is a premium digital platform. We are built to empower traders with cutting-edge AI tools, institutional-grade simulations, and real-time market data. We help you deconstruct market structure and simulate setups to gain a deeper understanding of market behavior—before you risk capital.
      </p>

      <p className="about-text">
        Our mission is simple: democratize smart trading technology and make it accessible to every trader—whether you're just getting started or scaling a professional strategy. No signals. No get-rich-quick promises. Just the intelligence you need to make smarter, more confident trading decisions.
      </p>

      <p className="about-text">
        Trusted by thousands of traders globally, our ecosystem provides:
      </p>

      <ul className="about-list">
        <li><strong>AI Trader Assistant:</strong> Instantly simulate SL/TP levels, margin requirements, and risk metrics with a simulated M5 price path.</li>
        <li><strong>AI ChatBox:</strong> Validate your trading setups and receive real-time intelligence through our specialized financial AI agent.</li>
        <li><strong>Live News Feed:</strong> Institutional-grade news terminal delivering real-time updates across global markets. Filter by symbol, region, or impact level, with AI-powered sentiment scoring to gauge market reaction before price moves.</li>
        <li><strong>Intelligence Feed:</strong> Live fundamental analysis and breaking news categorized by asset class, keeping you ahead of market volatility.</li>
        <li><strong>Market Consensus Polls:</strong> Participate in and view real-time community sentiment on major geopolitical and macro events.</li>
        <li><strong>MT5 Automation:</strong> Downloadable Expert Advisors (EAs) engineered for high-precision execution in MetaTrader 5.</li>
        <li><strong>Professional Resources:</strong> Institutional risk calculators, educational PDFs, and smart onboarding tools.</li>
      </ul>

      <p className="about-contact">
        Want to connect or collaborate? Reach out via{' '}
        <a href="mailto:contact@mpintellect.com" className="about-link">contact@mpintellect.com</a>.
      </p>
    </main>
  );
}