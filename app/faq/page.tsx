import React from 'react';

export default function FAQPage() {
  return (
    <main className="section-container">
      <h1 className="section-title">❓ Frequently Asked Questions</h1>

      <div className="faq-list">
        <section className="faq-item">
          <h2 className="faq-question">What is MPIntellect Intelligence?</h2>
          <p className="faq-answer">
            MPIntellect Intelligence is a platform that provides AI-powered trading tools, educational content, and algorithmic solutions for traders.
          </p>
        </section>

        <section className="faq-item">
          <h2 className="faq-question">Is this suitable for beginners?</h2>
          <p className="faq-answer">
            Yes. We provide simple explanations and tools that help traders at any level simulate and learn before trading with real funds.
          </p>
        </section>

        <section className="faq-item">
          <h2 className="faq-question">Do I need to install software?</h2>
          <p className="faq-answer">
            No. Our AI tools run entirely online — just visit the tool page and start simulating trades in real time.
          </p>
        </section>

        <section className="faq-item">
          <h2 className="faq-question">Can I get support if I face issues?</h2>
          <p className="faq-answer">
            Yes. You can contact our support via email or live chat. We also provide quick troubleshooting FAQs inside each tool page.
          </p>
        </section>

        <section className="faq-item">
          <h2 className="faq-question">Is the AI Assistant really free?</h2>
          <p className="faq-answer">
            Yes. You can try the AI Assistant simulation tool for free, no registration required. For full access, we offer premium upgrades.
          </p>
        </section>

        <section className="faq-item">
          <h2 className="faq-question">What markets can I simulate?</h2>
          <p className="faq-answer">
            You can simulate Forex pairs, metals like Gold (XAUUSD), major indices, and crypto assets using our AI Assistant tool.
          </p>
        </section>

        <section className="faq-item">
          <h2 className="faq-question">Do you offer custom trading bots?</h2>
          <p className="faq-answer">
            Yes. You can purchase ready-made MT5 robots or request a custom algorithm built to your strategy. Delivery is done digitally after payment.
          </p>
        </section>

        <section className="faq-item">
          <h2 className="faq-question">Can I use this on mobile?</h2>
          <p className="faq-answer">
            Absolutely. All our tools and pages are mobile-friendly and optimized for both Android and iOS browsers.
          </p>
        </section>
      </div>
    </main>
  );
}