'use client';
import React, { useState } from 'react';

export default function PrivacySection() {
  const [showPolicy, setShowPolicy] = useState(false);

  return (
    <section id="privacy" className="w-full max-w-4xl mx-auto px-6 py-20 text-gray-300">
      {!showPolicy && (
        <div className="text-center mb-12">
          <button
            onClick={() => setShowPolicy(true)}
            className="privacy-toggle-button"
          >
            View Our Privacy Policy
          </button>
        </div>
      )}

      {showPolicy && (
        <div className="privacy-box scroll-fade">
          <h1 className="privacy-title">Privacy Policy</h1>
          <p><strong>Last updated:</strong> May 2025</p>
          <p>This Privacy Policy explains how we collect, use, and protect your personal data when you visit and interact with our website.</p>

          <h2 className="privacy-subtitle">1. Information We Collect</h2>
          <p>We may collect personal information you provide to us such as your name, email address, and any other information submitted via contact forms or signups.</p>

          <h2 className="privacy-subtitle">2. How We Use Your Information</h2>
          <ul className="privacy-list">
            <li>To provide and improve our services.</li>
            <li>To respond to inquiries and support requests.</li>
            <li>To send updates, newsletters, or promotional content if consented.</li>
            <li>To analyze site usage and optimize performance.</li>
          </ul>

          <h2 className="privacy-subtitle">3. Cookies and Tracking Technologies</h2>
          <p>We use cookies to personalize your experience and analyze traffic. You may manage or disable cookies via your browser settings.</p>

          <h2 className="privacy-subtitle">4. Third-Party Services</h2>
          <p>We may use third-party tools (e.g., analytics platforms, advertising services) that collect anonymous usage data to improve our services. These services comply with GDPR and data protection standards.</p>

          <h2 className="privacy-subtitle">5. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information. Contact us via the{' '}
            <a href="#contacts" className="privacy-link">contact section</a> to make a request.
          </p>

          <h2 className="privacy-subtitle">6. Changes to This Policy</h2>
          <p>We may update this policy periodically. Updates will be posted on this page with the latest revision date.</p>

          <h2 className="privacy-subtitle">7. Contact</h2>
          <p>
            If you have questions about this Privacy Policy, please reach out through the{' '}
            <a href="#contacts" className="privacy-link">Contact</a> section.
          </p>
          <h1 className="privacy-title">Terms of Use</h1>
          <p><strong>Last updated:</strong> May 2025</p>

          <h2 className="privacy-subtitle">1. Acceptance of Terms</h2>
          <p>
            By accessing and using our website, you agree to be bound by these Terms of Use and all applicable laws. If you do not agree, please do not use the website.
          </p>

          <h2 className="privacy-subtitle">2. Use of Content</h2>
          <p>
            All materials and content available on this website are for informational purposes only. You may not copy, modify, distribute, or republish any part without written consent.
          </p>

          <h2 className="privacy-subtitle">3. User Conduct</h2>
          <p>
            You agree not to use the site for any unlawful or abusive purpose. Misuse of the site or its content may result in restricted access or removal.
          </p>

          <h2 className="privacy-subtitle">4. Third-Party Links</h2>
          <p>
            Our website may include links to third-party services. We are not responsible for their content, accuracy, or privacy practices.
          </p>

          <h2 className="privacy-subtitle">5. No Financial Advice</h2>
          <p>
            The information provided on this site does not constitute personalized investment or financial advice. You are responsible for your own decisions and should consult professionals as needed.
          </p>

          <h2 className="privacy-subtitle">6. Modifications</h2>
          <p>
            We may update these Terms at any time. Changes will be posted on this page with the latest revision date.
          </p>

          <h2 className="privacy-subtitle">7. Contact</h2>
          <p>
            If you have questions about these Terms, please reach out through the{' '}
            <a href="#contacts" className="privacy-link">Contact</a> section.
          </p>
        </div>
      )}
    </section>
  );
}