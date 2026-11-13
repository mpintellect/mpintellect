'use client';

import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Mail, ShieldCheck, ShieldAlert } from 'lucide-react';
import { ADMIN_SESSION_KEY } from '../useAdminKey';

// ----------------------------------------------------------------------------
// "Users" tab of app/admin/broker/page.tsx (moved here from the old
// standalone /admin/users route). Investizo Users list, deliberately NOT a
// full mirror - see schema.sql's broker_users comment: a complete backfill
// would be ~86 list-page requests plus one profile-page request PER USER
// (4,293 of them) just for email/phone, a far bigger footprint than
// anything else this app does against Investizo.
//
// So: "Seed users" (functions/api/admin/broker/users/sync.ts ->
// syncNewUsers()) only ever walks forward from the newest reg_date already
// in D1, i.e. only genuinely new registrations since the last click -
// normally 1-2 people, email/phone fetched automatically for each. Caps at
// 10 new users per click and warns instead of continuing further.
//
// "Get email/phone" per row is the separate lazy path for anyone already in
// D1 that didn't go through that auto-fetch (the very first backfill, or
// anyone added before this field existed) - one request, only on click,
// cached permanently after.
// ----------------------------------------------------------------------------

interface UserRow {
  investizo_id: string;
  name: string;
  country: string;
  verification_status: string;
  reg_date: string;
  last_visit: string;
  partner: string;
  manager: string;
  email: string | null;
  phone: string | null;
  detail_fetched_at: string | null;
  synced_at: string;
}

// A user with at least one deposit or withdrawal row - see
// functions/api/admin/broker/data.ts's ACTIVE_USERS_CTE. Computed straight
// off broker_deposits/broker_withdrawals (fully synced), not off the
// deliberately-partial broker_users table above, so this list isn't capped
// by how many users have been "Seed users"-ed.
interface ActiveUserRow {
  user_name: string;
  country: string | null;
  verification_status: string | null;
  email: string | null;
  phone: string | null;
  deposit_count: number;
  total_deposited: number;
  withdrawal_count: number;
  total_withdrawn: number;
}

function money(n: number | null | undefined) {
  if (n === null || n === undefined) return '—';
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function authHeaders() {
  return { Authorization: `Bearer ${sessionStorage.getItem(ADMIN_SESSION_KEY) || ''}` };
}

export default function UsersSection({
  activeUsers,
  activeUsersCount,
}: {
  activeUsers: ActiveUserRow[];
  activeUsersCount: number;
}) {
  const [view, setView] = useState<'seeded' | 'active'>('seeded');
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [fetchingId, setFetchingId] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/broker/users/data', { headers: authHeaders() });
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      setStatus('Failed to load users from D1.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSeed = async () => {
    setSeeding(true);
    setStatus('Checking for new registrations…');
    try {
      const res = await fetch('/api/admin/broker/users/sync', { method: 'POST', headers: authHeaders() });
      const data = await res.json();
      const prefix = !data.ok ? '❌' : data.capped ? '⚠️' : '✅';
      setStatus(`${prefix} ${data.message}`);
      if (data.ok) await loadUsers();
    } catch {
      setStatus('❌ Network error during seed.');
    } finally {
      setSeeding(false);
    }
  };

  const handleGetDetail = async (id: string) => {
    setFetchingId(id);
    try {
      const res = await fetch('/api/admin/broker/users/detail', {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.investizo_id === id ? { ...u, email: data.email, phone: data.phone, detail_fetched_at: new Date().toISOString() } : u))
        );
      } else {
        setStatus(`❌ ${data.message || 'Could not fetch email/phone'}`);
      }
    } catch {
      setStatus('❌ Network error fetching detail.');
    } finally {
      setFetchingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex border border-slate-200 rounded-lg overflow-hidden text-sm">
          <button
            onClick={() => setView('seeded')}
            className={`px-3 py-1.5 font-medium ${
              view === 'seeded' ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'
            }`}
          >
            Seeded Users ({users.length})
          </button>
          <button
            onClick={() => setView('active')}
            className={`px-3 py-1.5 font-medium ${
              view === 'active' ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'
            }`}
          >
            Active Users ({activeUsersCount.toLocaleString()})
          </button>
        </div>
        {view === 'seeded' && (
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {seeding ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            {seeding ? 'Checking…' : 'Seed users (new only)'}
          </button>
        )}
      </div>

      {view === 'active' && (
        <div>
          <div className="text-xs text-slate-400 mb-3">
            {activeUsersCount.toLocaleString()} user{activeUsersCount === 1 ? '' : 's'} with at least one deposit or
            withdrawal, matched by name across both tables - not limited to users "Seed users" has fetched detail for.
          </div>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase">
                  <th className="py-2 px-3 text-left">Name</th>
                  <th className="py-2 px-3 text-left">Country</th>
                  <th className="py-2 px-3 text-left">Verification</th>
                  <th className="py-2 px-3 text-left">Email</th>
                  <th className="py-2 px-3 text-left">Phone</th>
                  <th className="py-2 px-3 text-right">Deposits</th>
                  <th className="py-2 px-3 text-right">Deposited</th>
                  <th className="py-2 px-3 text-right">Withdrawals</th>
                  <th className="py-2 px-3 text-right">Withdrawn</th>
                </tr>
              </thead>
              <tbody>
                {activeUsers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-6 text-center text-slate-400">
                      No active users yet.
                    </td>
                  </tr>
                ) : (
                  activeUsers.map((u) => (
                    <tr key={u.user_name} className="border-t border-slate-100">
                      <td className="py-2 px-3 font-medium text-slate-900">{u.user_name}</td>
                      <td className="py-2 px-3">{u.country || <span className="text-slate-300">—</span>}</td>
                      <td className="py-2 px-3">
                        {u.verification_status === 'verified' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600">
                            <ShieldCheck size={14} /> Verified
                          </span>
                        ) : u.verification_status ? (
                          <span className="inline-flex items-center gap-1 text-slate-400">
                            <ShieldAlert size={14} /> Unverified
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="py-2 px-3">{u.email || <span className="text-slate-300">—</span>}</td>
                      <td className="py-2 px-3">{u.phone || <span className="text-slate-300">—</span>}</td>
                      <td className="py-2 px-3 text-right">{u.deposit_count}</td>
                      <td className="py-2 px-3 text-right font-medium text-slate-700">{money(u.total_deposited)}</td>
                      <td className="py-2 px-3 text-right">{u.withdrawal_count}</td>
                      <td className="py-2 px-3 text-right font-medium text-slate-700">{money(u.total_withdrawn)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'seeded' && status && (
        <div
          className={`mb-4 text-sm rounded-lg px-4 py-2 border ${
            status.startsWith('⚠️')
              ? 'text-amber-700 bg-amber-50 border-amber-200'
              : status.startsWith('❌')
              ? 'text-red-700 bg-red-50 border-red-200'
              : 'text-slate-600 bg-slate-50 border-slate-200'
          }`}
        >
          {status}
        </div>
      )}

      {view === 'seeded' && (
        <>
          <div className="text-xs text-slate-400 mb-3">
            {users.length} user{users.length === 1 ? '' : 's'} synced. Email/phone are fetched one at a time, on demand.
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase">
                  <th className="py-2 px-3 text-left">Name</th>
                  <th className="py-2 px-3 text-left">Country</th>
                  <th className="py-2 px-3 text-left">Verification</th>
                  <th className="py-2 px-3 text-left">Reg Date</th>
                  <th className="py-2 px-3 text-left">Last Visit</th>
                  <th className="py-2 px-3 text-left">Email</th>
                  <th className="py-2 px-3 text-left">Phone</th>
                  <th className="py-2 px-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-slate-400">
                      Loading…
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-slate-400">
                      No users yet - click "Seed users" above.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.investizo_id} className="border-t border-slate-100">
                      <td className="py-2 px-3 font-medium text-slate-900">{u.name}</td>
                      <td className="py-2 px-3">{u.country}</td>
                      <td className="py-2 px-3">
                        {u.verification_status === 'verified' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600">
                            <ShieldCheck size={14} /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400">
                            <ShieldAlert size={14} /> Unverified
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap">{u.reg_date}</td>
                      <td className="py-2 px-3 whitespace-nowrap">{u.last_visit}</td>
                      <td className="py-2 px-3">{u.email || <span className="text-slate-300">—</span>}</td>
                      <td className="py-2 px-3">{u.phone || <span className="text-slate-300">—</span>}</td>
                      <td className="py-2 px-3">
                        {!u.detail_fetched_at && (
                          <button
                            onClick={() => handleGetDetail(u.investizo_id)}
                            disabled={fetchingId === u.investizo_id}
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
                          >
                            <Mail size={14} />
                            {fetchingId === u.investizo_id ? 'Fetching…' : 'Get email/phone'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
