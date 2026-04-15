// app/legal/page.tsx

import React from 'react';

export default function LegalPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16 text-gray-300">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
        📜 Legal Information
      </h1>

      {/* === Table of Contents === */}
      <nav className="mb-10 text-center space-x-4">
        <a href="#privacy" className="text-yellow-400 hover:underline">Privacy Policy</a>
        <a href="#terms" className="text-yellow-400 hover:underline">Terms of Use</a>
        <a href="#disclaimer" className="text-yellow-400 hover:underline">Disclaimer</a>
      </nav>

      {/* === Privacy Policy === */}
      <section id="privacy" className="mb-16 scroll-mt-20">
        <h2 className="text-2xl font-bold text-white mb-4">🔐 Privacy Policy</h2>
        <p className="mb-4">
          We value your privacy. MPIntellect Intelligence collects minimal personal data required to deliver services, such as email and interaction logs for our AI tools. Data is stored securely and never sold.
        </p>
        <p className="mb-4">
          We use cookies and analytics tools (e.g., Google Analytics) to improve your experience and performance tracking. You may opt out anytime.
        </p>
        <p>
          If you wish to delete or access your data, please contact us at: <a href="mailto:contact@mpintellect.com" className="text-yellow-400 underline">contact@MPIntellect.com</a>
        </p>
      </section>

      {/* === Terms of Use === */}
      <section id="terms" className="mb-16 scroll-mt-20">
        <h2 className="text-2xl font-bold text-white mb-4">📘 Terms of Use</h2>
        <p className="mb-4">
          By using MPIntellect Intelligence services, you agree not to misuse the tools or attempt to bypass access controls. Our tools are provided “as is” without guarantees of performance or market accuracy.
        </p>
        <p className="mb-4">
          You may not redistribute or resell any tools, code, or assets without written permission. All rights are reserved by MPIntellect Intelligence LTD.
        </p>
        <p>
          Use of this platform implies your full understanding that it is for educational and simulation purposes, not trading advice.
        </p>
      </section>

      {/* === Disclaimer === */}
      <section id="disclaimer" className="scroll-mt-20">
        <h2 className="text-2xl font-bold text-white mb-4">⚠️ Disclaimer</h2>
        <p className="mb-4">
          MPIntellect Intelligence does not provide financial advice. All simulations, indicators, and educational content are designed for informational purposes only.
        </p>
        <p className="mb-4">
          Trading involves risk. Past performance is not indicative of future results. You are solely responsible for your financial decisions.
        </p>
        <p>
          Always consult with a certified financial advisor before making trading or investment decisions.
        </p>
      </section>
    </main>
  );
}