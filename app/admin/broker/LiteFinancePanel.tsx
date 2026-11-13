'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, Sheet } from 'lucide-react';
import { ADMIN_SESSION_KEY } from '../useAdminKey';
import { type MonthlyStat } from './MonthlyChart';
import LiteFinanceMonthlyChart from './LiteFinanceMonthlyChart';
import MonthlyCountChart, { type MonthlyCount } from './MonthlyCountChart';
import MonthlyStatsTable from './MonthlyStatsTable';
import DailyCallsChart, { type DailyCallStat } from './DailyCallsChart';

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
  // From litefinance_calls, joined by the real user_id FK (data.ts's
  // latest_call CTE) - the most recent linked call, if any. null/null/null
  // means this client has never been reached by a linked call.
  call_agent_name: string | null;
  call_hangup_cause: string | null;
  call_last_at: string | null;
  // Same dep_any/wd_any EXISTS match ActiveUserRow's own "active" definition
  // uses (at least one deposit or withdrawal row, matched by name) - folded
  // into this same query in data.ts rather than a separate request, so
  // every row here can show a status dot too.
  is_active: number; // 1 = active, 0 = inactive
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

// From admin.litefinance.com/calls/index ("Commpeak Calls"). user_id is the
// SAME id litefinance_users.id uses, captured directly from the Destination
// cell's email link - a real FK, unlike deposits/withdrawals' free-text
// user_name. "Successful" has no column of its own; it's decided purely by
// hangup_cause = 'ANSWERED', both here and on the backend.
interface CallRow {
  id: string;
  agent_code: string | null;
  agent_name: string | null;
  destination: string | null;
  client_email: string | null; // null when LiteFinance shows "Unknown user"
  user_id: string | null;
  call_start: string; // "YYYY-MM-DD HH:MM:SS" - already chronologically sortable as text
  duration_sec: number | null;
  hangup_cause: string | null;
}

interface CallsManagerStat {
  month: string; // "YYYY-MM"
  agentCode: string | null;
  agentName: string | null;
  totalCalls: number;
  successfulCalls: number;
  totalDurationSec: number;
}

// Referred clients of the LocalService affiliate account (nouhaila laarj),
// synced from admin.litefinance.com/affiliate/referrals?id=3827279 - see
// schema.sql's litefinance_local_service_clients comment. active is read
// directly from that page's own "active"/"inactive" row class, not derived
// here.
interface LocalServiceClientRow {
  id: string;
  uid: string | null;
  name: string | null;
  reg_date: string | null;
  active: number; // 1 = active, 0 = inactive
  total_dpst: number;
  total_wdrw: number;
  total_commission: number;
  total_trades: number;
  total_volume: number;
  total_profit: number;
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

// From admin.litefinance.com/chat/statistics-support (the live-chat widget -
// a different channel from CallsManagerStat's Commpeak phone calls). See
// schema.sql's litefinance_chat_support_stats comment and functions/api/
// admin/broker-lite/data.ts for how each of these four is derived.
interface ChatSupportStatRow {
  month?: string; // "YYYY-MM" - present on the monthly-trend rows, absent on the all-time totals
  name: string; // manager display name or country name
  sessions: number;
  users: number;
  rating?: number | null; // null on the all-time-total rows (not meaningfully summable)
}

interface ChatSupportStats {
  supportTeamMonthly: ChatSupportStatRow[];
  supportTeamByCountryTotal: ChatSupportStatRow[];
  moroccoByManagerTotal: ChatSupportStatRow[];
  moroccoSummaryMonthly: ChatSupportStatRow[];
}

interface BrokerLiteData {
  deposits: TxRow[];
  withdrawals: TxRow[];
  users: UserRow[];
  localOps: LocalOpRow[];
  calls: CallRow[];
  callsManagerStats: CallsManagerStat[];
  localServiceClients: LocalServiceClientRow[];
  activeUsers: ActiveUserRow[];
  activeUsersCount: number;
  totalMoroccoUsersCount: number;
  lastSync: SyncLog | null;
  totals: Totals | null;
  localOpsTotals: LocalOpsTotals | null;
  monthlyStats: MonthlyStat[];
  monthlyRegistrations: MonthlyCount[];
  chatSupportStats: ChatSupportStats;
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

// "2026-11" -> "November 2026" - same monthlyStats month key as MonthlyChart/MonthlyStatsTable.
function monthLabel(key: string): string {
  const [year, month] = key.split('-').map(Number);
  if (!year || !month) return key;
  return new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
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

// Derived purely from the latest_call join in data.ts, never stored - see
// UserRow's call_agent_name/call_hangup_cause comment.
function CallStatusBadge({ row }: { row: UserRow }) {
  if (!row.call_agent_name) {
    return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">Not called yet</span>;
  }
  const answered = row.call_hangup_cause === 'ANSWERED';
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
        answered ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
      }`}
    >
      {answered ? `Called via ${row.call_agent_name}` : `Failed via ${row.call_agent_name}`}
    </span>
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
            <th className="py-2 px-3">Status</th>
            <th className="py-2 px-3">Client Status</th>
            <th className="py-2 px-3">Call Status</th>
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
              <td className="py-2 px-3">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: r.is_active === 1 ? '#1baf7a' : '#cbd5e1' }}
                  title={r.is_active === 1 ? 'Active - has a deposit or withdrawal' : 'No deposit or withdrawal yet'}
                />
              </td>
              <td className="py-2 px-3 text-slate-500">{r.client_status || '—'}</td>
              <td className="py-2 px-3">
                <CallStatusBadge row={r} />
              </td>
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

function durationLabel(sec: number | null): string {
  if (sec === null || sec === undefined) return '—';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function HangupCauseBadge({ cause }: { cause: string | null }) {
  const answered = cause === 'ANSWERED';
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
        answered ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
      }`}
    >
      {cause || '—'}
    </span>
  );
}

function CallsTable({ rows, emptyMessage }: { rows: CallRow[]; emptyMessage: string }) {
  if (rows.length === 0) {
    return <div className="p-6 text-center text-sm text-slate-400">{emptyMessage}</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-200">
            <th className="py-2 px-3">Call Start</th>
            <th className="py-2 px-3">Manager</th>
            <th className="py-2 px-3">Client Phone</th>
            <th className="py-2 px-3">Client Email</th>
            <th className="py-2 px-3">Duration</th>
            <th className="py-2 px-3">Hangup Cause</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-2 px-3 whitespace-nowrap text-slate-500">{r.call_start}</td>
              <td className="py-2 px-3 text-slate-700">
                {r.agent_name || <span className="text-slate-300">—</span>}
                {r.agent_code && <span className="text-slate-400"> ({r.agent_code})</span>}
              </td>
              <td className="py-2 px-3 text-slate-500">{r.destination || '—'}</td>
              <td className="py-2 px-3 text-slate-500">
                {r.client_email || <span className="text-slate-300">Unknown client</span>}
              </td>
              <td className="py-2 px-3 text-slate-700">{durationLabel(r.duration_sec)}</td>
              <td className="py-2 px-3">
                <HangupCauseBadge cause={r.hangup_cause} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// One column per manager (per explicit request - "each manager have
// column") rather than one row per manager. Only ever has 2-3 columns in
// practice (WANTED_AGENT_CODES in the userscript caps sync to agents
// 2033/2034), so a transposed layout reads cleanly; a "Total" column sums
// across whichever managers are present.
function CallsManagerStatsTable({ rows }: { rows: CallsManagerStat[] }) {
  if (rows.length === 0) {
    return <div className="p-6 text-center text-sm text-slate-400">No calls synced for this month yet.</div>;
  }
  const sorted = [...rows].sort((a, b) => (a.agentCode || '').localeCompare(b.agentCode || ''));
  const totals = sorted.reduce(
    (acc, r) => ({
      totalCalls: acc.totalCalls + r.totalCalls,
      successfulCalls: acc.successfulCalls + r.successfulCalls,
      totalDurationSec: acc.totalDurationSec + r.totalDurationSec,
    }),
    { totalCalls: 0, successfulCalls: 0, totalDurationSec: 0 }
  );
  const successRate = (successful: number, total: number) => (total > 0 ? `${((successful / total) * 100).toFixed(1)}%` : '—');

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-200">
            <th className="py-2 px-3">Metric</th>
            {sorted.map((r) => (
              <th key={r.agentCode} className="py-2 px-3">
                {r.agentName || <span className="text-slate-300">—</span>}
                {r.agentCode && <span className="text-slate-400"> ({r.agentCode})</span>}
              </th>
            ))}
            {sorted.length > 1 && <th className="py-2 px-3">Total</th>}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-100">
            <td className="py-2 px-3 font-medium text-slate-700">Total Calls</td>
            {sorted.map((r) => (
              <td key={r.agentCode} className="py-2 px-3 text-slate-700">
                {r.totalCalls.toLocaleString()}
              </td>
            ))}
            {sorted.length > 1 && <td className="py-2 px-3 font-semibold text-slate-700">{totals.totalCalls.toLocaleString()}</td>}
          </tr>
          <tr className="border-b border-slate-100">
            <td className="py-2 px-3 font-medium text-slate-700">Successful (Answered)</td>
            {sorted.map((r) => (
              <td key={r.agentCode} className="py-2 px-3 text-slate-700">
                {r.successfulCalls.toLocaleString()}
              </td>
            ))}
            {sorted.length > 1 && (
              <td className="py-2 px-3 font-semibold text-slate-700">{totals.successfulCalls.toLocaleString()}</td>
            )}
          </tr>
          <tr className="border-b border-slate-100">
            <td className="py-2 px-3 font-medium text-slate-700">Success Rate</td>
            {sorted.map((r) => (
              <td key={r.agentCode} className="py-2 px-3 text-slate-700">
                {successRate(r.successfulCalls, r.totalCalls)}
              </td>
            ))}
            {sorted.length > 1 && (
              <td className="py-2 px-3 font-semibold text-slate-700">{successRate(totals.successfulCalls, totals.totalCalls)}</td>
            )}
          </tr>
          <tr>
            <td className="py-2 px-3 font-medium text-slate-700">Total Minutes</td>
            {sorted.map((r) => (
              <td key={r.agentCode} className="py-2 px-3 text-slate-700">
                {(r.totalDurationSec / 60).toFixed(1)}
              </td>
            ))}
            {sorted.length > 1 && (
              <td className="py-2 px-3 font-semibold text-slate-700">{(totals.totalDurationSec / 60).toFixed(1)}</td>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const CHAT_SUPPORT_STATS_COLUMN_LABEL: Record<string, string> = {
  month: 'Month',
  name: 'Name',
  sessions: 'Sessions',
  users: 'Users',
  rating: 'Rating',
};

// Shared plain table for the four Support Team (live chat) breakdowns under
// the Managers tab - same ChatSupportStatRow shape, just a different column
// list per view (monthly-trend rows have `month`, all-time-total rows don't;
// rating is only meaningful on manager rows, not country/summary totals).
function ChatSupportStatsTable({
  rows,
  columns,
  emptyMessage,
}: {
  rows: ChatSupportStatRow[];
  columns: Array<'month' | 'name' | 'sessions' | 'users' | 'rating'>;
  emptyMessage: string;
}) {
  if (rows.length === 0) {
    return <div className="p-6 text-center text-sm text-slate-400">{emptyMessage}</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-200">
            {columns.map((c) => (
              <th key={c} className={`py-2 px-3 ${c === 'sessions' || c === 'users' || c === 'rating' ? 'text-right' : ''}`}>
                {CHAT_SUPPORT_STATS_COLUMN_LABEL[c]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={`${r.month ?? ''}-${r.name}-${i}`} className="border-t border-slate-100">
              {columns.map((c) => (
                <td
                  key={c}
                  className={`py-2 px-3 ${c === 'sessions' || c === 'users' || c === 'rating' ? 'text-right' : ''} ${
                    c === 'name' ? 'font-medium text-slate-900' : 'text-slate-600'
                  }`}
                >
                  {c === 'month'
                    ? monthLabel(r.month || '')
                    : c === 'rating'
                      ? r.rating ?? <span className="text-slate-300">—</span>
                      : c === 'sessions' || c === 'users'
                        ? r[c].toLocaleString()
                        : r[c]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Day-by-day table for the Calls tab's "Daily" view - same rows the chart
// above it plots. Rows below the average (computed by the caller over
// whatever date range/filters are active) are colored red, so a
// below-average day is visible in the table too, not just the chart.
function DailyCallsTable({ rows, average }: { rows: DailyCallStat[]; average: number }) {
  if (rows.length === 0) {
    return <div className="p-6 text-center text-sm text-slate-400">No calls in this range yet.</div>;
  }
  const sorted = [...rows].sort((a, b) => b.date.localeCompare(a.date));
  const successRate = (successful: number, total: number) => (total > 0 ? `${((successful / total) * 100).toFixed(1)}%` : '—');
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm tabular-nums">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-slate-400 border-b border-slate-200">
            <th className="py-2 px-3 text-left">Date</th>
            <th className="py-2 px-3 text-right">First Call</th>
            <th className="py-2 px-3 text-right">Last Call</th>
            <th className="py-2 px-3 text-right">Total Calls</th>
            <th className="py-2 px-3 text-right">Successful</th>
            <th className="py-2 px-3 text-right">Success Rate</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => {
            const belowAverage = r.totalCalls < average;
            return (
              <tr key={r.date} className={`border-b border-slate-100 hover:bg-slate-50 ${belowAverage ? 'bg-red-50' : ''}`}>
                <td className={`py-2 px-3 text-left font-medium ${belowAverage ? 'text-red-700' : 'text-slate-700'}`}>{r.date}</td>
                <td className={`py-2 px-3 text-right ${belowAverage ? 'text-red-600' : 'text-slate-700'}`}>{r.firstCallTime ?? '—'}</td>
                <td className={`py-2 px-3 text-right ${belowAverage ? 'text-red-600' : 'text-slate-700'}`}>{r.lastCallTime ?? '—'}</td>
                <td className={`py-2 px-3 text-right font-medium ${belowAverage ? 'text-red-600' : 'text-slate-700'}`}>
                  {r.totalCalls.toLocaleString()}
                </td>
                <td className={`py-2 px-3 text-right ${belowAverage ? 'text-red-600' : 'text-slate-700'}`}>
                  {r.successfulCalls.toLocaleString()}
                </td>
                <td className={`py-2 px-3 text-right ${belowAverage ? 'text-red-600' : 'text-slate-700'}`}>
                  {successRate(r.successfulCalls, r.totalCalls)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Hour-of-day breakdown for the Calls tab's "Hourly" view - same
// manager/status/date filters as Call Log and Daily (filteredCallRows),
// regrouped into the 24 hour-of-day buckets (e.g. "15:00-16:00") instead of
// calendar days, so the admin can see which hours see the most/least call
// traffic across the whole filtered range.
interface HourlyCallStat {
  hour: number; // 0-23
  totalCalls: number;
  successfulCalls: number;
  totalMinutes: number;
}

function HourlyCallsTable({ rows }: { rows: HourlyCallStat[] }) {
  if (rows.every((r) => r.totalCalls === 0)) {
    return <div className="p-6 text-center text-sm text-slate-400">No calls in this range yet.</div>;
  }
  const average = rows.reduce((sum, r) => sum + r.totalCalls, 0) / rows.length;
  const successRate = (successful: number, total: number) => (total > 0 ? `${((successful / total) * 100).toFixed(1)}%` : '—');
  const hourLabel = (h: number) => `${String(h).padStart(2, '0')}:00–${String((h + 1) % 24).padStart(2, '0')}:00`;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm tabular-nums">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-slate-400 border-b border-slate-200">
            <th className="py-2 px-3 text-left">Hour</th>
            <th className="py-2 px-3 text-right">Total Calls</th>
            <th className="py-2 px-3 text-right">Successful</th>
            <th className="py-2 px-3 text-right">Success Rate</th>
            <th className="py-2 px-3 text-right">Minutes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const belowAverage = r.totalCalls < average;
            return (
              <tr key={r.hour} className={`border-b border-slate-100 hover:bg-slate-50 ${belowAverage ? 'bg-red-50' : ''}`}>
                <td className={`py-2 px-3 text-left font-medium ${belowAverage ? 'text-red-700' : 'text-slate-700'}`}>
                  {hourLabel(r.hour)}
                </td>
                <td className={`py-2 px-3 text-right font-medium ${belowAverage ? 'text-red-600' : 'text-slate-700'}`}>
                  {r.totalCalls.toLocaleString()}
                </td>
                <td className={`py-2 px-3 text-right ${belowAverage ? 'text-red-600' : 'text-slate-700'}`}>
                  {r.successfulCalls.toLocaleString()}
                </td>
                <td className={`py-2 px-3 text-right ${belowAverage ? 'text-red-600' : 'text-slate-700'}`}>
                  {successRate(r.successfulCalls, r.totalCalls)}
                </td>
                <td className={`py-2 px-3 text-right ${belowAverage ? 'text-red-600' : 'text-slate-700'}`}>
                  {r.totalMinutes.toFixed(1)}
                </td>
              </tr>
            );
          })}
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

// Referred clients of the LocalService affiliate account - active/inactive
// badge comes straight from the synced row's own `active` flag (itself read
// from the source page's own CSS class, not derived here or in data.ts).
function LocalServiceClientsTable({ rows, emptyMessage }: { rows: LocalServiceClientRow[]; emptyMessage: string }) {
  if (rows.length === 0) {
    return <div className="p-6 text-center text-sm text-slate-400">{emptyMessage}</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm tabular-nums">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-slate-400 border-b border-slate-200">
            <th className="py-2 px-3 text-left">Name</th>
            <th className="py-2 px-3 text-left">UID</th>
            <th className="py-2 px-3 text-left">Registered</th>
            <th className="py-2 px-3 text-left">Status</th>
            <th className="py-2 px-3 text-right">Trades</th>
            <th className="py-2 px-3 text-right">Volume</th>
            <th className="py-2 px-3 text-right">Profit</th>
            <th className="py-2 px-3 text-right">Commission</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-2 px-3 text-left font-medium text-slate-700">{r.name || '—'}</td>
              <td className="py-2 px-3 text-left text-slate-500">{r.uid || '—'}</td>
              <td className="py-2 px-3 text-left text-slate-500 whitespace-nowrap">{r.reg_date || '—'}</td>
              <td className="py-2 px-3 text-left">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    r.active === 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}
                >
                  {r.active === 1 ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="py-2 px-3 text-right text-slate-700">{r.total_trades.toLocaleString()}</td>
              <td className="py-2 px-3 text-right text-slate-700">{r.total_volume.toFixed(2)}</td>
              <td className={`py-2 px-3 text-right font-medium ${r.total_profit < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {money(r.total_profit, '$')}
              </td>
              <td className="py-2 px-3 text-right text-slate-700">{money(r.total_commission, '$')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LiteFinancePanel() {
  const [section, setSection] = useState<'finance' | 'users' | 'statistics' | 'local' | 'active' | 'calls' | 'managers'>('finance');
  const [data, setData] = useState<BrokerLiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exportingDeclined, setExportingDeclined] = useState(false);
  const [exportDeclinedMessage, setExportDeclinedMessage] = useState('');
  const [exportingInactiveClients, setExportingInactiveClients] = useState(false);
  const [exportInactiveClientsMessage, setExportInactiveClientsMessage] = useState('');

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
  const [localOpsTab, setLocalOpsTab] = useState<'in' | 'out' | 'clients'>('in');
  const [localClientSearch, setLocalClientSearch] = useState('');
  const [localClientStatusFilters, setLocalClientStatusFilters] = useState<string[]>([]);
  const [localClientPage, setLocalClientPage] = useState(1);

  const [activeSearch, setActiveSearch] = useState('');
  const [activePage, setActivePage] = useState(1);

  const [callsView, setCallsView] = useState<'log' | 'stats' | 'daily' | 'hourly'>('log');
  const [callsManagerFilters, setCallsManagerFilters] = useState<string[]>([]);
  const [callsStatusFilters, setCallsStatusFilters] = useState<string[]>([]);
  const [callsDateFrom, setCallsDateFrom] = useState(firstOfThisMonthISO());
  const [callsDateTo, setCallsDateTo] = useState('');
  const [callsPage, setCallsPage] = useState(1);
  const [selectedDailyManager, setSelectedDailyManager] = useState<string | null>(null);
  // Users tab defaults to a cheap preview (most recent PREVIEW_USERS_LIMIT
  // clients) instead of the full table - per the admin, the Users tab is
  // almost never actually searched (Active Users / Local Service / Calls
  // cover the "find someone specific" cases), it's just glanced at for the
  // big picture. Flipping to true fetches everyone, on demand, via
  // handleEnableUserSearch below. Every OTHER number on this panel (Active
  // Clients, Total Clients (Morocco), monthly registrations, etc.) comes
  // from its own separate server-side COUNT/aggregate query in data.ts, not
  // from this list - none of them are affected by this at all.
  const [usersSearchMode, setUsersSearchMode] = useState(false);
  const PREVIEW_USERS_LIMIT = 300;
  const FULL_USERS_LIMIT = 20000;

  const load = useCallback(async (opts?: { force?: boolean; usersLimit?: number }) => {
    const usersLimit = opts?.usersLimit ?? PREVIEW_USERS_LIMIT;
    const force = opts?.force ?? false;
    setLoading(true);
    setError('');
    try {
      // Short browser-side cache, keyed by usersLimit so the cheap preview
      // and a full on-demand search never overwrite each other's cached
      // copy. load() is only ever called on mount/button-click (no
      // polling, no mutation handlers refetch it), so a reload or
      // re-navigation within this window is the dominant repeat-read
      // pattern. 60s balances staleness against cutting exactly that
      // pattern to zero D1 reads - nothing here needs by-the-second
      // freshness. sessionStorage (not localStorage) so it clears with the
      // tab, same lifetime as the admin session itself.
      const CACHE_KEY = `mz_broker_lite_cache_${usersLimit}`;
      const CACHE_TTL_MS = 60_000;
      if (!force) {
        try {
          const cached = sessionStorage.getItem(CACHE_KEY);
          if (cached) {
            const { at, json } = JSON.parse(cached);
            if (Date.now() - at < CACHE_TTL_MS) {
              setData(json);
              if (usersLimit === FULL_USERS_LIMIT) setUsersSearchMode(true);
              setLoading(false);
              return;
            }
          }
        } catch {
          // Corrupt/blocked storage - fall through to a normal fetch.
        }
      }

      const res = await fetch(`/api/admin/broker-lite/data?limit=5000&usersLimit=${usersLimit}`, { headers: authHeaders() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load');
      setData(json);
      if (usersLimit === FULL_USERS_LIMIT) setUsersSearchMode(true);
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), json }));
      } catch {
        // Storage full/blocked (private window, quota) - not fatal, just no cache this time.
      }
    } catch (e: any) {
      setError(e.message || 'Failed to load broker-lite data');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEnableUserSearch = () => load({ usersLimit: FULL_USERS_LIMIT });

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

  const handleExportInactiveClients = async () => {
    setExportingInactiveClients(true);
    setExportInactiveClientsMessage('');
    try {
      const res = await fetch('/api/admin/broker-lite/export-inactive-clients-sheet', {
        method: 'POST',
        headers: authHeaders(),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.message || 'Export failed');
      setExportInactiveClientsMessage(json.message);
    } catch (e: any) {
      setExportInactiveClientsMessage(e.message || 'Export failed');
    } finally {
      setExportingInactiveClients(false);
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

  const clearCallsFilters = () => {
    setCallsManagerFilters([]);
    setCallsStatusFilters([]);
    setCallsDateFrom(firstOfThisMonthISO());
    setCallsDateTo('');
  };

  const switchSection = (next: 'finance' | 'users' | 'statistics' | 'local' | 'active' | 'calls' | 'managers') => {
    setSection(next);
    clearTxFilters();
    clearUserFilters();
    clearCallsFilters();
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

  useEffect(() => {
    setCallsPage(1);
  }, [callsManagerFilters, callsStatusFilters, callsDateFrom, callsDateTo]);

  useEffect(() => {
    setLocalClientPage(1);
  }, [localClientSearch, localClientStatusFilters]);

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

  // `totals.deposits_total_amount`/`withdrawals_total_amount` only cover the
  // litefinance_deposits/withdrawals tables, which hold the CURRENT month
  // only (re-scraped fresh every sync - see schema.sql's comment) - so they
  // aren't a true all-time total. `monthlyStats` is the one feed that
  // already merges that live current-month data with
  // litefinance_monthly_stats_history (hand-entered, March 2022 onward -
  // see data.ts), so summing it here is the only way to get a real
  // start-of-2022-to-date total for the Finance tab's cards.
  const allTimeDeposits = (data?.monthlyStats ?? []).reduce((sum, m) => sum + (m.deposits ?? 0), 0);
  const allTimeWithdrawals = (data?.monthlyStats ?? []).reduce((sum, m) => sum + (m.withdrawals ?? 0), 0);

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

  // Per-month "Local Balance Deposit" totals + 5% - same monthlyStats feed
  // as the Statistics tab's chart/table, just read back here next to the
  // stat card instead of scoped to whatever date range the table below is
  // filtered to.
  const localBalanceDepositByMonth = (data?.monthlyStats ?? [])
    .filter((m) => m.localBalanceDeposit !== undefined)
    .map((m) => ({ month: m.month, total: m.localBalanceDeposit ?? 0 }))
    .sort((a, b) => b.month.localeCompare(a.month));

  const currentMonthKey = firstOfThisMonthISO().slice(0, 7); // "YYYY-MM"
  const daysElapsedThisMonth = new Date().getDate(); // for month-to-date daily averages on the Managers tab
  const callRows: CallRow[] = data?.calls ?? [];
  const callsManagerOptions = Array.from(
    new Set(callRows.map((r) => r.agent_name).filter((v): v is string => !!v))
  ).sort();
  const callsStatusOptions = Array.from(
    new Set(callRows.map((r) => r.hangup_cause).filter((v): v is string => !!v))
  ).sort();
  const filteredCallRows = callRows.filter((r) => {
    if (callsManagerFilters.length > 0 && !(r.agent_name && callsManagerFilters.includes(r.agent_name))) return false;
    if (callsStatusFilters.length > 0 && !(r.hangup_cause && callsStatusFilters.includes(r.hangup_cause))) return false;
    if (callsDateFrom || callsDateTo) {
      const iso = r.call_start.slice(0, 10); // already "YYYY-MM-DD..." - no toISODate() needed
      if (callsDateFrom && iso < callsDateFrom) return false;
      if (callsDateTo && iso > callsDateTo) return false;
    }
    return true;
  });
  const callsFiltersActive =
    callsManagerFilters.length > 0 || callsStatusFilters.length > 0 || !!callsDateFrom || !!callsDateTo;
  const callsTotalPages = Math.max(1, Math.ceil(filteredCallRows.length / PAGE_SIZE));
  const callsPageClamped = Math.min(callsPage, callsTotalPages);
  const pagedCallRows = filteredCallRows.slice((callsPageClamped - 1) * PAGE_SIZE, callsPageClamped * PAGE_SIZE);

  // Calls tab's "Daily" view - same manager/status/date filters as the Call
  // Log view above (filteredCallRows), just regrouped by day instead of
  // listed row by row. Average is over whichever days are in range, so it
  // adapts to the active date filter rather than a fixed month.
  const dailyCallStatsMap = new Map<string, DailyCallStat & { firstCallStart: string | null; lastCallStart: string | null }>();
  for (const r of filteredCallRows) {
    const date = r.call_start.slice(0, 10);
    const existing = dailyCallStatsMap.get(date) ?? {
      date,
      totalCalls: 0,
      successfulCalls: 0,
      firstCallTime: null,
      lastCallTime: null,
      firstCallStart: null,
      lastCallStart: null,
    };
    existing.totalCalls += 1;
    if (r.hangup_cause === 'ANSWERED') existing.successfulCalls += 1;
    if (!existing.firstCallStart || r.call_start < existing.firstCallStart) {
      existing.firstCallStart = r.call_start;
      existing.firstCallTime = r.call_start.slice(11, 16);
    }
    if (!existing.lastCallStart || r.call_start > existing.lastCallStart) {
      existing.lastCallStart = r.call_start;
      existing.lastCallTime = r.call_start.slice(11, 16);
    }
    dailyCallStatsMap.set(date, existing);
  }
  const dailyCallStats = Array.from(dailyCallStatsMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  const dailyCallsAverage =
    dailyCallStats.length > 0 ? dailyCallStats.reduce((sum, d) => sum + d.totalCalls, 0) / dailyCallStats.length : 0;

  // Calls tab's "Hourly" view - same filteredCallRows as Daily, regrouped
  // into hour-of-day buckets instead of calendar days. All 24 are built here
  // (indices must line up with the hour itself for the lookup below) - the
  // render slices this down to the 09:00-18:00 working-hours window.
  const hourlyCallStats: HourlyCallStat[] = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    totalCalls: 0,
    successfulCalls: 0,
    totalMinutes: 0,
  }));
  for (const r of filteredCallRows) {
    const hour = Number(r.call_start.slice(11, 13));
    if (Number.isNaN(hour)) continue;
    const bucket = hourlyCallStats[hour];
    bucket.totalCalls += 1;
    if (r.hangup_cause === 'ANSWERED') bucket.successfulCalls += 1;
    bucket.totalMinutes += (r.duration_sec ?? 0) / 60;
  }

  // "Full month stats" view - defaults to the current month, same window
  // the sync itself is bounded to on a first run.
  const callsManagerStatsThisMonth = (data?.callsManagerStats ?? []).filter((m) => m.month === currentMonthKey);

  // Per-manager daily breakdown for the Managers tab - real Commpeak-synced,
  // Morocco-filtered calls (same callRows as the Calls tab), grouped by
  // agent + day. Each manager gets its own average, so a below-average day
  // is relative to that manager's own pace, not blended across managers.
  const callsThisMonth = callRows.filter((r) => r.call_start.slice(0, 7) === currentMonthKey);
  const perManagerDailyMap = new Map<
    string,
    Map<string, DailyCallStat & { firstCallStart: string | null; lastCallStart: string | null }>
  >();
  for (const r of callsThisMonth) {
    const manager = r.agent_name || r.agent_code || 'Unknown';
    const date = r.call_start.slice(0, 10);
    if (!perManagerDailyMap.has(manager)) perManagerDailyMap.set(manager, new Map());
    const dayMap = perManagerDailyMap.get(manager)!;
    const existing = dayMap.get(date) ?? {
      date,
      totalCalls: 0,
      successfulCalls: 0,
      firstCallTime: null,
      lastCallTime: null,
      firstCallStart: null,
      lastCallStart: null,
    };
    existing.totalCalls += 1;
    if (r.hangup_cause === 'ANSWERED') existing.successfulCalls += 1;
    if (!existing.firstCallStart || r.call_start < existing.firstCallStart) {
      existing.firstCallStart = r.call_start;
      existing.firstCallTime = r.call_start.slice(11, 16);
    }
    if (!existing.lastCallStart || r.call_start > existing.lastCallStart) {
      existing.lastCallStart = r.call_start;
      existing.lastCallTime = r.call_start.slice(11, 16);
    }
    dayMap.set(date, existing);
  }
  const perManagerDaily = Array.from(perManagerDailyMap.entries())
    .map(([manager, dayMap]) => {
      const days = Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date));
      const average = days.length > 0 ? days.reduce((sum, d) => sum + d.totalCalls, 0) / days.length : 0;
      return { manager, days, average };
    })
    .sort((a, b) => b.days.reduce((s, d) => s + d.totalCalls, 0) - a.days.reduce((s, d) => s + d.totalCalls, 0));

  const localServiceClientRows: LocalServiceClientRow[] = data?.localServiceClients ?? [];
  const localClientActiveCount = localServiceClientRows.filter((c) => c.active === 1).length;
  const localClientSearchLower = localClientSearch.trim().toLowerCase();
  const filteredLocalServiceClients = localServiceClientRows.filter((c) => {
    if (localClientStatusFilters.length > 0) {
      const status = c.active === 1 ? 'Active' : 'Inactive';
      if (!localClientStatusFilters.includes(status)) return false;
    }
    if (!localClientSearchLower) return true;
    const haystack = `${c.name || ''} ${c.uid || ''}`.toLowerCase();
    return haystack.includes(localClientSearchLower);
  });
  const localClientTotalPages = Math.max(1, Math.ceil(filteredLocalServiceClients.length / PAGE_SIZE));
  const localClientPageClamped = Math.min(localClientPage, localClientTotalPages);
  const pagedLocalServiceClients = filteredLocalServiceClients.slice(
    (localClientPageClamped - 1) * PAGE_SIZE,
    localClientPageClamped * PAGE_SIZE
  );

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
        <button
          onClick={() => switchSection('calls')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            section === 'calls' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Calls
        </button>
        <button
          onClick={() => switchSection('managers')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            section === 'managers' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Managers
        </button>
      </div>

      <div className="flex items-center justify-end mb-2">
        <button
          onClick={() => load({ force: true, usersLimit: usersSearchMode ? FULL_USERS_LIMIT : PREVIEW_USERS_LIMIT })}
          disabled={loading}
          title="Bypass the 60s cache and re-fetch now - useful right after running a Tampermonkey sync"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
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
              label="Deposits (Morocco, This Month)"
              value={money(totals?.deposits_this_month_amount ?? 0, '$')}
              sub={`${(totals?.deposits_success_count ?? 0).toLocaleString()} successful`}
              thisMonth={`Total since 2022: ${money(allTimeDeposits, '$')}`}
            />
            <PercentageCard
              label="Local Balance Deposit %"
              pct={localBalanceDepositPct}
              sub="of Morocco deposits this month"
            />
            <StatCard label="Declined (Morocco)" value={(totals?.deposits_declined_count ?? 0).toLocaleString()} />
            <StatCard
              label="Withdrawals Done (Morocco, This Month)"
              value={money(totals?.withdrawals_this_month_amount ?? 0, '$')}
              sub={`${(totals?.withdrawals_done_count ?? 0).toLocaleString()} done`}
              thisMonth={`Total since 2022: ${money(allTimeWithdrawals, '$')}`}
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
            <LiteFinanceMonthlyChart data={data?.monthlyStats ?? []} />
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

          {localBalanceDepositByMonth.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm mb-6">
              <h2 className="text-sm font-semibold text-slate-700 px-4 pt-4 pb-2">Local Balance Deposit — Monthly 5%</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-200">
                      <th className="py-2 px-4">Month</th>
                      <th className="py-2 px-4">Total</th>
                      <th className="py-2 px-4">5%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localBalanceDepositByMonth.map((m) => (
                      <tr key={m.month} className="border-b border-slate-100 hover:bg-slate-50 last:border-b-0">
                        <td className="py-2 px-4 font-medium text-slate-700">{monthLabel(m.month)}</td>
                        <td className="py-2 px-4 text-slate-700">{money(m.total, '$')}</td>
                        <td className="py-2 px-4 font-medium text-[#1baf7a]">{money(m.total * 0.05, '$')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
              <button
                onClick={() => setLocalOpsTab('clients')}
                className={`px-4 py-3 text-sm font-medium ${localOpsTab === 'clients' ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]' : 'text-slate-400'}`}
              >
                Clients ({localServiceClientRows.length})
              </button>
            </div>

            {localOpsTab !== 'clients' ? (
              <>
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
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-slate-200 bg-slate-50">
                  <input
                    type="text"
                    placeholder="Search name or UID…"
                    value={localClientSearch}
                    onChange={(e) => setLocalClientSearch(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 min-w-[200px]"
                  />
                  <MultiSelectFilter
                    placeholder="All statuses"
                    options={['Active', 'Inactive']}
                    selected={localClientStatusFilters}
                    onToggle={(s) => toggleInArray(setLocalClientStatusFilters, s)}
                    onClear={() => setLocalClientStatusFilters([])}
                  />
                  {(localClientSearch || localClientStatusFilters.length > 0) && (
                    <button
                      onClick={() => {
                        setLocalClientSearch('');
                        setLocalClientStatusFilters([]);
                      }}
                      className="text-sm text-slate-400 hover:text-slate-600"
                    >
                      Clear filters
                    </button>
                  )}
                  <button
                    onClick={handleExportInactiveClients}
                    disabled={exportingInactiveClients}
                    title="Appends inactive local service clients (Name, UID) to the call center's 'no-active clients' sheet tab - never touches rows already there"
                    className="ml-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium disabled:opacity-50"
                  >
                    <Sheet size={14} className={exportingInactiveClients ? 'animate-pulse' : ''} />
                    {exportingInactiveClients ? 'Exporting…' : 'Export Inactive Clients to Sheet'}
                  </button>
                </div>
                {exportInactiveClientsMessage && (
                  <div className="px-4 py-2 text-xs text-slate-500 border-b border-slate-200 bg-slate-50">
                    {exportInactiveClientsMessage}
                  </div>
                )}
                <div className="px-4 py-2.5 border-b border-slate-200 text-sm text-slate-600">
                  {filteredLocalServiceClients.length.toLocaleString()} client
                  {filteredLocalServiceClients.length === 1 ? '' : 's'}
                  {localServiceClientRows.length !== filteredLocalServiceClients.length &&
                    ` of ${localServiceClientRows.length.toLocaleString()} total`}
                  {' — '}
                  {localClientActiveCount.toLocaleString()} active, {(localServiceClientRows.length - localClientActiveCount).toLocaleString()} inactive
                </div>
                <LocalServiceClientsTable
                  rows={pagedLocalServiceClients}
                  emptyMessage={
                    localServiceClientRows.length === 0
                      ? 'No local service clients synced yet — run the Tampermonkey sync.'
                      : 'No rows match these filters.'
                  }
                />
                <Pagination
                  page={localClientPageClamped}
                  totalPages={localClientTotalPages}
                  onPrev={() => setLocalClientPage((p) => Math.max(1, p - 1))}
                  onNext={() => setLocalClientPage((p) => Math.min(localClientTotalPages, p + 1))}
                />
              </>
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
      ) : section === 'calls' ? (
        <>
          <p className="text-xs text-slate-400 mb-4">
            From admin.litefinance.com/calls/index (Commpeak), Morocco clients only. "Successful" has no field of its
            own in LiteFinance's panel - a call counts as successful here when Hangup Cause is ANSWERED.
          </p>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setCallsView('log')}
                className={`px-4 py-3 text-sm font-medium ${callsView === 'log' ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]' : 'text-slate-400'}`}
              >
                Call Log
              </button>
              <button
                onClick={() => setCallsView('stats')}
                className={`px-4 py-3 text-sm font-medium ${callsView === 'stats' ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]' : 'text-slate-400'}`}
              >
                Monthly Stats
              </button>
              <button
                onClick={() => setCallsView('daily')}
                className={`px-4 py-3 text-sm font-medium ${callsView === 'daily' ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]' : 'text-slate-400'}`}
              >
                Daily
              </button>
              <button
                onClick={() => setCallsView('hourly')}
                className={`px-4 py-3 text-sm font-medium ${callsView === 'hourly' ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]' : 'text-slate-400'}`}
              >
                Hourly
              </button>
            </div>

            {callsView === 'log' ? (
              <>
                <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-slate-200 bg-slate-50">
                  <DateRangeFilter from={callsDateFrom} to={callsDateTo} onFrom={setCallsDateFrom} onTo={setCallsDateTo} />
                  <MultiSelectFilter
                    placeholder="All managers"
                    options={callsManagerOptions}
                    selected={callsManagerFilters}
                    onToggle={(m) => toggleInArray(setCallsManagerFilters, m)}
                    onClear={() => setCallsManagerFilters([])}
                  />
                  <MultiSelectFilter
                    placeholder="All statuses"
                    options={callsStatusOptions}
                    selected={callsStatusFilters}
                    onToggle={(s) => toggleInArray(setCallsStatusFilters, s)}
                    onClear={() => setCallsStatusFilters([])}
                  />
                  {callsFiltersActive && (
                    <button onClick={clearCallsFilters} className="text-sm text-slate-400 hover:text-slate-600">
                      Clear filters
                    </button>
                  )}
                </div>
                <div className="px-4 py-2.5 border-b border-slate-200 text-sm text-slate-600">
                  {filteredCallRows.length.toLocaleString()} call{filteredCallRows.length === 1 ? '' : 's'}
                  {callRows.length !== filteredCallRows.length && ` of ${callRows.length.toLocaleString()} total`}
                </div>
                <CallsTable
                  rows={pagedCallRows}
                  emptyMessage={callRows.length === 0 ? 'No calls synced yet — run the Tampermonkey sync.' : 'No rows match these filters.'}
                />
                <Pagination
                  page={callsPageClamped}
                  totalPages={callsTotalPages}
                  onPrev={() => setCallsPage((p) => Math.max(1, p - 1))}
                  onNext={() => setCallsPage((p) => Math.min(callsTotalPages, p + 1))}
                />
              </>
            ) : callsView === 'stats' ? (
              <>
                <div className="px-4 py-2.5 border-b border-slate-200 text-sm text-slate-600">
                  {monthLabel(currentMonthKey)} — per-manager totals
                </div>
                <CallsManagerStatsTable rows={callsManagerStatsThisMonth} />
              </>
            ) : callsView === 'daily' ? (
              <>
                <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-slate-200 bg-slate-50">
                  <DateRangeFilter from={callsDateFrom} to={callsDateTo} onFrom={setCallsDateFrom} onTo={setCallsDateTo} />
                  <MultiSelectFilter
                    placeholder="All managers"
                    options={callsManagerOptions}
                    selected={callsManagerFilters}
                    onToggle={(m) => toggleInArray(setCallsManagerFilters, m)}
                    onClear={() => setCallsManagerFilters([])}
                  />
                  <MultiSelectFilter
                    placeholder="All statuses"
                    options={callsStatusOptions}
                    selected={callsStatusFilters}
                    onToggle={(s) => toggleInArray(setCallsStatusFilters, s)}
                    onClear={() => setCallsStatusFilters([])}
                  />
                  {callsFiltersActive && (
                    <button onClick={clearCallsFilters} className="text-sm text-slate-400 hover:text-slate-600">
                      Clear filters
                    </button>
                  )}
                </div>
                <div className="px-4 py-2.5 border-b border-slate-200 text-sm text-slate-600">
                  {dailyCallStats.length} day{dailyCallStats.length === 1 ? '' : 's'} in range — average{' '}
                  {dailyCallsAverage.toFixed(1)} call{dailyCallsAverage === 1 ? '' : 's'}/day
                </div>
                <div className="p-4 border-b border-slate-200">
                  <DailyCallsChart data={dailyCallStats} average={dailyCallsAverage} />
                </div>
                <DailyCallsTable rows={dailyCallStats} average={dailyCallsAverage} />
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-slate-200 bg-slate-50">
                  <DateRangeFilter from={callsDateFrom} to={callsDateTo} onFrom={setCallsDateFrom} onTo={setCallsDateTo} />
                  <MultiSelectFilter
                    placeholder="All managers"
                    options={callsManagerOptions}
                    selected={callsManagerFilters}
                    onToggle={(m) => toggleInArray(setCallsManagerFilters, m)}
                    onClear={() => setCallsManagerFilters([])}
                  />
                  <MultiSelectFilter
                    placeholder="All statuses"
                    options={callsStatusOptions}
                    selected={callsStatusFilters}
                    onToggle={(s) => toggleInArray(setCallsStatusFilters, s)}
                    onClear={() => setCallsStatusFilters([])}
                  />
                  {callsFiltersActive && (
                    <button onClick={clearCallsFilters} className="text-sm text-slate-400 hover:text-slate-600">
                      Clear filters
                    </button>
                  )}
                </div>
                <div className="px-4 py-2.5 border-b border-slate-200 text-sm text-slate-600">
                  Calls per working hour (09:00–18:00) across every day in range (manager/status/date filters above apply
                  here too) - hours below the average for this range are in red.
                </div>
                <HourlyCallsTable rows={hourlyCallStats.slice(9, 18)} />
              </>
            )}
          </div>
        </>
      ) : section === 'managers' ? (
        <>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Commpeak Sync</h2>
          <p className="text-xs text-slate-400 mb-6">
            {monthLabel(currentMonthKey)} to date ({daysElapsedThisMonth} day{daysElapsedThisMonth === 1 ? '' : 's'} so far) -
            daily averages divide this month's totals by days elapsed, not a full 30/31-day month.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {callsManagerStatsThisMonth.length === 0 ? (
              <div className="col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm p-6 text-center text-sm text-slate-400">
                No calls synced for this month yet.
              </div>
            ) : (
              callsManagerStatsThisMonth.map((m) => {
                const minutes = m.totalDurationSec / 60;
                const pct = m.totalCalls > 0 ? (m.successfulCalls / m.totalCalls) * 100 : 0;
                return (
                  <div key={m.agentCode} className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                    <h2 className="text-sm font-semibold text-slate-700 mb-3">
                      {m.agentName || m.agentCode}
                      {m.agentCode && <span className="text-slate-400 font-normal"> ({m.agentCode})</span>}
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      <StatCard label="Total Calls" value={m.totalCalls.toLocaleString()} />
                      <StatCard label="Successful" value={m.successfulCalls.toLocaleString()} />
                      <PercentageCard label="Success Rate" pct={pct} />
                      <StatCard label="Total Minutes" value={minutes.toFixed(1)} />
                      <StatCard label="Avg Calls/Day" value={(m.totalCalls / daysElapsedThisMonth).toFixed(1)} />
                      <StatCard label="Avg Minutes/Day" value={(minutes / daysElapsedThisMonth).toFixed(1)} />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <h2 className="text-sm font-semibold text-slate-700 mb-2">Daily, Per Manager</h2>
          <p className="text-xs text-slate-400 mb-6">
            {monthLabel(currentMonthKey)}, real synced calls per manager per day. Each manager's average (dashed line)
            and below-average days (red) are relative to that manager's own month, not blended with the other manager.
          </p>
          {perManagerDaily.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 text-center text-sm text-slate-400">
              No calls synced for this month yet.
            </div>
          ) : (
            (() => {
              const activeManager =
                selectedDailyManager && perManagerDaily.some((m) => m.manager === selectedDailyManager)
                  ? selectedDailyManager
                  : perManagerDaily[0].manager;
              const active = perManagerDaily.find((m) => m.manager === activeManager)!;
              return (
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex border-b border-slate-200">
                    {perManagerDaily.map((m) => (
                      <button
                        key={m.manager}
                        onClick={() => setSelectedDailyManager(m.manager)}
                        className={`px-4 py-3 text-sm font-medium ${
                          m.manager === activeManager ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]' : 'text-slate-400'
                        }`}
                      >
                        {m.manager}
                      </button>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-b border-slate-200 text-sm text-slate-600">
                    {active.days.length} day{active.days.length === 1 ? '' : 's'} — average {active.average.toFixed(1)}{' '}
                    calls/day
                  </div>
                  <div className="p-4 border-b border-slate-200">
                    <DailyCallsChart data={active.days} average={active.average} />
                  </div>
                  <DailyCallsTable rows={active.days} average={active.average} />
                </div>
              );
            })()
          )}

          <h2 className="text-sm font-semibold text-slate-700 mt-10 mb-2">Support Team (Live Chat)</h2>
          <p className="text-xs text-slate-400 mb-6">
            admin.litefinance.com's Chat &gt; Support statistics page - a different channel from the Commpeak calls
            above. Synced via the "Sync Support Stats" button on that page; re-fetched per month, so figures for the
            current month fill in as the month progresses.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 px-4 pt-4 pb-2">Monthly — By Manager</h3>
              <ChatSupportStatsTable
                rows={data?.chatSupportStats.supportTeamMonthly ?? []}
                columns={['month', 'name', 'sessions', 'users', 'rating']}
                emptyMessage="No support-chat data synced yet."
              />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 px-4 pt-4 pb-2">
                All-Time — By Country
              </h3>
              <ChatSupportStatsTable
                rows={data?.chatSupportStats.supportTeamByCountryTotal ?? []}
                columns={['name', 'sessions', 'users']}
                emptyMessage="No support-chat data synced yet."
              />
            </div>
          </div>

          <h2 className="text-sm font-semibold text-slate-700 mb-2">Morocco Support (All Managers)</h2>
          <p className="text-xs text-slate-400 mb-6">
            Every manager who has replied to a Morocco chat, not just the two tracked above.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 px-4 pt-4 pb-2">Monthly — Morocco Total</h3>
              <ChatSupportStatsTable
                rows={data?.chatSupportStats.moroccoSummaryMonthly ?? []}
                columns={['month', 'sessions', 'users']}
                emptyMessage="No support-chat data synced yet."
              />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 px-4 pt-4 pb-2">All-Time — By Manager (Morocco)</h3>
              <ChatSupportStatsTable
                rows={data?.chatSupportStats.moroccoByManagerTotal ?? []}
                columns={['name', 'sessions', 'users']}
                emptyMessage="No support-chat data synced yet."
              />
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          {!usersSearchMode && (
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 bg-amber-50">
              <p className="text-sm text-amber-800">
                Showing the {userRows.length.toLocaleString()} most recently registered clients only - search and
                filters below only cover these. Click to load every client and search the full list.
              </p>
              <button
                onClick={handleEnableUserSearch}
                disabled={loading}
                className="shrink-0 rounded-lg bg-[#3B82F6] text-white text-sm font-medium px-4 py-1.5 disabled:opacity-50"
              >
                {loading ? 'Loading…' : 'Search All Clients'}
              </button>
            </div>
          )}
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
            {usersSearchMode &&
              userRows.length !== filteredUserRows.length &&
              ` of ${userRows.length.toLocaleString()} total`}
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
