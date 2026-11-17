'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ADMIN_SESSION_KEY } from '../../admin/useAdminKey';

interface OutstandingRow {
  currency: string;
  total: number;
  count: number;
}

interface LedgerRow {
  currency: string;
  revenue: number;
  expense: number;
  bankFees: number;
  net: number;
}

interface BreakdownRow {
  category?: string;
  vendor?: string;
  type: 'revenue' | 'expense' | 'bank_fee';
  currency: string;
  total: number;
  count: number;
}

interface Period {
  rows: LedgerRow[];
  categories: BreakdownRow[];
  topVendors: BreakdownRow[];
}

interface FiscalYear extends Period {
  fiscalYearEnd: number;
  label: string;
}

interface MonthlyRow {
  month: string;
  fiscalYearEnd: number;
  currency: string;
  revenue: number;
  expense: number;
  bankFees: number;
  net: number;
}

interface Overview {
  fiscalYears: FiscalYear[];
  allTime: Period;
  monthly: MonthlyRow[];
  outstanding: OutstandingRow[];
  clientCount: number;
  invoiceCount: number;
}

function authHeaders() {
  return { Authorization: `Bearer ${sessionStorage.getItem(ADMIN_SESSION_KEY) || ''}` };
}

function money(n: number, currency: string) {
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currency}`;
}

function monthLabel(key: string): string {
  const [year, month] = key.split('-').map(Number);
  if (!year || !month) return key;
  return new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'short', year: 'numeric' });
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-slate-400 font-semibold">{label}</div>
      <div className="mt-1 text-xl font-bold text-slate-800">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-slate-400">{sub}</div>}
    </div>
  );
}

function LedgerTable({ rows }: { rows: LedgerRow[] }) {
  if (rows.length === 0) {
    return <div className="p-6 text-center text-sm text-slate-400">No transactions in this period.</div>;
  }
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-200">
          <th className="py-2 px-4">Currency</th>
          <th className="py-2 px-4 text-right">Revenue</th>
          <th className="py-2 px-4 text-right">Expenses</th>
          <th className="py-2 px-4 text-right">Bank Fees</th>
          <th className="py-2 px-4 text-right">Net</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.currency} className="border-t border-slate-100">
            <td className="py-2 px-4 text-slate-600">{r.currency}</td>
            <td className="py-2 px-4 text-right text-emerald-600">{money(r.revenue, r.currency)}</td>
            <td className="py-2 px-4 text-right text-red-600">{money(r.expense, r.currency)}</td>
            <td className="py-2 px-4 text-right text-red-600">{money(r.bankFees, r.currency)}</td>
            <td className="py-2 px-4 text-right font-medium text-slate-800">{money(r.net, r.currency)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function BreakdownList({ title, rows, nameKey }: { title: string; rows: BreakdownRow[]; nameKey: 'category' | 'vendor' }) {
  if (rows.length === 0) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
      <h3 className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-3">{title}</h3>
      <ul className="space-y-2">
        {rows.map((r, i) => (
          <li key={`${r[nameKey]}-${r.currency}-${i}`} className="flex items-center justify-between text-sm gap-3">
            <span className="text-slate-700 truncate">{r[nameKey]}</span>
            <span className="text-slate-400 text-xs shrink-0">{r.count}×</span>
            <span
              className={`font-medium shrink-0 ${r.type === 'revenue' ? 'text-emerald-600' : 'text-red-600'}`}
            >
              {money(r.total, r.currency)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MonthlyTrend({ rows }: { rows: MonthlyRow[] }) {
  if (rows.length === 0) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
      <h3 className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-3">Monthly Trend</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-200">
            <th className="py-1.5">Month</th>
            <th className="py-1.5 text-right">Revenue</th>
            <th className="py-1.5 text-right">Expenses</th>
            <th className="py-1.5 text-right">Fees</th>
            <th className="py-1.5 text-right">Net</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={`${r.month}-${r.currency}`} className="border-t border-slate-100">
              <td className="py-1.5 text-slate-600">{monthLabel(r.month)}</td>
              <td className="py-1.5 text-right text-emerald-600">{money(r.revenue, r.currency)}</td>
              <td className="py-1.5 text-right text-red-600">{money(r.expense, r.currency)}</td>
              <td className="py-1.5 text-right text-red-600">{money(r.bankFees, r.currency)}</td>
              <td className="py-1.5 text-right font-medium text-slate-800">{money(r.net, r.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AccountantOverviewPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all-time');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/accountant/overview', { headers: authHeaders() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load');
      setData(json);
    } catch (e: any) {
      setError(e.message || 'Failed to load overview');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const activeFY = activeTab === 'all-time' ? undefined : data?.fiscalYears.find((fy) => String(fy.fiscalYearEnd) === activeTab);
  const activePeriod: Period | undefined = activeTab === 'all-time' ? data?.allTime : activeFY;

  const activeMonthly = useMemo(() => {
    if (!data) return [];
    if (activeTab === 'all-time') return data.monthly;
    return data.monthly.filter((m) => String(m.fiscalYearEnd) === activeTab);
  }, [data, activeTab]);

  const revenueRows = activePeriod?.categories.filter((c) => c.type === 'revenue') ?? [];
  const expenseRows = activePeriod?.categories.filter((c) => c.type !== 'revenue') ?? [];
  const topClients = activePeriod?.topVendors.filter((v) => v.type === 'revenue') ?? [];
  const topVendors = activePeriod?.topVendors.filter((v) => v.type !== 'revenue') ?? [];

  return (
    <div className="min-h-screen bg-white text-slate-800 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link href="/accountant" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 mb-2">
            <ArrowLeft size={14} /> Accountant
          </Link>
          <h1 className="text-2xl font-bold">Overview</h1>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>
        )}

        {loading || !data ? (
          <div className="py-20 text-center text-slate-400">Loading…</div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Clients" value={data.clientCount.toLocaleString()} />
              <StatCard label="Invoices" value={data.invoiceCount.toLocaleString()} />
              {data.outstanding.map((o) => (
                <StatCard
                  key={o.currency}
                  label={`Outstanding (${o.currency})`}
                  value={money(o.total, o.currency)}
                  sub={`${o.count} invoice${o.count === 1 ? '' : 's'} sent/overdue`}
                />
              ))}
            </div>

            <div className="flex gap-1 flex-wrap">
              <button
                onClick={() => setActiveTab('all-time')}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  activeTab === 'all-time' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Time
              </button>
              {data.fiscalYears.map((fy) => (
                <button
                  key={fy.fiscalYearEnd}
                  onClick={() => setActiveTab(String(fy.fiscalYearEnd))}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activeTab === String(fy.fiscalYearEnd) ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  FY {fy.label}
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <h2 className="text-sm font-semibold text-slate-700 px-4 pt-4 pb-2">Revenue vs. Expenses</h2>
              <LedgerTable rows={activePeriod?.rows ?? []} />
              <p className="px-4 pb-4 pt-2 text-xs text-slate-400">
                From the bank ledger (<Link href="/accountant/expenses" className="underline hover:text-slate-600">Expenses</Link> page). Fiscal year runs 1 Sep – 31 Aug. Formally invoiced/paid amounts (see Outstanding above) are tracked separately and not included here.
              </p>
            </div>

            <MonthlyTrend rows={activeMonthly} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BreakdownList title="Revenue by Category" rows={revenueRows} nameKey="category" />
              <BreakdownList title="Expenses by Category" rows={expenseRows} nameKey="category" />
              <BreakdownList title="Top Clients" rows={topClients} nameKey="vendor" />
              <BreakdownList title="Top Vendors" rows={topVendors} nameKey="vendor" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
