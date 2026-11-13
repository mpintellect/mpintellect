'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ADMIN_SESSION_KEY } from '../../admin/useAdminKey';

interface MonthlyRow {
  month: string;
  currency: string;
  revenue: number;
  expenses: number;
}

interface OutstandingRow {
  currency: string;
  total: number;
  count: number;
}

interface BankLedgerRow {
  currency: string;
  revenue: number;
  expense: number;
  bankFees: number;
  net: number;
}

interface Overview {
  monthly: MonthlyRow[];
  outstanding: OutstandingRow[];
  clientCount: number;
  invoiceCount: number;
  bankLedger: BankLedgerRow[];
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
  return new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
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

export default function AccountantOverviewPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  // Group monthly rows by currency so each currency gets its own table -
  // revenue/expenses are never summed across currencies (no exchange-rate
  // source here).
  const byCurrency = new Map<string, MonthlyRow[]>();
  for (const r of data?.monthly ?? []) {
    const list = byCurrency.get(r.currency) || [];
    list.push(r);
    byCurrency.set(r.currency, list);
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
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
          <div className="space-y-8">
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

            {data.bankLedger.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <h2 className="text-sm font-semibold text-slate-700 px-4 pt-4 pb-2">
                  Bank Account (imported from bank statement)
                </h2>
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
                    {data.bankLedger.map((r) => (
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
                <p className="px-4 pb-4 pt-2 text-xs text-slate-400">
                  From the raw bank ledger (<Link href="/accountant/expenses" className="underline hover:text-slate-600">Expenses</Link> page) - separate from the invoice-based Revenue vs. Expenses table below, which only counts formally invoiced/paid amounts.
                </p>
              </div>
            )}

            {byCurrency.size === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 text-center text-sm text-slate-400">
                No paid invoices or expenses yet.
              </div>
            ) : (
              Array.from(byCurrency.entries()).map(([currency, rows]) => (
                <div key={currency} className="rounded-xl border border-slate-200 bg-white shadow-sm">
                  <h2 className="text-sm font-semibold text-slate-700 px-4 pt-4 pb-2">Revenue vs. Expenses ({currency})</h2>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-200">
                        <th className="py-2 px-4">Month</th>
                        <th className="py-2 px-4 text-right">Revenue</th>
                        <th className="py-2 px-4 text-right">Expenses</th>
                        <th className="py-2 px-4 text-right">Net</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr key={r.month} className="border-t border-slate-100">
                          <td className="py-2 px-4 text-slate-600">{monthLabel(r.month)}</td>
                          <td className="py-2 px-4 text-right text-emerald-600">{money(r.revenue, currency)}</td>
                          <td className="py-2 px-4 text-right text-red-600">{money(r.expenses, currency)}</td>
                          <td className="py-2 px-4 text-right font-medium text-slate-800">
                            {money(r.revenue - r.expenses, currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
