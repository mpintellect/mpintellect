'use client';

import { useEffect, useState } from 'react';
import { browserFingerprint } from '@/helpers/licenseClient';

type Props = {
  open: boolean;
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
  onSave?: () => void; // optional now
};

export default function LicenseModal({ open, value, onChange, onClose, onSave }: Props) {
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;

  async function handleActivate() {
    const key = value.trim();
    if (!key) {
      alert('Please paste your license key first.');
      return;
    }
    try {
      setSubmitting(true);
      const fp = await browserFingerprint();
      const r = await fetch('/api/license/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, fingerprint: fp }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j?.ok) {
        alert(j?.error || 'Activation failed');
        return;
      }
      localStorage.setItem('mz_license_key', key);
      alert('License activated ✅');
      onSave?.();       // notify parent if it wants to react
      onClose();        // close modal
    } catch (e: any) {
      alert(e?.message || 'Activation error');
    } finally {
      setSubmitting(false);
    }
  }

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
          autoFocus
        />

        <div className="ta-lic-actions">
          <button className="ta-link-btn" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button
            className="ta-btn"
            onClick={handleActivate}
            disabled={!value.trim() || submitting}
          >
            {submitting ? 'Activating…' : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  );
}