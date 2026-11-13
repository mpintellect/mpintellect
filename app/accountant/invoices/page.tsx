'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Eye } from 'lucide-react';
import { ADMIN_SESSION_KEY } from '../../admin/useAdminKey';

interface Client {
  id: number;
  name: string;
}

interface InvoiceRow {
  id: number;
  invoice_number: string;
  client_id: number;
  client_name: string;
  issue_date: string;
  due_date: string | null;
  currency: string;
  status: string;
  tax_rate: number;
  subtotal: number;
  tax_amount: number;
  total: number;
}

interface LineItem {
  description: string;
  quantity: string;
  unitPrice: string;
}

function authHeaders() {
  return { Authorization: `Bearer ${sessionStorage.getItem(ADMIN_SESSION_KEY) || ''}` };
}

function money(n: number, currency: string) {
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currency}`;
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === 'paid'
      ? 'bg-emerald-50 text-emerald-600'
      : status === 'overdue'
        ? 'bg-red-50 text-red-600'
        : status === 'sent'
          ? 'bg-blue-50 text-blue-600'
          : status === 'cancelled'
            ? 'bg-slate-100 text-slate-500'
            : 'bg-amber-50 text-amber-600'; // draft
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${color}`}>{status}</span>;
}

const EMPTY_ITEM: LineItem = { description: '', quantity: '1', unitPrice: '' };

export default function AccountantInvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [clientId, setClientId] = useState('');
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState('0');
  const [notes, setNotes] = useState('');
  const [paymentInstructions, setPaymentInstructions] = useState('');
  const [items, setItems] = useState<LineItem[]>([{ ...EMPTY_ITEM }]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [invRes, cliRes, settingsRes] = await Promise.all([
        fetch('/api/admin/accountant/invoices', { headers: authHeaders() }),
        fetch('/api/admin/accountant/clients', { headers: authHeaders() }),
        fetch('/api/admin/accountant/settings', { headers: authHeaders() }),
      ]);
      const invData = await invRes.json();
      const cliData = await cliRes.json();
      const settingsData = await settingsRes.json();
      setInvoices(invData.invoices || []);
      setClients(cliData.clients || []);
      if (settingsData.settings) {
        setCurrency(settingsData.settings.default_currency || 'USD');
        setTaxRate(settingsData.settings.default_tax_rate || '0');
        const s = settingsData.settings;
        const bankLines = [
          s.bank_name && `Bank: ${s.bank_name}`,
          s.bank_account && `Account: ${s.bank_account}`,
          s.bank_iban && `IBAN: ${s.bank_iban}`,
          s.bank_swift && `SWIFT: ${s.bank_swift}`,
        ].filter(Boolean);
        setPaymentInstructions(bankLines.join('\n'));
      }
    } catch {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setClientId('');
    setIssueDate(new Date().toISOString().slice(0, 10));
    setDueDate('');
    setNotes('');
    setItems([{ ...EMPTY_ITEM }]);
  };

  const updateItem = (i: number, patch: Partial<LineItem>) => {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  };
  const addItem = () => setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  const removeItem = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));

  const computedSubtotal = useMemo(
    () => items.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0),
    [items]
  );
  const computedTax = computedSubtotal * (Number(taxRate) || 0) / 100;
  const computedTotal = computedSubtotal + computedTax;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanItems = items
      .filter((it) => it.description.trim())
      .map((it) => ({ description: it.description.trim(), quantity: Number(it.quantity) || 0, unitPrice: Number(it.unitPrice) || 0 }));
    if (!clientId) {
      setError('Select a client');
      return;
    }
    if (cleanItems.length === 0) {
      setError('Add at least one line item');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/accountant/invoices', {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: Number(clientId),
          issueDate,
          dueDate,
          currency,
          taxRate: Number(taxRate) || 0,
          notes,
          paymentInstructions,
          items: cleanItems,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create invoice');
      setShowForm(false);
      resetForm();
      await load();
    } catch (e: any) {
      setError(e.message || 'Failed to create invoice');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/accountant/invoices?id=${id}`, { method: 'DELETE', headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      await load();
    } catch (e: any) {
      setError(e.message || 'Failed to delete invoice');
    }
  };

  const quickSetStatus = async (inv: InvoiceRow, status: string) => {
    try {
      const res = await fetch('/api/admin/accountant/invoices', {
        method: 'PUT',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: inv.id,
          clientId: inv.client_id,
          issueDate: inv.issue_date,
          dueDate: inv.due_date,
          currency: inv.currency,
          taxRate: inv.tax_rate,
          status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');
      await load();
    } catch (e: any) {
      setError(e.message || 'Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/accountant" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 mb-2">
              <ArrowLeft size={14} /> Accountant
            </Link>
            <h1 className="text-2xl font-bold">Invoices</h1>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3B82F6] text-white text-sm font-medium"
          >
            <Plus size={16} /> {showForm ? 'Cancel' : 'New Invoice'}
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>
        )}

        {showForm && (
          <form onSubmit={handleSave} className="mb-8 rounded-xl border border-slate-200 bg-white shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">New Invoice</h2>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-500 mb-1">Client *</label>
                <div className="flex gap-2">
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                  >
                    <option value="">Select client…</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <Link
                    href="/accountant/clients"
                    className="whitespace-nowrap text-xs text-blue-600 hover:underline self-center"
                  >
                    + New
                  </Link>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Issue Date</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                >
                  <option value="USD">USD</option>
                  <option value="MAD">MAD</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-slate-500 mb-2">Line Items *</label>
              <div className="space-y-2">
                {items.map((it, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-center">
                    <input
                      placeholder="Description"
                      value={it.description}
                      onChange={(e) => updateItem(i, { description: e.target.value })}
                      className="col-span-6 rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Qty"
                      value={it.quantity}
                      onChange={(e) => updateItem(i, { quantity: e.target.value })}
                      className="col-span-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Unit Price"
                      value={it.unitPrice}
                      onChange={(e) => updateItem(i, { unitPrice: e.target.value })}
                      className="col-span-3 rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      disabled={items.length === 1}
                      className="col-span-1 text-slate-400 hover:text-red-600 disabled:opacity-30"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addItem} className="mt-2 text-xs text-blue-600 hover:underline">
                + Add line item
              </button>
            </div>

            <div className="flex justify-end text-sm text-slate-600 mb-4 space-x-6">
              <span>Subtotal: {money(computedSubtotal, currency)}</span>
              <span>Tax: {money(computedTax, currency)}</span>
              <span className="font-semibold text-slate-900">Total: {money(computedTotal, currency)}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Payment Instructions</label>
                <textarea
                  value={paymentInstructions}
                  onChange={(e) => setPaymentInstructions(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-[#3B82F6] text-white text-sm font-medium disabled:opacity-50"
            >
              {saving ? 'Creating…' : 'Create Invoice'}
            </button>
          </form>
        )}

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-200">
                <th className="py-2 px-4">Invoice #</th>
                <th className="py-2 px-4">Client</th>
                <th className="py-2 px-4">Issue Date</th>
                <th className="py-2 px-4">Due Date</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4 text-right">Total</th>
                <th className="py-2 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400">Loading…</td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400">No invoices yet - click "New Invoice" above.</td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="py-2 px-4 font-medium text-slate-900">{inv.invoice_number}</td>
                    <td className="py-2 px-4 text-slate-600">{inv.client_name}</td>
                    <td className="py-2 px-4 whitespace-nowrap text-slate-500">{inv.issue_date}</td>
                    <td className="py-2 px-4 whitespace-nowrap text-slate-500">{inv.due_date || '—'}</td>
                    <td className="py-2 px-4">
                      <select
                        value={inv.status}
                        onChange={(e) => quickSetStatus(inv, e.target.value)}
                        className="text-xs border-none bg-transparent focus:outline-none"
                      >
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="py-2 px-4 text-right font-medium text-slate-700">{money(inv.total, inv.currency)}</td>
                    <td className="py-2 px-4 text-right whitespace-nowrap">
                      <Link href={`/accountant/invoices/view/?id=${inv.id}`} className="text-slate-400 hover:text-blue-600 mr-3">
                        <Eye size={14} className="inline" />
                      </Link>
                      <button onClick={() => handleDelete(inv.id)} className="text-slate-400 hover:text-red-600">
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
