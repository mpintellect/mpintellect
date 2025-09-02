'use client';

export default function TrustSection() {
  return (
    <section id="trust" className="trust-section">
      <div className="trust-container">
        {/* Existing trust items */}
        <div className="trust-item">
          <img
            src="https://img.icons8.com/ios-filled/50/00e676/lock--v1.png"
            alt="SSL Secure"
            className="trust-icon"
          />
          <div className="trust-title">SSL Secure</div>
          <div className="trust-desc">Your connection is encrypted</div>
        </div>

        <div className="trust-item">
          <img
            src="https://img.icons8.com/ios-filled/50/00bcd4/shield.png"
            alt="Regulated Partner"
            className="trust-icon"
          />
          <div className="trust-title">Regulated Partner</div>
          <div className="trust-desc">Licensed & compliant brokerage</div>
        </div>

        <div className="trust-item">
          <img
            src="https://img.icons8.com/ios-filled/50/f48fb1/bank-card-back-side.png"
            alt="Secure Payments"
            className="trust-icon"
          />
          <div className="trust-title">Secure Payments</div>
          <div className="trust-desc">Your transactions are protected</div>
        </div>

        <div className="trust-item">
          <img
            src="https://img.icons8.com/ios-filled/50/ffc107/privacy.png"
            alt="GDPR Compliant"
            className="trust-icon"
          />
          <div className="trust-title">GDPR Compliant</div>
          <div className="trust-desc">We respect your privacy rights</div>
        </div>
      </div>
    </section>
  );
}