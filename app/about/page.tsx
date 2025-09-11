import React from 'react';

export default function AboutPage() {
  return (
    <main className="section-container about-container">
      <h1 className="section-title">👋 About MZPrimer</h1>

      <p className="about-text">
        MZPrimer is a UK-registered digital platform built to empower traders with cutting-edge AI tools, reliable simulations, and insightful education. We help you test trading scenarios, simulate setups, and gain a deeper understanding of market behavior—before you trade.
      </p>

      <p className="about-text">
        Our mission is simple: democratize smart trading technology and make it accessible to every trader—whether you're just getting started or scaling a strategy. No signals. No get-rich-quick promises. Just tools to help you make smarter, more confident trading decisions.
      </p>

      <p className="about-text">
        Trusted by thousands of traders globally, we offer:
      </p>

      <ul className="about-list">
        <li>AI-powered scenario simulators for Forex, Gold, and Crypto</li>
        <li>Downloadable Expert Advisors (EAs) for MetaTrader 5</li>
        <li>Risk calculators, educational PDFs, and smart onboarding tools</li>
      </ul>

      <p className="about-contact">
        Want to connect or collaborate? Reach out via{' '}
        <a href="mailto:contact@mzprimer.com" className="about-link">contact@mzprimer.com</a>.
      </p>
    </main>
  );
}