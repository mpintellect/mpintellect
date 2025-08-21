'use client';
import React from 'react';

export default function AiToolsSection() {
  return (
    <section id="aitrading" className="bg-black text-white py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          AI-Powered Trading Tools
        </h2>
        <p className="text-gray-300 text-lg md:text-xl mb-12">
          Optimize your decisions using predictive models, automation, and machine learning–enhanced strategies.
        </p>
        {/* 🧠 Why Trade with AI – Simple Fade Card */}
<div className="ai-why-card scroll-fade-up">
  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Why Trade with AI?</h3>
  <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-4">
    AI-based systems can monitor markets 24/7, eliminate emotional bias, and adapt to fast-changing conditions in real time.
    With access to large datasets, machine learning models can detect subtle trends and hidden patterns that manual traders often miss.
  </p>
  <p className="text-gray-400 text-base md:text-lg leading-relaxed">
    Whether you’re new to trading or managing multiple strategies, AI tools can support your process, reduce decision fatigue,
    and improve timing with automated execution and optimization.
  </p>
</div>
        <div className="grid md:grid-cols-3 gap-6">
          {/* 🔹 Signal Bot */}
          <div className="ai-tool-card">
            <h3 className="tool-title">Signal Bot</h3>
            <p className="tool-description">
              Get instant alerts based on AI-detected price action patterns and volatility shifts. Perfect for traders who need timely market updates.
            </p>
            <a href="/ai-robot" className="ai-cta-button">Explore Signal Bot →</a>
          </div>

          {/* 🔹 Backtesting Engine */}
          <div className="ai-tool-card">
            <h3 className="tool-title">Backtesting Engine</h3>
            <p className="tool-description">
              Simulate and validate your strategy across historical data. Adjust parameters and discover performance trends before risking real capital.
            </p>
            <a href="/ai-robot" className="ai-cta-button">Try Backtesting Tool →</a>
          </div>

          {/* 🔹 AI Advisor */}
          <div className="ai-tool-card">
            <h3 className="tool-title">AI Advisor</h3>
            <p className="tool-description">
              Let AI analyze market conditions and recommend trading ideas that align with your style — from swing trades to scalping.
            </p>
            <a href="/ai-robot" className="ai-cta-button">Meet Your AI Advisor →</a>
          </div>
          <p className="text-gray-300 text-sm italic">
            ⚡ Automate. Adapt. Advance — all with AI.
          </p>
        </div>
      </div>
    </section>
  );
}