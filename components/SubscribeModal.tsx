"use client";

import React from "react";

type SubscribeModalProps = {
  onClose: () => void;
  onSubscribe: (priceId: string) => void;
};

export default function SubscribeModal({ onClose, onSubscribe }: SubscribeModalProps) {
  // Use your NEW one-time price IDs here
  const PRICE_24H = process.env.NEXT_PUBLIC_PRICE_ID_24H || "price_1SFbpBDoB4i1qeaLaPQQ0eW5";
  const PRICE_5D = process.env.NEXT_PUBLIC_PRICE_ID_5D || "price_1SFXpFDoB4i1qeaLJVQY6Cdb";

  return (
    <div className="subscribe-modal">
      <div className="modal-box">
        <h2 className="modal-title">🔑 Unlock Unlimited Analysis</h2>
        <p className="modal-desc">
          Choose a plan below to get your license key instantly and unlock all AI setups.
        </p>

        <div className="plans">
          <button
            onClick={() => onSubscribe(PRICE_24H)}
            className="plan-button"
          >
            $5 — 24h Unlimited Trades
          </button>

          <button
            onClick={() => onSubscribe(PRICE_5D)}
            className="plan-button"
          >
            $19.99 — 5 Days Unlimited Trades
          </button>
        </div>

        <button onClick={onClose} className="close-button">
          Cancel
        </button>
      </div>
    </div>
  );
}