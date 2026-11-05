'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Sheet } from 'lucide-react';
import { ADMIN_SESSION_KEY } from '../useAdminKey';
import MonthlyChart, { type MonthlyStat } from './MonthlyChart';
import MonthlyCountChart, { type MonthlyCount } from './MonthlyCountChart';
import MonthlyStatsTable from './MonthlyStatsTable';

// ----------------------------------------------------------------------------
// Broker (LiteFinance / admin.litefinance.com) panel. Pure read of what's
// already in D1 (functions/api/admin/broker-lite/data.ts) - unlike the
// Investizo panel, nothing here ever triggers a sync. Rows are pushed in by
// tampermonkey/litefinance-sync.user.js, run manually by the admin while
// connected to admin.litefinance.com - see functions/api/admin/broker-lite/
// sync.ts and schema.sql's litefinance_deposits comment for why (VPN+2FA+
// single-device blocks any Worker-based pull).
//
// Same section/tab visual convention as InvestizoPanel.tsx (underline
// tabs, no separate pill-style nav) so the two brokers read as one
// consistent dashboard, not two differently-styled pages stitched together.
// ----------------------------------------------------------------------------

interface TxRow {
  id: string;
  tx_date: string;
  user_name: string;
  country: string;
  verification_status: string;
  account: string;
  method: string;
  status: string;
  usd_amount: number | null;
  deposit_amount?: number | null;
  deposit_currency?: string;
  pay_amount?: number | null;
  pay_currency?: string;
  total_amount?: number | null;
  total_currency?: string;
  auto_test?: string;
}

interface UserRow {
  id: string;
  client_uid: string;
  name: string | null;
  email: string | null;
  country: string;
  account?: string | null;
  reg_date: string;
  phone: string | null;
  email_status: string | null;
  phone_status: string | null;
  client_status: string | null;
}

interface SyncLog {
  kind: string;
  page: number | null;
  rows_synced: number;
  status: string;
  message: string;
  created_at: string;
}

interface Totals {
  deposits_total_amount: number;
  deposits_success_count: number;
  deposits_declined_count: number;
  withdrawals_total_amount: number;
  withdrawals_done_count: number;
  withdrawals_failed_count: number;
  withdrawals_pending_count: number;
  unique_users: number;
  deposits_this_month_amount: number;
  withdrawals_this_month_amount: number;
}

// LocalOpsTotals is already from the CLIENT's point of view (the swap from
// LiteFinance's own raw_type happens once, in data.ts) - "deposits" here
// means a client depositing cash locally, "withdrawals" means a client
// cashing out locally. See schema.sql's litefinance_local_ops comment.
interface LocalOpsTotals {
  deposits_total_amount: number;
  deposits_count: number;
  withdrawals_total_amount: number;
  withdrawals_count: number;
  deposits_this_month_amount: number;
  withdrawals_this_month_amount: number;
}

interface LocalOpRow {
  id: string;
  tx_date: string;
  raw_type: 'Deposit' | 'Withdrawal';
  counterparty_account: string | null;
  op_ref: string | null;
  amount: number | null;
}

// A client is "active" if they have at least one deposit or withdrawal row
// (matched by LOWER(TRIM(name)) against user_name - there's no user id link
// between litefinance_users and litefinance_deposits/withdrawals). $ totals
// only sum successful rows; deposit_count/withdrawal_count count any status.
interface ActiveUserRow extends UserRow {
  deposit_count: number;
  total_deposited: number;
  withdrawal_count: number;
  total_withdrawn: number;
}

interface BrokerLiteData {
  deposits: TxRow[];
  withdrawals: TxRow[];
  users: UserRow[];
  localOps: LocalOpRow[];
  activeUsers: ActiveUserRow[];
  activeUsersCount: number;
  totalMoroccoUsersCount: number;
  lastSync: SyncLog | null;
  totals: Totals | null;
  localOpsTotals: LocalOpsTotals | null;
  monthlyStats: MonthlyStat[];
  monthlyRegistrations: MonthlyCount[];
}

const PAGE_SIZE = 50;

function authHeaders() {
  return { Authorization: `Bearer ${sessionStorage.getItem(ADMIN_SESSION_KEY) || ''}` };
}

function money(n: number | null | undefined, currency = '') {
  if (n === null || n === undefined) return '—';
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}${currency ? ' ' + currency : ''}`;
}

// "04.11.2026 01:54" -> "2026-11-04", to compare against <input type="date"> values.
function toISODate(dateStr: string): string {
  const [datePart] = (dateStr || '').split(' ');
  const [dd, mm, yyyy] = (datePart || '').split('.');
  if (!dd || !mm || !yyyy) return '';
  return `${yyyy}-${mm}-${dd}`;
}

function StatusBadge({ status }: { status: string }) {
  const s = (status || '').toLowerCase();
  const color =
    s === 'deposited' || s === 'done' || s === 'done auto'
      ? 'bg-emerald-50 text-emerald-600'
      : s === 'declined' || s === 'error' || s === 'return'
        ? 'bg-red-50 text-red-600'
        : 'bg-amber-50 text-amber-600';
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>{status || '—'}</span>;
}

function StatCard({ label, value, sub, thisMonth }: { label: string; value: string; sub?: string; thisMonth?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-slate-400 font-semibold">{label}</div>
      <div className="mt-1 text-xl font-bold text-slate-800">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-slate-400">{sub}</div>}
      {thisMonth && <div className="mt-0.5 text-xs text-[#3B82F6] font-medium">{thisMonth}</div>}
    </div>
  );
}

// Distinct purple accent (vs. the plain white StatCard) so this stands out
// as a cross-reference between the Finance tab's Morocco deposits total and
// the Local Service tab's own "Local Balance Deposit" figure, rather than
// reading as just another deposits number.
function PercentageCard({ label, pct, sub }: { label: string; pct: number; sub?: string }) {
  return (
    <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-purple-400 font-semibold">{label}</div>
      <div className="mt-1 text-xl font-bold text-purple-700">{pct.toFixed(1)}%</div>
      {sub && <div className="mt-0.5 text-xs text-purple-400">{sub}</div>}
    </div>
  );
}

function sumAmount(rows: TxRow[]): number {
  return rows.reduce((total, r) => total + (r.usd_amount ?? 0), 0);
}

function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 px-4 py-3 text-sm border-t border-slate-200">
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40"
      >
        Prev
      </button>
      <span className="text-slate-500">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

function MultiSelectFilter({
  placeholder,
  options,
  selected,
  onToggle,
  onClear,
}: {
  placeholder: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);

  const label =
    selected.length === 0 ? placeholder : selected.length === 1 ? selected[0] : `${selected.length} selected`;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 min-w-[140px] text-left"
      >
        {label}
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-56 max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg p-2">
          {selected.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="w-full text-left text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
            >
              Clear selection
            </button>
          )}
          {options.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => onToggle(opt)}
                className="rounded border-slate-300"
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function DateRangeFilter({
  from,
  to,
  onFrom,
  onTo,
}: {
  from: string;
  to: string;
  onFrom: (v: string) => void;
  onTo: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="date"
        value={from}
        onChange={(e) => onFrom(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-600"
      />
      <span className="text-slate-400 text-sm">–</span>
      <input
        type="date"
        value={to}
        onChange={(e) => onTo(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-600"
      />
    </div>
  );
}

function TxTable({ rows, emptyMessage }: { rows: TxRow[]; emptyMessage: string }) {
  if (rows.length === 0) {
    return <div className="p-6 text-center text-sm text-slate-400">{emptyMessage}</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-200">
            <th className="py-2 px-3">Date</th>
            <th className="py-2 px-3">User</th>
            <th className="py-2 px-3">Country</th>
            <th className="py-2 px-3">Method</th>
            <th className="py-2 px-3">Account</th>
            <th className="py-2 px-3">USD Amount</th>
            <th className="py-2 px-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-2 px-3 whitespace-nowrap text-slate-500">{r.tx_date}</td>
              <td className="py-2 px-3 font-medium text-slate-700">{r.user_name}</td>
              <td className="py-2 px-3 text-slate-500">{r.country || '—'}</td>
              <td className="py-2 px-3 text-slate-500">{r.method}</td>
              <td className="py-2 px-3 text-slate-500">{r.account}</td>
              <td className="py-2 px-3 text-slate-700">{money(r.usd_amount, '$')}</td>
              <td className="py-2 px-3">
                <StatusBadge status={r.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UsersTable({ rows, emptyMessage }: { rows: UserRow[]; emptyMessage: string }) {
  if (rows.length === 0) {
    return <div className="p-6 text-center text-sm text-slate-400">{emptyMessage}</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-200">
            <th className="py-2 px-3">Reg Date</th>
            <th className="py-2 px-3">Name</th>
            <th className="py-2 px-3">Email</th>
            <th className="py-2 px-3">Phone</th>
            <th className="py-2 px-3">Country</th>
            <th className="py-2 px-3">Client Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={`${r.id || 'noid'}-${r.email || idx}`} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-2 px-3 whitespace-nowrap text-slate-500">{r.reg_date}</td>
              <td className="py-2 px-3 font-medium text-slate-700">{r.name || <span className="text-slate-300">—</span>}</td>
              <td className="py-2 px-3 text-slate-700">{r.email || <span className="text-slate-300">—</span>}</td>
              <td className="py-2 px-3 text-slate-700">{r.phone || <span className="text-slate-300">—</span>}</td>
              <td className="py-2 px-3 text-slate-500">{r.country || '—'}</td>
              <td className="py-2 px-3 text-slate-500">{r.client_status || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActiveUsersTable({ rows, emptyMessage }: { rows: ActiveUserRow[]; emptyMessage: string }) {
  if (rows.length === 0) {
    return <div className="p-6 text-center text-sm text-slate-400">{emptyMessage}</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-200">
            <th className="py-2 px-3">Reg Date</th>
            <th className="py-2 px-3">Name</th>
            <th className="py-2 px-3">Email</th>
            <th className="py-2 px-3">Client Status</th>
            <th className="py-2 px-3">Deposits</th>
            <th className="py-2 px-3">Withdrawals</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={`${r.id || 'noid'}-${r.email || idx}`} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-2 px-3 whitespace-nowrap text-slate-500">{r.reg_date}</td>
              <td className="py-2 px-3 font-medium text-slate-700">{r.name || <span className="text-slate-300">—</span>}</td>
              <td className="py-2 px-3 text-slate-700">{r.email || <span className="text-slate-300">—</span>}</td>
              <td className="py-2 px-3 text-slate-500">{r.client_status || '—'}</td>
              <td className="py-2 px-3 text-slate-700">
                {money(r.total_deposited, '$')} <span className="text-slate-400">({r.deposit_count})</span>
              </td>
              <td className="py-2 px-3 text-slate-700">
                {money(r.total_withdrawn, '$')} <span className="text-slate-400">({r.withdrawal_count})</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LocalOpsTable({ rows, emptyMessage }: { rows: LocalOpRow[]; emptyMessage: string }) {
  if (rows.length === 0) {
    return <div className="p-6 text-center text-sm text-slate-400">{emptyMessage}</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-200">
            <th className="py-2 px-3">Date</th>
            <th className="py-2 px-3">Account</th>
            <th className="py-2 px-3">Amount</th>
            <th className="py-2 px-3">Ref</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-2 px-3 whitespace-nowrap text-slate-500">{r.tx_date}</td>
              <td className="py-2 px-3 text-slate-500">{r.counterparty_account || '—'}</td>
              <td className="py-2 px-3 text-slate-700">{money(r.amount, '$')}</td>
              <td className="py-2 px-3 text-slate-400">{r.op_ref || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LiteFinancePanel() {
  const [section, setSection] = useState<'finance' | 'users' | 'statistics' | 'local' | 'active'>('finance');
  const [data, setData] = useState<BrokerLiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exportingDeclined, setExportingDeclined] = useState(false);
  const [exportDeclinedMessage, setExportDeclinedMessage] = useState('');

  const [tab, setTab] = useState<'deposits' | 'withdrawals'>('deposits');

  const [countryFilters, setCountryFilters] = useState<string[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [methodFilters, setMethodFilters] = useState<string[]>([]);
  const [txSearch, setTxSearch] = useState('');
  const [txDateFrom, setTxDateFrom] = useState('');
  const [txDateTo, setTxDateTo] = useState('');
  const [txPage, setTxPage] = useState(1);

  const [userSearch, setUserSearch] = useState('');
  const [userRegDateFrom, setUserRegDateFrom] = useState('');
  const [userRegDateTo, setUserRegDateTo] = useState('');
  const [userPage, setUserPage] = useState(1);

  // Defaults to the start of the current month, per the admin's request -
  // "this month starting from 01.11.2026 00:00" - editable via the same
  // DateRangeFilter used elsewhere.
  const firstOfThisMonthISO = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  };
  const [localOpsDateFrom, setLocalOpsDateFrom] = useState(firstOfThisMonthISO());
  const [localOpsDateTo, setLocalOpsDateTo] = useState('');
  const [localOpsTab, setLocalOpsTab] = useState<'in' | 'out'>('in');

  const [activeSearch, setActiveSearch] = useState('');
  const [activePage, setActivePage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/broker-lite/data?limit=5000&usersLimit=20000', { headers: authHeaders() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load');
      setData(json);
    } catch (e: any) {
      setError(e.message || 'Failed to load broker-lite data');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleExportDeclined = async () => {
    setExportingDeclined(true);
    setExportDeclinedMessage('');
    try {
      const res = await fetch('/api/admin/broker-lite/export-declined-sheet', { method: 'POST', headers: authHeaders() });
      const json = await res.json();
      if (!json.ok) throw new Error(json.message || 'Export failed');
      setExportDeclinedMessage(json.message);
    } catch (e: any) {
      setExportDeclinedMessage(e.message || 'Export failed');
    } finally {
      setExportingDeclined(false);
    }
  };

  useEffect(() => {
    load();
  }, [load]);

  const clearTxFilters = () => {
    setCountryFilters([]);
    setStatusFilters([]);
    setMethodFilters([]);
    setTxSearch('');
    setTxDateFrom('');
    setTxDateTo('');
  };

  const clearUserFilters = () => {
    setCountryFilters([]);
    setStatusFilters([]);
    setUserSearch('');
    setUserRegDateFrom('');
    setUserRegDateTo('');
  };

  const switchSection = (next: 'finance' | 'users' | 'statistics' | 'local' | 'active') => {
    setSection(next);
    clearTxFilters();
    clearUserFilters();
    setActiveSearch('');
  };

  const switchTab = (next: 'deposits' | 'withdrawals') => {
    setTab(next);
    clearTxFilters();
  };

  useEffect(() => {
    setTxPage(1);
  }, [countryFilters, statusFilters, methodFilters, txSearch, txDateFrom, txDateTo, tab]);

  useEffect(() => {
    setUserPage(1);
  }, [countryFilters, statusFilters, userSearch, userRegDateFrom, userRegDateTo]);

  useEffect(() => {
    setActivePage(1);
  }, [activeSearch]);

  const totals = data?.totals;
  const localOpsTotals = data?.localOpsTotals;

  // What share of this month's Morocco deposit total (Finance tab) came in
  // through the LocalService cash agent's own "Local Balance Deposit" flow
  // (localOpsTotals.withdrawals_this_month_amount - see schema.sql's
  // litefinance_local_ops comment for why that field name is a client
  // withdrawal from LocalService's own point of view).
  const localBalanceDepositPct =
    totals?.deposits_this_month_amount
      ? ((localOpsTotals?.withdrawals_this_month_amount ?? 0) / totals.deposits_this_month_amount) * 100
      : 0;

  const rawRows: TxRow[] = tab === 'deposits' ? data?.deposits ?? [] : data?.withdrawals ?? [];
  const userRows: UserRow[] = data?.users ?? [];

  // raw_type='Withdrawal' (money leaves LocalService to a client) is the
  // client's own deposit; raw_type='Deposit' is the client's own
  // withdrawal - see schema.sql's litefinance_local_ops comment.
  const localOpsInRange = (data?.localOps ?? []).filter((r) => {
    if (!localOpsDateFrom && !localOpsDateTo) return true;
    const iso = toISODate(r.tx_date);
    if (!iso) return false;
    if (localOpsDateFrom && iso < localOpsDateFrom) return false;
    if (localOpsDateTo && iso > localOpsDateTo) return false;
    return true;
  });
  const localDepositRows = localOpsInRange.filter((r) => r.raw_type === 'Withdrawal');
  const localWithdrawalRows = localOpsInRange.filter((r) => r.raw_type === 'Deposit');

  const activeUserRows: ActiveUserRow[] = data?.activeUsers ?? [];
  const activeSearchLower = activeSearch.trim().toLowerCase();
  const filteredActiveUsers = activeUserRows.filter((r) => {
    if (!activeSearchLower) return true;
    const haystack = `${r.name || ''} ${r.email || ''}`.toLowerCase();
    return haystack.includes(activeSearchLower);
  });
  const activeTotalPages = Math.max(1, Math.ceil(filteredActiveUsers.length / PAGE_SIZE));
  const activePageClamped = Math.min(activePage, activeTotalPages);
  const pagedActiveUsers = filteredActiveUsers.slice((activePageClamped - 1) * PAGE_SIZE, activePageClamped * PAGE_SIZE);
  const activePct = data?.totalMoroccoUsersCount ? ((data.activeUsersCount ?? 0) / data.totalMoroccoUsersCount) * 100 : 0;

  const countryOptions = Array.from(new Set(rawRows.map((r) => r.country).filter(Boolean))).sort();
  const statusOptions = Array.from(new Set(rawRows.map((r) => r.status).filter(Boolean))).sort();
  const methodOptions = Array.from(new Set(rawRows.map((r) => r.method).filter(Boolean))).sort();

  const txSearchLower = txSearch.trim().toLowerCase();
  const rows = rawRows.filter((r) => {
    if (countryFilters.length > 0 && !countryFilters.includes(r.country)) return false;
    if (statusFilters.length > 0 && !statusFilters.includes(r.status)) return false;
    if (methodFilters.length > 0 && !methodFilters.includes(r.method)) return false;
    if (txSearchLower) {
      const haystack = `${r.user_name || ''} ${r.account || ''}`.toLowerCase();
      if (!haystack.includes(txSearchLower)) return false;
    }
    if (txDateFrom || txDateTo) {
      const iso = toISODate(r.tx_date);
      if (!iso) return false;
      if (txDateFrom && iso < txDateFrom) return false;
      if (txDateTo && iso > txDateTo) return false;
    }
    return true;
  });

  const txTotalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const txPageClamped = Math.min(txPage, txTotalPages);
  const pagedRows = rows.slice((txPageClamped - 1) * PAGE_SIZE, txPageClamped * PAGE_SIZE);

  const userCountryOptions = Array.from(new Set(userRows.map((r) => r.country).filter(Boolean))).sort();
  const userStatusOptions = Array.from(new Set(userRows.map((r) => r.client_status).filter((s): s is string => !!s))).sort();
  const userSearchLower = userSearch.trim().toLowerCase();
  const filteredUserRows = userRows.filter((r) => {
    if (countryFilters.length > 0 && !countryFilters.includes(r.country)) return false;
    if (statusFilters.length > 0 && !statusFilters.includes(r.client_status || '')) return false;
    if (userSearchLower) {
      const haystack = `${r.name || ''} ${r.email || ''}`.toLowerCase();
      if (!haystack.includes(userSearchLower)) return false;
    }
    if (userRegDateFrom || userRegDateTo) {
      const iso = toISODate(r.reg_date);
      if (!iso) return false;
      if (userRegDateFrom && iso < userRegDateFrom) return false;
      if (userRegDateTo && iso > userRegDateTo) return false;
    }
    return true;
  });

  const userTotalPages = Math.max(1, Math.ceil(filteredUserRows.length / PAGE_SIZE));
  const userPageClamped = Math.min(userPage, userTotalPages);
  const pagedUserRows = filteredUserRows.slice((userPageClamped - 1) * PAGE_SIZE, userPageClamped * PAGE_SIZE);

  const txFiltersActive =
    countryFilters.length > 0 ||
    statusFilters.length > 0 ||
    methodFilters.length > 0 ||
    !!txSearch.trim() ||
    !!txDateFrom ||
    !!txDateTo;
  const userFiltersActive =
    countryFilters.length > 0 || statusFilters.length > 0 || !!userSearch.trim() || !!userRegDateFrom || !!userRegDateTo;

  const filteredSummary = { count: rows.length, amount: sumAmount(rows) };
  const allSummary = { count: rawRows.length, amount: sumAmount(rawRows) };

  const toggleInArray = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
  };

  return (
    <div>
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => switchSection('finance')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            section === 'finance' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Finance
        </button>
        <button
          onClick={() => switchSection('users')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            section === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => switchSection('statistics')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            section === 'statistics' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Statistics
        </button>
        <button
          onClick={() => switchSection('local')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            section === 'local' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Local Service
        </button>
        <button
          onClick={() => switchSection('active')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            section === 'active' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Active Users
        </button>
      </div>

      {data?.lastSync && (
        <p className="text-xs text-slate-400 mb-4">
          Last page synced: {new Date(data.lastSync.created_at).toLocaleString()} — {data.lastSync.kind} page{' '}
          {data.lastSync.page ?? '?'} —{' '}
          {data.lastSync.status === 'success' ? (
            <span className="text-emerald-600">{data.lastSync.message}</span>
          ) : (
            <span className="text-red-600">{data.lastSync.message}</span>
          )}
        </p>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading…</div>
      ) : section === 'finance' ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-2">
            <StatCard label="Unique Users (Morocco)" value={(totals?.unique_users ?? 0).toLocaleString()} />
            <StatCard
              label="Deposits (Morocco)"
              value={money(totals?.deposits_total_amount ?? 0, '$')}
              sub={`${(totals?.deposits_success_count ?? 0).toLocaleString()} successful`}
              thisMonth={`This month: ${money(totals?.deposits_this_month_amount ?? 0, '$')}`}
            />
            <PercentageCard
              label="Local Balance Deposit %"
              pct={localBalanceDepositPct}
              sub="of Morocco deposits this month"
            />
            <StatCard label="Declined (Morocco)" value={(totals?.deposits_declined_count ?? 0).toLocaleString()} />
            <StatCard
              label="Withdrawals Done (Morocco)"
              value={money(totals?.withdrawals_total_amount ?? 0, '$')}
              sub={`${(totals?.withdrawals_done_count ?? 0).toLocaleString()} done`}
              thisMonth={`This month: ${money(totals?.withdrawals_this_month_amount ?? 0, '$')}`}
            />
            <StatCard
              label="Withdrawals Pending (Morocco)"
              value={(totals?.withdrawals_pending_count ?? 0).toLocaleString()}
              sub={`${(totals?.withdrawals_failed_count ?? 0).toLocaleString()} failed`}
            />
          </div>
          <p className="text-xs text-slate-400 mb-6">Cards above are Morocco-only; the table and its filters cover every country.</p>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200">
              <div className="flex">
                <button
                  onClick={() => switchTab('deposits')}
                  className={`px-4 py-3 text-sm font-medium ${tab === 'deposits' ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]' : 'text-slate-400'}`}
                >
                  Deposits ({data?.deposits.length ?? 0})
                </button>
                <button
                  onClick={() => switchTab('withdrawals')}
                  className={`px-4 py-3 text-sm font-medium ${tab === 'withdrawals' ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]' : 'text-slate-400'}`}
                >
                  Withdrawals ({data?.withdrawals.length ?? 0})
                </button>
              </div>
              {tab === 'deposits' && (
                <button
                  onClick={handleExportDeclined}
                  disabled={exportingDeclined}
                  title="Appends declined bank card deposits to the call center's Google Sheet - never touches rows already there"
                  className="mr-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium disabled:opacity-50"
                >
                  <Sheet size={14} className={exportingDeclined ? 'animate-pulse' : ''} />
                  {exportingDeclined ? 'Exporting…' : 'Push Declined to Sheet'}
                </button>
              )}
            </div>

            {exportDeclinedMessage && (
              <div className="px-4 py-2 text-xs text-slate-500 border-b border-slate-200 bg-slate-50">{exportDeclinedMessage}</div>
            )}

            <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-slate-200 bg-slate-50">
              <input
                type="text"
                placeholder="Search user or account…"
                value={txSearch}
                onChange={(e) => setTxSearch(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 min-w-[200px]"
              />
              <DateRangeFilter from={txDateFrom} to={txDateTo} onFrom={setTxDateFrom} onTo={setTxDateTo} />
              <MultiSelectFilter
                placeholder="All countries"
                options={countryOptions}
                selected={countryFilters}
                onToggle={(c) => toggleInArray(setCountryFilters, c)}
                onClear={() => setCountryFilters([])}
              />
              <MultiSelectFilter
                placeholder="All statuses"
                options={statusOptions}
                selected={statusFilters}
                onToggle={(s) => toggleInArray(setStatusFilters, s)}
                onClear={() => setStatusFilters([])}
              />
              <MultiSelectFilter
                placeholder="All methods"
                options={methodOptions}
                selected={methodFilters}
                onToggle={(m) => toggleInArray(setMethodFilters, m)}
                onClear={() => setMethodFilters([])}
              />
              {txFiltersActive && (
                <button onClick={clearTxFilters} className="text-sm text-slate-400 hover:text-slate-600">
                  Clear filters
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 px-4 py-2.5 border-b border-slate-200 text-sm">
              <span className="text-slate-600">
                {txFiltersActive ? 'Filtered total: ' : 'Total: '}
                <span className="font-semibold text-slate-800">{money(filteredSummary.amount, '$')}</span>{' '}
                <span className="text-slate-400">({filteredSummary.count.toLocaleString()} rows)</span>
              </span>
              {txFiltersActive && (
                <span className="text-slate-400">
                  All {tab}: <span className="font-medium text-slate-600">{money(allSummary.amount, '$')}</span> (
                  {allSummary.count.toLocaleString()} rows)
                </span>
              )}
            </div>

            <TxTable
              rows={pagedRows}
              emptyMessage={rawRows.length === 0 ? 'No data yet — run the Tampermonkey sync.' : 'No rows match these filters.'}
            />
            <Pagination
              page={txPageClamped}
              totalPages={txTotalPages}
              onPrev={() => setTxPage((p) => Math.max(1, p - 1))}
              onNext={() => setTxPage((p) => Math.min(txTotalPages, p + 1))}
            />
          </div>
        </>
      ) : section === 'statistics' ? (
        <div className="space-y-8">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Deposits vs Withdrawals by Month</h2>
            <MonthlyChart data={data?.monthlyStats ?? []} />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700 px-4 pt-4 pb-2">Monthly Totals</h2>
            <MonthlyStatsTable data={data?.monthlyStats ?? []} />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">New Clients Registered by Month</h2>
            <MonthlyCountChart data={data?.monthlyRegistrations ?? []} />
          </div>
        </div>
      ) : section === 'local' ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 mb-2">
            <StatCard
              label="Local Deposit (IN)"
              value={money(localOpsTotals?.deposits_total_amount ?? 0, '$')}
              sub={`${(localOpsTotals?.deposits_count ?? 0).toLocaleString()} total`}
              thisMonth={`This month: ${money(localOpsTotals?.deposits_this_month_amount ?? 0, '$')}`}
            />
            <StatCard
              label="Local Balance Deposit"
              value={money(localOpsTotals?.withdrawals_total_amount ?? 0, '$')}
              sub={`${(localOpsTotals?.withdrawals_count ?? 0).toLocaleString()} total`}
              thisMonth={`This month: ${money(localOpsTotals?.withdrawals_this_month_amount ?? 0, '$')}`}
            />
          </div>
          <p className="text-xs text-slate-400 mb-6">
            From the LocalService cash-agent account's own operations ledger (MT5-CLS-905151) - "IN" is a client
            depositing cash locally (balance injected into their account); "Local Balance Deposit" is a client
            cashing out locally, which replenishes the LocalService account's own cash balance.
          </p>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setLocalOpsTab('in')}
                className={`px-4 py-3 text-sm font-medium ${localOpsTab === 'in' ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]' : 'text-slate-400'}`}
              >
                Local Deposit IN ({localDepositRows.length})
              </button>
              <button
                onClick={() => setLocalOpsTab('out')}
                className={`px-4 py-3 text-sm font-medium ${localOpsTab === 'out' ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]' : 'text-slate-400'}`}
              >
                Local Balance Deposit ({localWithdrawalRows.length})
              </button>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-slate-50">
              <DateRangeFilter from={localOpsDateFrom} to={localOpsDateTo} onFrom={setLocalOpsDateFrom} onTo={setLocalOpsDateTo} />
              {(localOpsDateFrom || localOpsDateTo) && (
                <button
                  onClick={() => {
                    setLocalOpsDateFrom('');
                    setLocalOpsDateTo('');
                  }}
                  className="text-sm text-slate-400 hover:text-slate-600"
                >
                  Clear filters
                </button>
              )}
            </div>

            {localOpsTab === 'in' ? (
              <LocalOpsTable rows={localDepositRows} emptyMessage="No local deposits in range — run the Tampermonkey sync." />
            ) : (
              <LocalOpsTable rows={localWithdrawalRows} emptyMessage="No local withdrawals in range — run the Tampermonkey sync." />
            )}
          </div>
        </>
      ) : section === 'active' ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-2">
            <StatCard label="Active Clients" value={(data?.activeUsersCount ?? 0).toLocaleString()} sub="made a deposit or withdrawal" />
            <StatCard
              label="Total Clients (Morocco)"
              value={(data?.totalMoroccoUsersCount ?? 0).toLocaleString()}
            />
            <PercentageCard label="Active %" pct={activePct} sub="of Morocco clients" />
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Matched by name against the Deposits/Withdrawals lists (no user id link exists between them) - a client
            counts as active with any deposit or withdrawal row, of any status. $ totals below sum successful rows only.
          </p>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-slate-200 bg-slate-50">
              <input
                type="text"
                placeholder="Search name or email…"
                value={activeSearch}
                onChange={(e) => setActiveSearch(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 min-w-[200px]"
              />
              {activeSearch && (
                <button onClick={() => setActiveSearch('')} className="text-sm text-slate-400 hover:text-slate-600">
                  Clear filters
                </button>
              )}
            </div>
            <div className="px-4 py-2.5 border-b border-slate-200 text-sm text-slate-600">
              {filteredActiveUsers.length.toLocaleString()} active client{filteredActiveUsers.length === 1 ? '' : 's'}
              {activeUserRows.length !== filteredActiveUsers.length && ` of ${activeUserRows.length.toLocaleString()} total`}
            </div>
            <ActiveUsersTable
              rows={pagedActiveUsers}
              emptyMessage={activeUserRows.length === 0 ? 'No active clients found yet.' : 'No rows match this search.'}
            />
            <Pagination
              page={activePageClamped}
              totalPages={activeTotalPages}
              onPrev={() => setActivePage((p) => Math.max(1, p - 1))}
              onNext={() => setActivePage((p) => Math.min(activeTotalPages, p + 1))}
            />
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-slate-200 bg-slate-50">
            <input
              type="text"
              placeholder="Search name or email…"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 min-w-[200px]"
            />
            <DateRangeFilter from={userRegDateFrom} to={userRegDateTo} onFrom={setUserRegDateFrom} onTo={setUserRegDateTo} />
            <MultiSelectFilter
              placeholder="All countries"
              options={userCountryOptions}
              selected={countryFilters}
              onToggle={(c) => toggleInArray(setCountryFilters, c)}
              onClear={() => setCountryFilters([])}
            />
            <MultiSelectFilter
              placeholder="All client statuses"
              options={userStatusOptions}
              selected={statusFilters}
              onToggle={(s) => toggleInArray(setStatusFilters, s)}
              onClear={() => setStatusFilters([])}
            />
            {userFiltersActive && (
              <button onClick={clearUserFilters} className="text-sm text-slate-400 hover:text-slate-600">
                Clear filters
              </button>
            )}
          </div>
          <div className="px-4 py-2.5 border-b border-slate-200 text-sm text-slate-600">
            {filteredUserRows.length.toLocaleString()} user{filteredUserRows.length === 1 ? '' : 's'}
            {userRows.length !== filteredUserRows.length && ` of ${userRows.length.toLocaleString()} total`}
          </div>
          <UsersTable
            rows={pagedUserRows}
            emptyMessage={userRows.length === 0 ? 'No users yet — run the Tampermonkey sync.' : 'No rows match these filters.'}
          />
          <Pagination
            page={userPageClamped}
            totalPages={userTotalPages}
            onPrev={() => setUserPage((p) => Math.max(1, p - 1))}
            onNext={() => setUserPage((p) => Math.min(userTotalPages, p + 1))}
          />
        </div>
      )}
    </div>
  );
}
