'use client';

import { useEffect } from 'react';

type Props = {
  open: boolean;
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
  onSave: () => void;
};

export default function LicenseModal({ open, value, onChange, onClose, onSave }: Props) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="ta-lic-overlay" role="dialog" aria-modal="true">
      <div className="ta-lic-backdrop" onClick={onClose} />
      <div className="ta-lic-modal">
        <h3 className="ta-lic-title">Enter License Key</h3>
        <p className="ta-lic-text">
          Paste the license code sent to your email after payment.
        </p>

        <input
          className="ta-input ta-lic-input"
          placeholder="XXXX-XXXX-XXXX-XXXX"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        <div className="ta-lic-actions">
          <button className="ta-link-btn" onClick={onClose}>Cancel</button>
          <button className="ta-btn" onClick={onSave}>Activate</button>
        </div>
      </div>
    </div>
  );
}