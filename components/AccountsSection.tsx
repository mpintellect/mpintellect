'use client';

export default function AccountsSection() {
  return (
    <section id="accounts" className="w-full max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-12">
        Choose Your Account Type
      </h2>

      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">

        {/* 🔹 CLASSIC ACCOUNT */}
        <div
          className="account-column"
          style={{ '--delay': '0.2s' } as React.CSSProperties}
        >
          <div className="title">
            <span>🔹</span>
            <span>Classic – Start Smart</span>
          </div>

          <div className="description">
            A streamlined setup for those who prefer structure and predictability.<br /><br />
            ✅ Stable trading conditions<br />
            ✅ Simple order execution<br />
            ✅ No commission per trade<br />
            ✅ Suitable for step-by-step growth
          </div>

          <a
  href="https://my.litefinance.org/registration?uid=967798214&cid=325438&utm_source=carrd&utm_medium=landing&utm_campaign=mzprimer_classic"
  target="_blank"
  rel="noopener noreferrer"
  className="cta-button"
  data-cta="true"
  data-cta-name="Start Classic"
  data-ads-send-to="AW-16927724463/n3hlCNmcy6oaEK-n4oc_"
  data-value="1.0"
  data-currency="MAD"
>
  Start with Classic →
</a>
        </div>

        {/* 🟡 ECN ACCOUNT */}
        <div
          className="ecn-column"
          style={{ '--delay': '0.4s' } as React.CSSProperties}
        >
          <div className="title">🟡 ECN – Direct Execution</div>

          <div className="description">
            Designed for users who value fast market access and flexible pricing.<br /><br />
            ⚡ Raw spreads with small transaction cost<br />
            ⚙️ Direct-to-market execution<br />
            📊 Transparent conditions<br />
            🧠 Ideal for algorithmic and strategy-based trading
          </div>

          <a
  href="https://my.litefinance.org/registration?uid=967798214&cid=325438&utm_source=carrd&utm_medium=landing&utm_campaign=mzprimer_ecn"
  target="_blank"
  rel="noopener noreferrer"
  className="cta-button"
  data-cta="true"
  data-cta-name="Open ECN Account"
  data-ads-send-to="AW-16927724463/n3hlCNmcy6oaEK-n4oc_"
  data-value="1.0"
  data-currency="MAD"
>
  Open ECN Account →
</a>
        </div>
      </div>

      {/* 🔽 COMPARISON TABLE */}
      <div className="account-table scroll-fade mt-20 overflow-x-auto">
        <table className="w-full border-collapse text-sm text-left text-gray-300 min-w-[700px]">
          <thead>
            <tr className="text-white text-base border-b border-gray-700">
              <th className="px-4 py-3">Feature</th>
              <th className="px-4 py-3">Classic</th>
              <th className="px-4 py-3">ECN</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-800">
              <td className="px-4 py-3">Spread Type</td>
              <td className="px-4 py-3">Fixed / Variable</td>
              <td className="px-4 py-3">Raw (tight)</td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="px-4 py-3">Commission</td>
              <td className="px-4 py-3">No</td>
              <td className="px-4 py-3">Yes</td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="px-4 py-3">Execution</td>
              <td className="px-4 py-3">Market Maker</td>
              <td className="px-4 py-3">Direct Market Access</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Recommended For</td>
              <td className="px-4 py-3">Beginners & casual traders</td>
              <td className="px-4 py-3">Experienced or automated traders</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}