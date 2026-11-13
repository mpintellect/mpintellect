'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { ADMIN_SESSION_KEY } from '../../admin/useAdminKey';

// Logos are stored as a data: URL directly in accountant_settings.company_logo
// (this site is output: 'export', static, no file/object storage exists) -
// kept small enough to stay well under D1's per-row size limit.
const MAX_LOGO_BYTES = 300 * 1024;

// ----------------------------------------------------------------------------
// Company profile shown on invoices (name/address/tax id, bank details) and
// the invoice-numbering counter - functions/api/admin/accountant/settings.ts,
// a plain key/value store (accountant_settings).
// ----------------------------------------------------------------------------

interface Settings {
  company_name: string;
  company_logo: string;
  company_address: string;
  company_tax_id: string;
  company_email: string;
  company_phone: string;
  bank_name: string;
  bank_account: string;
  bank_iban: string;
  bank_swift: string;
  invoice_prefix: string;
  next_invoice_number: string;
  default_currency: string;
  default_tax_rate: string;
}

function authHeaders() {
  return { Authorization: `Bearer ${sessionStorage.getItem(ADMIN_SESSION_KEY) || ''}` };
}

const FIELD_GROUPS: { title: string; fields: { key: keyof Settings; label: string; type?: string }[] }[] = [
  {
    title: 'Company Profile',
    fields: [
      { key: 'company_name', label: 'Company Name' },
      { key: 'company_address', label: 'Address' },
      { key: 'company_tax_id', label: 'Tax / ICE Number' },
      { key: 'company_email', label: 'Email' },
      { key: 'company_phone', label: 'Phone' },
    ],
  },
  {
    title: 'Bank Details (shown on invoices)',
    fields: [
      { key: 'bank_name', label: 'Bank Name' },
      { key: 'bank_account', label: 'Account Number' },
      { key: 'bank_iban', label: 'IBAN' },
      { key: 'bank_swift', label: 'SWIFT / BIC' },
    ],
  },
  {
    title: 'Invoice Defaults',
    fields: [
      { key: 'invoice_prefix', label: 'Invoice Number Prefix' },
      { key: 'next_invoice_number', label: 'Next Invoice Number', type: 'number' },
      { key: 'default_currency', label: 'Default Currency (USD or MAD)' },
      { key: 'default_tax_rate', label: 'Default Tax Rate (%)', type: 'number' },
    ],
  },
];

export default function AccountantSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogoChange = (e: { target: HTMLInputElement }) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !settings) return;
    if (file.size > MAX_LOGO_BYTES) {
      setMessage(`Logo too large (max ${Math.round(MAX_LOGO_BYTES / 1024)}KB) - resize it and try again.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setSettings({ ...settings, company_logo: String(reader.result || '') });
    reader.readAsDataURL(file);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/accountant/settings', { headers: authHeaders() });
      const data = await res.json();
      setSettings(data.settings);
    } catch {
      setMessage('Failed to load settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/accountant/settings', {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      setMessage('Saved.');
    } catch (e: any) {
      setMessage(e.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/accountant" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 mb-2">
            <ArrowLeft size={14} /> Accountant
          </Link>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        {loading || !settings ? (
          <div className="py-20 text-center text-slate-400">Loading…</div>
        ) : (
          <div className="space-y-8">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
              <h2 className="text-sm font-semibold text-slate-700 mb-4">Logo (shown on invoices)</h2>
              <div className="flex items-center gap-4">
                {settings.company_logo ? (
                  <img
                    src={settings.company_logo}
                    alt="Company logo"
                    className="h-16 max-w-[12rem] object-contain rounded border border-slate-200 p-1"
                  />
                ) : (
                  <div className="h-16 w-32 rounded border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400">
                    No logo
                  </div>
                )}
                <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 cursor-pointer hover:bg-slate-50">
                  <Upload size={14} /> {settings.company_logo ? 'Replace' : 'Upload'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                </label>
                {settings.company_logo && (
                  <button
                    onClick={() => setSettings({ ...settings, company_logo: '' })}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-500 hover:bg-slate-50"
                  >
                    <X size={14} /> Remove
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-2">PNG/JPG/SVG, max {Math.round(MAX_LOGO_BYTES / 1024)}KB. Saved with the rest of Settings below.</p>
            </div>

            {FIELD_GROUPS.map((group) => (
              <div key={group.title} className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                <h2 className="text-sm font-semibold text-slate-700 mb-4">{group.title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {group.fields.map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs text-slate-500 mb-1">{f.label}</label>
                      <input
                        type={f.type || 'text'}
                        value={settings[f.key]}
                        onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3B82F6] text-white text-sm font-medium disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? 'Saving…' : 'Save Settings'}
              </button>
              {message && <span className="text-sm text-slate-500">{message}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
