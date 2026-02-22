'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Globe, BarChart3, ShieldCheck } from 'lucide-react';

// CONFIG
const BROKER_LINK = "https://www.litefinance.org/fr/?uid=967798214";
const TOOLS_LINK = "/markets";

export default function StartPage() {

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_name: 'Gateway Page'
      });
    }
  }, []);

  const handleBrokerClick = () => {
    if ((window as any).fbq) {
      (window as any).fbq('track', 'Lead');
    }
    window.location.href = BROKER_LINK;
  };

  return (
    <div className="gateway-container">

      {/* Background effects */}
      <div className="gateway-glow glow-top-left" />
      <div className="gateway-glow glow-bottom-right" />

      <div className="gateway-content-wrapper">

        {/* Header */}
        <div className="gateway-header">
          <h1 className="gateway-h1">
            Choose Your <span>Access Mode</span>
          </h1>
          <p className="gateway-subtitle">
            Select how you would like to explore market data, tools, or third-party platforms.
          </p>
        </div>

        {/* OPTIONS */}
        <div className="choice-grid">

          {/* OPTION A */}
          <div onClick={handleBrokerClick} className="choice-card choice-card-blue">
            <div className="badge-new">OPTION A</div>

            <div className="choice-icon-box icon-box-blue">
              <Globe size={32} className="text-blue-400" />
            </div>

           <h3 className="choice-title title-blue">
  Get Started with Market Access
</h3>

<p className="choice-desc">
  Continue to a trusted trading environment and explore live markets,
  pricing, and platform features.
</p>

<ul className="feature-list">
  <li className="feature-item">
    <ShieldCheck size={18} /> Secure account access
  </li>
  <li className="feature-item">
    <ShieldCheck size={18} /> Multiple market instruments
  </li>
  <li className="feature-item">
    <ShieldCheck size={18} /> Platform-level execution
  </li>
</ul>

<button className="choice-btn choice-btn-primary">
  Continue <ArrowRight size={20} />
</button>
          </div>

          {/* OPTION B */}
          <Link href={TOOLS_LINK} className="block h-full">
            <div className="choice-card choice-card-green">

              <div className="choice-icon-box icon-box-green">
                <BarChart3 size={32} className="text-emerald-400" />
              </div>

              <h3 className="choice-title title-green">
                Explore AI Market Tools
              </h3>

              <p className="choice-desc">
                View data-driven market insights, charts, and analytical tools
                designed for research and educational purposes.
              </p>

              <ul className="feature-list">
                <li className="feature-item"> 
                  <ShieldCheck size={18} className="text-emerald-500" />
                  Market data visualization
                </li>
                <li className="feature-item">
                  <ShieldCheck size={18} className="text-emerald-500" />
                  Analytical indicators
                </li>
                <li className="feature-item">
                  <ShieldCheck size={18} className="text-emerald-500" />
                  Informational use only
                </li>
              </ul>

              <button className="choice-btn choice-btn-secondary">
                Open Tools <ArrowRight size={20} />
              </button>
            </div>
          </Link>

        </div>

        {/* Footer */}
        <div className="gateway-footer mx-auto">
          <p className="gateway-disclaimer">
            <strong>Disclaimer:</strong> MZPrimer Intelligence provides software tools and
            market analysis for informational and educational purposes only.
            We do not provide financial advice, investment recommendations,
            or brokerage services. Any external platforms are operated
            independently and subject to their own terms and regulations.
          </p>
        </div>

      </div>
    </div>
  );
}