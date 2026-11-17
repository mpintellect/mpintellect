'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { ADMIN_SESSION_KEY } from '../../admin/useAdminKey';

type LedgerType = 'expense' | 'revenue' | 'bank_fee';

interface Expense {
  id: number;
  expense_date: string;
  description: string;
  category: string | null;
  vendor: string | null;
  currency: string;
  amount: number;
  type: LedgerType;
  fx_rate_to_gbp: number | null;
  notes: string | null;
}

const TYPE_LABELS: Record<LedgerType, string> = {
  expense: 'Expense',
  revenue: 'Revenue',
  bank_fee: 'Bank Fee',
};

function authHeaders() {
  return { Authorization: `Bearer ${sessionStorage.getItem(ADMIN_SESSION_KEY) || ''}` };
}

function money(n: number, currency: string) {
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currency}`;
}

const EMPTY_FORM = { expenseDate: '', description: '', category: '', vendor: '', currency: 'USD', amount: '', type: 'expense', fxRateToGbp: '', notes: '' };

export default function AccountantExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [typeFilter, setTypeFilter] = useState<LedgerType | 'all'>('all');

  const filtered = typeFilter === 'all' ? expenses : expenses.filter((e) => e.type === typeFilter);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/accountant/expenses', { headers: authHeaders() });
      const data = await res.json();
      setExpenses(data.expenses || []);
    } catch {
      setError('Failed to load expenses.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/accountant/expenses', {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      setForm(EMPTY_FORM);
      setShowForm(false);
      await load();
    } catch (e: any) {
      setError(e.message || 'Failed to add expense');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/accountant/expenses?id=${id}`, { method: 'DELETE', headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      await load();
    } catch (e: any) {
      setError(e.message || 'Failed to delete expense');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/accountant" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 mb-2">
              <ArrowLeft size={14} /> Accountant
            </Link>
            <h1 className="text-2xl font-bold">Expenses</h1>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3B82F6] text-white text-sm font-medium"
          >
            <Plus size={16} /> {showForm ? 'Cancel' : 'New Expense'}
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>
        )}

        <div className="mb-4 flex gap-2">
          {(['all', 'expense', 'revenue', 'bank_fee'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                typeFilter === t ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t === 'all' ? 'All' : TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        {showForm && (
          <form onSubmit={handleSave} className="mb-8 rounded-xl border border-slate-200 bg-white shadow-sm p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
              <input
                type="date"
                value={form.expenseDate}
                onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
                required
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
              >
                <option value="">Category…</option>
                <option value="Office">Office</option>
                <option value="Software">Software</option>
                <option value="Marketing">Marketing</option>
                <option value="Payroll">Payroll</option>
                <option value="Travel">Travel</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Vendor"
                value={form.vendor}
                onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
              />
              <input
                type="text"
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm md:col-span-1 col-span-2"
              />
              <input
                type="text"
                placeholder="Reference (invoice #, etc.)"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm md:col-span-1 col-span-2"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
              />
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
              >
                <option value="USD">USD</option>
                <option value="MAD">MAD</option>
                <option value="GBP">GBP</option>
              </select>
              {form.currency !== 'GBP' && (
                <input
                  type="number"
                  step="0.00001"
                  placeholder={`Exchange rate to GBP (e.g. 0.74345)`}
                  value={form.fxRateToGbp}
                  onChange={(e) => setForm({ ...form, fxRateToGbp: e.target.value })}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                />
              )}
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
              >
                <option value="expense">Expense</option>
                <option value="revenue">Revenue</option>
                <option value="bank_fee">Bank Fee</option>
              </select>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#3B82F6] text-white text-sm font-medium px-4 py-1.5 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save Expense'}
              </button>
            </div>
          </form>
        )}

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-200">
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Type</th>
                <th className="py-2 px-4">Category</th>
                <th className="py-2 px-4">Vendor</th>
                <th className="py-2 px-4">Description</th>
                <th className="py-2 px-4 text-right">Amount</th>
                <th className="py-2 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400">Loading…</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400">No transactions yet.</td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="py-2 px-4 whitespace-nowrap text-slate-500">{e.expense_date}</td>
                    <td className="py-2 px-4 text-slate-500">{TYPE_LABELS[e.type] || e.type}</td>
                    <td className="py-2 px-4 text-slate-500">{e.category || '—'}</td>
                    <td className="py-2 px-4 text-slate-500">{e.vendor || '—'}</td>
                    <td className="py-2 px-4 text-slate-700">
                      {e.description}
                      {e.notes && <div className="text-xs text-slate-400 mt-0.5">Ref: {e.notes}</div>}
                    </td>
                    <td className={`py-2 px-4 text-right ${e.type === 'revenue' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {e.type === 'revenue' ? '+' : '-'}{money(e.amount, e.currency)}
                      {e.currency !== 'GBP' && e.fx_rate_to_gbp && (
                        <div className="text-xs text-slate-400 font-normal mt-0.5">
                          Rate {e.fx_rate_to_gbp} → {money(e.amount * e.fx_rate_to_gbp, 'GBP')}
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4 text-right">
                      <button onClick={() => handleDelete(e.id)} className="text-slate-400 hover:text-red-600">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
