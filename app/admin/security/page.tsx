'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Monitor, AlertTriangle } from 'lucide-react';
import { ADMIN_SESSION_KEY, ADMIN_SESSION_TOKEN_KEY } from '../useAdminKey';

// ----------------------------------------------------------------------------
// Device/session list for /admin logins (functions/api/admin/sessions.ts),
// fed by functions/api/admin/validate.ts logging a row to admin_sessions on
// every successful password+TOTP login. "Disconnect" revokes that session,
// which logs it out of the /admin UI within ~30s (AdminGateProvider's
// heartbeat) - it does NOT block that device from re-entering the password
// + a fresh TOTP code, and it does NOT affect the other admin/* API
// endpoints' own auth (still a static ADMIN_PASSWORD bearer check). This is
// visibility into who's accessed the panel and when, plus a soft kick, not
// a hard access-revocation boundary by itself.
// ----------------------------------------------------------------------------

interface Session {
  id: string;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
  last_seen_at: string;
  revoked: number;
}

function authHeaders() {
  return { Authorization: `Bearer ${sessionStorage.getItem(ADMIN_SESSION_KEY) || ''}` };
}

function shortUserAgent(ua: string | null): string {
  if (!ua) return 'Unknown device';
  const browser = ua.match(/(Chrome|Firefox|Safari|Edg)\/[\d.]+/)?.[0]?.replace('Edg/', 'Edge/') || 'Unknown browser';
  const os =
    ua.match(/Windows NT [\d.]+/)?.[0] ||
    ua.match(/Mac OS X [\d_]+/)?.[0]?.replace(/_/g, '.') ||
    ua.match(/Android [\d.]+/)?.[0] ||
    ua.match(/iPhone OS [\d_]+/)?.[0]?.replace(/_/g, '.') ||
    (ua.includes('Linux') ? 'Linux' : 'Unknown OS');
  return `${browser} on ${os}`;
}

export default function SecurityAdmin() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/sessions', { headers: authHeaders() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load sessions');
      setSessions(json.sessions || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setCurrentSessionId(sessionStorage.getItem(ADMIN_SESSION_TOKEN_KEY));
    load();
  }, [load]);

  const handleDisconnect = async (id: string) => {
    if (id === currentSessionId) {
      if (!confirm('This disconnects the device you are using right now. Continue?')) return;
    }
    try {
      const res = await fetch('/api/admin/sessions', {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to disconnect');
      await load();
    } catch (e: any) {
      setError(e.message || 'Failed to disconnect');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 mb-2">
          <ArrowLeft size={14} /> Admin
        </Link>
        <h1 className="text-2xl font-bold mb-1">Security</h1>
        <p className="text-sm text-slate-500 mb-6">
          Devices that have logged into /admin with the password + authenticator code.
        </p>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading…</div>
        ) : sessions.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-400 border border-slate-200 rounded-xl">
            No logins recorded yet.
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-200">
                  <th className="py-2 px-4">Device</th>
                  <th className="py-2 px-4">IP Address</th>
                  <th className="py-2 px-4">First Seen</th>
                  <th className="py-2 px-4">Last Seen</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-2 px-4 text-slate-700">
                      <div className="flex items-center gap-2">
                        <Monitor size={14} className="text-slate-400" />
                        {shortUserAgent(s.user_agent)}
                        {s.id === currentSessionId && (
                          <span className="text-xs text-blue-600 font-medium">(this device)</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-4 text-slate-500 font-mono text-xs">{s.ip || '—'}</td>
                    <td className="py-2 px-4 whitespace-nowrap text-slate-500">
                      {new Date(s.created_at).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap text-slate-500">
                      {new Date(s.last_seen_at).toLocaleString()}
                    </td>
                    <td className="py-2 px-4">
                      {s.revoked ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                          Disconnected
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-right">
                      {!s.revoked && (
                        <button
                          onClick={() => handleDisconnect(s.id)}
                          className="text-xs text-slate-400 hover:text-red-600"
                        >
                          Disconnect
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
