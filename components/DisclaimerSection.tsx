'use client';
export default function DisclaimerSection() {
  return (
    <section id="disclaimer" className="w-full max-w-4xl mx-auto px-6 py-16">
      <div className="disclaimer-box scroll-fade">
        <p className="disclaimer-heading">📌 Disclaimer:</p>
        <p>
          Trading financial instruments involves significant risk and may not be suitable for all investors.
          All content provided on this site is intended for educational and informational purposes only and does not constitute financial advice, a recommendation, or a solicitation to trade.
        </p>
        <p>
          Performance data is illustrative and past results do not guarantee future outcomes. Always evaluate your own risk tolerance and consult with a licensed financial advisor before making any investment decisions.
        </p>
        <p className="disclaimer-highlight">⚠️ Important:<br />
          We collaborate with regulated platforms, but the availability of features like leverage, trading tools, and promotions may vary depending on your location and trader profile. Always read the terms and conditions directly from the provider.
        </p>
      </div>
    </section>
  );
}