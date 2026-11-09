'use client';

import { useState, type FormEvent } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// ----------------------------------------------------------------------------
// Password + TOTP two-factor gate. One shared admin account (matching
// ADMIN_PASSWORD's own single-secret model - see functions/api/admin/
// validate.ts), so the whole flow is driven by a single endpoint's `reason`
// field rather than separate login/register pages:
//   'password'       -> wrong password, try again
//   'setup_required'  -> no 2FA configured yet - fetch a new secret from
//                        /api/admin/totp/setup and show the QR step
//   'confirm_setup'   -> a secret exists but hasn't been confirmed with a
//                        code yet (e.g. a previous setup was abandoned) -
//                        same QR step, regenerates the secret
//   'code_required'   -> 2FA is active, enter the 6-digit code
//   'bad_code'        -> wrong code, try again (same step)
//   'locked'          -> too many wrong codes - cooldown, see lockedUntil
// ----------------------------------------------------------------------------

type Step = 'password' | 'setup' | 'code';

function lockMessage(lockedUntil?: string): string {
  if (!lockedUntil) return 'Too many wrong codes - try again shortly.';
  const seconds = Math.max(0, Math.round((new Date(lockedUntil).getTime() - Date.now()) / 1000));
  const minutes = Math.ceil(seconds / 60);
  return `Too many wrong codes. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`;
}

export function AdminGate({ onUnlock }: { onUnlock: (key: string, sessionToken?: string) => void }) {
  const [step, setStep] = useState<Step>('password');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [secret, setSecret] = useState('');
  const [otpauthUrl, setOtpauthUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function startSetup(pwd: string) {
    const res = await fetch('/api/admin/totp/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwd }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Could not start 2FA setup');
    setSecret(data.secret);
    setOtpauthUrl(data.otpauthUrl);
    setStep('setup');
  }

  async function submitPassword(e: FormEvent) {
    e.preventDefault();
    if (!password.trim()) {
      setError('Enter the admin password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.valid) {
        onUnlock(password, data.sessionToken);
        return;
      }
      if (data.reason === 'setup_required' || data.reason === 'confirm_setup') {
        await startSetup(password);
      } else if (data.reason === 'code_required') {
        setStep('code');
      } else if (data.reason === 'locked') {
        setStep('code');
        setError(lockMessage(data.lockedUntil));
      } else if (data.reason === 'password') {
        setError('Incorrect password');
      } else {
        // No recognized `reason` means validate.ts's try/catch caught an
        // unexpected error (e.g. a D1 outage) rather than actually checking
        // the password - showing "Incorrect password" here would be a lie.
        setError(data.error || 'Could not verify the password right now - try again in a moment');
      }
    } catch (e: any) {
      setError(e.message || 'Could not reach the server');
    } finally {
      setLoading(false);
    }
  }

  async function submitCode(e: FormEvent) {
    e.preventDefault();
    if (!/^\d{6}$/.test(code.trim())) {
      setError('Enter the 6-digit code from your authenticator app');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, code: code.trim() }),
      });
      const data = await res.json();
      if (data.valid) {
        onUnlock(password, data.sessionToken);
      } else if (data.reason === 'locked') {
        setError(lockMessage(data.lockedUntil));
        setCode('');
      } else if (data.reason === 'bad_code') {
        setError('Incorrect code - check your authenticator app and try again');
        setCode('');
      } else {
        // Same reasoning as submitPassword above: an unrecognized `reason`
        // means the server hit an unexpected error (e.g. a D1 outage), not
        // that the code was actually checked and found wrong.
        setError(data.error || 'Could not verify the code right now - try again in a moment');
        setCode('');
      }
    } catch (e: any) {
      setError(e.message || 'Could not reach the server');
    } finally {
      setLoading(false);
    }
  }

  if (step === 'setup') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-8">
        <form onSubmit={submitCode} className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-slate-700">
            <ShieldCheck size={18} />
            <h1 className="text-lg font-semibold">Set up Two-Factor Authentication</h1>
          </div>
          <p className="mb-4 text-sm text-slate-500">
            Scan this with Google Authenticator (or any TOTP app), then enter the 6-digit code it shows.
          </p>
          <div className="mb-4 flex justify-center rounded-lg border border-slate-200 p-4">
            <QRCodeSVG value={otpauthUrl} size={180} />
          </div>
          <p className="mb-4 text-center text-xs text-slate-400">
            Can&apos;t scan? Enter this key manually: <span className="font-mono text-slate-600">{secret}</span>
          </p>
          <input
            type="text"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="123456"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-center text-lg tracking-widest focus:border-blue-500 focus:outline-none"
            autoFocus
          />
          {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? 'Confirming...' : 'Confirm & Enable 2FA'}
          </button>
        </form>
      </div>
    );
  }

  if (step === 'code') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-8">
        <form onSubmit={submitCode} className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-slate-700">
            <ShieldCheck size={18} />
            <h1 className="text-lg font-semibold">Authenticator Code</h1>
          </div>
          <input
            type="text"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="123456"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-center text-lg tracking-widest focus:border-blue-500 focus:outline-none"
            autoFocus
          />
          {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Unlock'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-8">
      <form onSubmit={submitPassword} className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-slate-700">
          <Lock size={18} />
          <h1 className="text-lg font-semibold">Admin Access</h1>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          autoFocus
        />
        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Unlock'}
        </button>
      </form>
    </div>
  );
}
