'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshCw, AlertTriangle, Sheet } from 'lucide-react';
import { ADMIN_SESSION_KEY } from '../useAdminKey';
import UsersSection from './UsersSection';
import MonthlyChart, { type MonthlyStat } from './MonthlyChart';
import MonthlyCountChart, { type MonthlyCount } from './MonthlyCountChart';
import MonthlyStatsTable from './MonthlyStatsTable';

// ----------------------------------------------------------------------------
// Broker (Investizo / invest-panel.com) dashboard. Pure read of what's
// already in D1 (functions/api/admin/broker/data.ts) - the actual scraping
// happens in backend-lib/investizo-scraper.ts, run on demand by the Refresh
// button below (functions/api/admin/broker/sync.ts). Nothing here talks to
// Investizo directly.
//
// The top overview cards use `totals` (SQL aggregates over the full D1
// tables, computed in data.ts), not Investizo's own /statistics/summary
// scrape (`stats` below) - that endpoint reports $0.00 across the board
// regardless of date range, seemingly scoped to a manager/partner filter we
// haven't identified yet. `stats` is still fetched and kept on BrokerData in
// case that gets sorted out later, just not rendered.
// ----------------------------------------------------------------------------

interface StatsSnapshot {
  registrations: number | null;
  deposits_total: number | null;
  deposits_commission: number | null;
  withdrawals_done: number | null;
  withdrawals_pending: number | null;
  affiliate_rebate: number | null;
  affiliate_pending: number | null;
  pamm_current: number | null;
  equity: number | null;
  balance: number | null;
  synced_at: string;
}

interface TxRow {
  id: string;
  tx_date: string;
  user_name: string;
  method: string;
  account: string;
  account_amount: number | null;
  payment_amount: number | null;
  payment_currency: string;
  status: string;
}

interface SyncLog {
  source: string;
  status: string;
  message: string;
  deposits_synced: number;
  withdrawals_synced: number;
  duration_ms: number;
  created_at: string;
}

// SQL aggregates over the full broker_deposits/broker_withdrawals tables
// (functions/api/admin/broker/data.ts), not just the `limit`-capped rows in
// `deposits`/`withdrawals` below - stays accurate once synced history
// outgrows what the page loads for display.
interface Totals {
  deposits_total_amount: number;
  deposits_success_count: number;
  deposits_declined_count: number;
  withdrawals_total_amount: number;
  withdrawals_completed_count: number;
  withdrawals_pending_amount: number;
  withdrawals_pending_count: number;
  unique_users: number;
  deposits_this_month_amount: number;
  withdrawals_this_month_amount: number;
}

// Local (Morocco) balance only - separate from `totals` above, which
// covers every payment method, not just local.
interface LocalBalance {
  deposited_mad: number;
  deposited_usd: number;
  withdrawn_mad: number;
  withdrawn_usd: number;
  expenses_mad: number;
  expenses_usd: number;
}

interface ExpenseRow {
  id: number;
  expense_date: string; // "YYYY-MM-DD HH:MM"
  description: string;
  category: string | null;
  amount_mad: number | null;
  amount_usd: number | null;
  created_at: string;
}

interface BrokerData {
  stats: StatsSnapshot | null;
  deposits: TxRow[];
  withdrawals: TxRow[];
  lastSync: SyncLog | null;
  totals: Totals | null;
  localBalance: LocalBalance | null;
  expenses: ExpenseRow[];
  monthlyStats: MonthlyStat[];
  monthlyRegistrations: MonthlyCount[];
}

function authHeaders() {
  return { Authorization: `Bearer ${sessionStorage.getItem(ADMIN_SESSION_KEY) || ''}` };
}

function money(n: number | null | undefined, currency = '') {
  if (n === null || n === undefined) return '—';
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}${currency ? ' ' + currency : ''}`;
}

function StatusBadge({ status }: { status: string }) {
  const s = (status || '').toLowerCase();
  const color =
    s === 'deposited' || s === 'completed' || s === 'done'
      ? 'bg-emerald-50 text-emerald-600'
      : s === 'declined' || s === 'rejected' || s === 'error'
        ? 'bg-red-50 text-red-600'
        : 'bg-amber-50 text-amber-600';
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>{status || '—'}</span>;
}

// Withdrawals' Method column is "paymentMethod: purse/address" (e.g.
// "tron-usdt: TLfo9iRdgrZsoFUCuauJ9RmEqvayYNHzz3") - every row's address
// differs, so filtering on the raw string wouldn't group anything. Strip
// everything after the first ":" to get a filterable category that works
// for both deposits (plain "tron-usdt") and withdrawals alike.
function methodKey(method: string): string {
  return (method || '').split(':')[0].trim();
}

// tx_date is "DD.MM.YYYY HH:MM" (Investizo's own format, not ISO).
function monthKeyOf(txDate: string): string | null {
  const datePart = (txDate || '').split(' ')[0];
  const [day, month, year] = datePart.split('.');
  if (!day || !month || !year) return null;
  return `${year}-${month.padStart(2, '0')}`;
}

function monthLabel(key: string): string {
  const [year, month] = key.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
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

// For the per-tab filtered/unfiltered summary bar - sums whatever rows are
// currently loaded (up to the `limit`-capped fetch), unlike the top overview
// cards which read `totals` (full-table SQL aggregates from data.ts).
function sumAmount(rows: TxRow[]): number {
  return rows.reduce((total, r) => total + (r.account_amount ?? 0), 0);
}

// Shared checkbox-dropdown used for Method, Month, and Status filters - any
// combination of options can be selected at once (OR'd together); an empty
// selection means "all".
function MultiSelectFilter({
  placeholder,
  options,
  selected,
  onToggle,
  onClear,
  renderOption,
}: {
  placeholder: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
  renderOption?: (value: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  const label =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? renderOption?.(selected[0]) ?? selected[0]
        : `${selected.length} selected`;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
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
              {renderOption?.(opt) ?? opt}
            </label>
          ))}
        </div>
      )}
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
            <th className="py-2 px-3">Method</th>
            <th className="py-2 px-3">Account</th>
            <th className="py-2 px-3">Amount</th>
            <th className="py-2 px-3">Payment</th>
            <th className="py-2 px-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-2 px-3 whitespace-nowrap text-slate-500">{r.tx_date}</td>
              <td className="py-2 px-3 font-medium text-slate-700">{r.user_name}</td>
              <td className="py-2 px-3 text-slate-500">{r.method}</td>
              <td className="py-2 px-3 text-slate-500">{r.account}</td>
              <td className="py-2 px-3 text-slate-700">{money(r.account_amount, '$')}</td>
              <td className="py-2 px-3 text-slate-700">{money(r.payment_amount, r.payment_currency)}</td>
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

export default function InvestizoPanel() {
  const [section, setSection] = useState<'users' | 'finance' | 'statistics'>('finance');
  const [data, setData] = useState<BrokerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'deposits' | 'withdrawals'>('deposits');
  // Method/month/status all support multi-select (empty array = "all").
  const [methodFilters, setMethodFilters] = useState<string[]>([]);
  const [monthFilters, setMonthFilters] = useState<string[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseDate, setExpenseDate] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Office');
  const [expenseMad, setExpenseMad] = useState('');
  const [expenseUsd, setExpenseUsd] = useState('');
  const [savingExpense, setSavingExpense] = useState(false);
  const [expenseError, setExpenseError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/broker/data?limit=200', { headers: authHeaders() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load');
      setData(json);
    } catch (e: any) {
      setError(e.message || 'Failed to load broker data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRefresh = async () => {
    setSyncing(true);
    setError('');
    try {
      const res = await fetch('/api/admin/broker/sync', { method: 'POST', headers: authHeaders() });
      const json = await res.json();
      if (!json.ok) throw new Error(json.message || 'Sync failed');
      await load();
    } catch (e: any) {
      setError(e.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const handleExportToSheet = async () => {
    setExporting(true);
    setError('');
    setExportMessage('');
    try {
      const res = await fetch('/api/admin/broker/export-sheet', { method: 'POST', headers: authHeaders() });
      const json = await res.json();
      if (!json.ok) throw new Error(json.message || 'Export failed');
      setExportMessage(json.message);
    } catch (e: any) {
      setError(e.message || 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingExpense(true);
    setExpenseError('');
    try {
      const res = await fetch('/api/admin/broker/expenses', {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expenseDate,
          description: expenseDescription,
          category: expenseCategory,
          amountMad: expenseMad,
          amountUsd: expenseUsd,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to add expense');
      setExpenseDate('');
      setExpenseDescription('');
      setExpenseMad('');
      setExpenseUsd('');
      setShowExpenseForm(false);
      await load();
    } catch (e: any) {
      setExpenseError(e.message || 'Failed to add expense');
    } finally {
      setSavingExpense(false);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/broker/expenses?id=${id}`, { method: 'DELETE', headers: authHeaders() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to delete expense');
      await load();
    } catch (e: any) {
      setError(e.message || 'Failed to delete expense');
    }
  };

  const totals = data?.totals;
  const localBalance = data?.localBalance;
  const localRemainingMad = localBalance
    ? localBalance.deposited_mad - localBalance.withdrawn_mad - localBalance.expenses_mad
    : 0;
  const localRemainingUsd = localBalance
    ? localBalance.deposited_usd - localBalance.withdrawn_usd - localBalance.expenses_usd
    : 0;
  const rawRows = tab === 'deposits' ? data?.deposits ?? [] : data?.withdrawals ?? [];

  const methodOptions = Array.from(new Set(rawRows.map((r) => methodKey(r.method)).filter(Boolean))).sort();
  const statusOptions = Array.from(new Set(rawRows.map((r) => r.status).filter(Boolean))).sort();
  const monthOptions = Array.from(new Set(rawRows.map((r) => monthKeyOf(r.tx_date)).filter((k): k is string => !!k))).sort(
    (a, b) => (a < b ? 1 : -1) // newest first
  );

  const rows = rawRows.filter(
    (r) =>
      (methodFilters.length === 0 || methodFilters.includes(methodKey(r.method))) &&
      (statusFilters.length === 0 || statusFilters.includes(r.status)) &&
      (monthFilters.length === 0 || monthFilters.includes(monthKeyOf(r.tx_date) ?? ''))
  );

  const filtersActive = methodFilters.length > 0 || statusFilters.length > 0 || monthFilters.length > 0;
  const filteredSummary = { count: rows.length, amount: sumAmount(rows) };
  const allSummary = { count: rawRows.length, amount: sumAmount(rawRows) };

  const toggleInArray = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
  };

  const switchTab = (next: 'deposits' | 'withdrawals') => {
    setTab(next);
    setMethodFilters([]);
    setMonthFilters([]);
    setStatusFilters([]);
  };

  return (
    <div>
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setSection('users')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            section === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setSection('finance')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            section === 'finance' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Finance
        </button>
        <button
          onClick={() => setSection('statistics')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            section === 'statistics' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Statistics
        </button>
      </div>

      {section === 'users' && <UsersSection />}

      {section === 'statistics' && (
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
      )}

      {section === 'finance' && (
      <>
      <div className="flex items-center justify-between mb-6">
        <div>
          {data?.lastSync && (
            <p className="text-xs text-slate-400">
              Last sync: {new Date(data.lastSync.created_at).toLocaleString()} via {data.lastSync.source} —{' '}
              {data.lastSync.status === 'success' ? (
                <span className="text-emerald-600">{data.lastSync.message}</span>
              ) : (
                <span className="text-red-600">{data.lastSync.message}</span>
              )}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportToSheet}
            disabled={exporting}
            title="Appends new local Morocco deposits/withdrawals to the Google Sheet ledger - never touches rows already there"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium disabled:opacity-50"
          >
            <Sheet size={16} className={exporting ? 'animate-pulse' : ''} />
            {exporting ? 'Exporting…' : 'Export to Sheet'}
          </button>
          <button
            onClick={handleRefresh}
            disabled={syncing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3B82F6] text-white text-sm font-medium disabled:opacity-50"
          >
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {exportMessage && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {exportMessage}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading…</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            <StatCard label="Unique Users" value={(totals?.unique_users ?? 0).toLocaleString()} />
            <StatCard
              label="Deposits"
              value={money(totals?.deposits_total_amount ?? 0, '$')}
              sub={`${(totals?.deposits_success_count ?? 0).toLocaleString()} successful`}
              thisMonth={`This month: ${money(totals?.deposits_this_month_amount ?? 0, '$')}`}
            />
            <StatCard
              label="Withdrawals Done"
              value={money(totals?.withdrawals_total_amount ?? 0, '$')}
              sub={`${(totals?.withdrawals_completed_count ?? 0).toLocaleString()} completed`}
              thisMonth={`This month: ${money(totals?.withdrawals_this_month_amount ?? 0, '$')}`}
            />
            <StatCard
              label="Withdrawals Pending"
              value={money(totals?.withdrawals_pending_amount ?? 0, '$')}
              sub={`${(totals?.withdrawals_pending_count ?? 0).toLocaleString()} pending`}
            />
            <StatCard label="Declined Deposits" value={(totals?.deposits_declined_count ?? 0).toLocaleString()} />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm mb-8">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <h2 className="text-sm font-semibold text-slate-700">Local Balance (Morocco)</h2>
              <button
                onClick={() => setShowExpenseForm((v) => !v)}
                className="text-sm font-medium text-[#3B82F6] hover:underline"
              >
                {showExpenseForm ? 'Cancel' : '+ Add Expense'}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
              <StatCard
                label="Deposited"
                value={money(localBalance?.deposited_mad ?? 0, 'MAD')}
                sub={money(localBalance?.deposited_usd ?? 0, '$')}
              />
              <StatCard
                label="Withdrawn"
                value={money(localBalance?.withdrawn_mad ?? 0, 'MAD')}
                sub={money(localBalance?.withdrawn_usd ?? 0, '$')}
              />
              <StatCard
                label="Expenses"
                value={money(localBalance?.expenses_mad ?? 0, 'MAD')}
                sub={money(localBalance?.expenses_usd ?? 0, '$')}
              />
              <div
                className={`rounded-xl border p-4 shadow-sm ${localRemainingMad < 0
                    ? 'bg-red-50 border-red-200'
                    : 'bg-emerald-50 border-emerald-200'
                  }`}
              >
                <div
                  className={`text-xs uppercase tracking-wide font-semibold ${localRemainingMad < 0 ? 'text-red-500' : 'text-emerald-600'
                    }`}
                >
                  Remaining Balance
                </div>
                <div className={`mt-1 text-xl font-bold ${localRemainingMad < 0 ? 'text-red-700' : 'text-emerald-800'}`}>
                  {money(localRemainingMad, 'MAD')}
                </div>
                <div className={`text-lg font-bold ${localRemainingMad < 0 ? 'text-red-700' : 'text-emerald-800'}`}>
                  {money(localRemainingUsd, '$')}
                </div>
              </div>
            </div>

            {showExpenseForm && (
              <form onSubmit={handleAddExpense} className="px-4 pb-4 border-b border-slate-200">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                  <input
                    type="datetime-local"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    required
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                  />
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                  >
                    <option value="Office">Office</option>
                    <option value="Transaction">Transaction</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Description"
                    value={expenseDescription}
                    onChange={(e) => setExpenseDescription(e.target.value)}
                    required
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm md:col-span-1 col-span-2"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Amount MAD"
                    value={expenseMad}
                    onChange={(e) => setExpenseMad(e.target.value)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Amount USD"
                    value={expenseUsd}
                    onChange={(e) => setExpenseUsd(e.target.value)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={savingExpense}
                    className="rounded-lg bg-[#3B82F6] text-white text-sm font-medium px-4 py-1.5 disabled:opacity-50"
                  >
                    {savingExpense ? 'Saving…' : 'Save Expense'}
                  </button>
                </div>
                {expenseError && <div className="text-sm text-red-600">{expenseError}</div>}
              </form>
            )}

            {(data?.expenses?.length ?? 0) > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-200">
                      <th className="py-2 px-4">Date</th>
                      <th className="py-2 px-4">Category</th>
                      <th className="py-2 px-4">Description</th>
                      <th className="py-2 px-4">Amount MAD</th>
                      <th className="py-2 px-4">Amount USD</th>
                      <th className="py-2 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data!.expenses.map((e) => (
                      <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-2 px-4 whitespace-nowrap text-slate-500">{e.expense_date}</td>
                        <td className="py-2 px-4 text-slate-500">{e.category || '—'}</td>
                        <td className="py-2 px-4 text-slate-700">{e.description}</td>
                        <td className="py-2 px-4 text-red-600">
                          {e.amount_mad !== null ? `-${money(e.amount_mad, 'MAD')}` : '—'}
                        </td>
                        <td className="py-2 px-4 text-red-600">
                          {e.amount_usd !== null ? `-${money(e.amount_usd, '$')}` : '—'}
                        </td>
                        <td className="py-2 px-4 text-right">
                          <button
                            onClick={() => handleDeleteExpense(e.id)}
                            className="text-xs text-slate-400 hover:text-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex border-b border-slate-200">
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

            <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-slate-200 bg-slate-50">
              <MultiSelectFilter
                placeholder="All methods"
                options={methodOptions}
                selected={methodFilters}
                onToggle={(m) => toggleInArray(setMethodFilters, m)}
                onClear={() => setMethodFilters([])}
              />

              <MultiSelectFilter
                placeholder="All months"
                options={monthOptions}
                selected={monthFilters}
                onToggle={(m) => toggleInArray(setMonthFilters, m)}
                onClear={() => setMonthFilters([])}
                renderOption={monthLabel}
              />

              <MultiSelectFilter
                placeholder="All statuses"
                options={statusOptions}
                selected={statusFilters}
                onToggle={(s) => toggleInArray(setStatusFilters, s)}
                onClear={() => setStatusFilters([])}
              />

              {filtersActive && (
                <button
                  onClick={() => {
                    setMethodFilters([]);
                    setMonthFilters([]);
                    setStatusFilters([]);
                  }}
                  className="text-sm text-slate-400 hover:text-slate-600"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 px-4 py-2.5 border-b border-slate-200 text-sm">
              <span className="text-slate-600">
                {filtersActive ? 'Filtered total: ' : 'Total: '}
                <span className="font-semibold text-slate-800">{money(filteredSummary.amount, '$')}</span>{' '}
                <span className="text-slate-400">({filteredSummary.count.toLocaleString()} rows)</span>
              </span>
              {filtersActive && (
                <span className="text-slate-400">
                  All {tab}: <span className="font-medium text-slate-600">{money(allSummary.amount, '$')}</span> (
                  {allSummary.count.toLocaleString()} rows)
                </span>
              )}
            </div>

            <TxTable
              rows={rows}
              emptyMessage={rawRows.length === 0 ? 'No data yet — run a sync.' : 'No rows match these filters.'}
            />
          </div>
        </>
      )}
      </>
      )}
    </div>
  );
}
