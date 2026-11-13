'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Printer } from 'lucide-react';
import { ADMIN_SESSION_KEY } from '../../../admin/useAdminKey';

// ----------------------------------------------------------------------------
// Invoice view/print page - app/accountant/invoices/page.tsx links here as
// `/accountant/invoices/view/?id=<N>` (query param, not a Next.js dynamic
// route segment - this app is `output: 'export'`, a static export can't
// server-render one page per invoice id, so every "detail" view across this
// whole project reads its id from the query string on the client instead).
// useSearchParams() requires a <Suspense> boundary in a static export build,
// hence the wrapper component below.
//
// "Print / Save as PDF" uses the browser's native window.print() rather than
// a PDF-generation library - keeps this fully static, no Worker-side
// rendering needed; @media print below hides everything except the invoice
// itself.
// ----------------------------------------------------------------------------

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unit_price: number;
}

interface Invoice {
  id: number;
  invoice_number: string;
  client_id: number;
  client_name: string;
  client_email: string | null;
  client_address: string | null;
  client_tax_id: string | null;
  client_country: string | null;
  client_contact_name: string | null;
  issue_date: string;
  due_date: string | null;
  currency: string;
  status: string;
  tax_rate: number;
  notes: string | null;
  payment_instructions: string | null;
  subtotal: number;
  tax_amount: number;
  total: number;
}

interface CompanySettings {
  company_name: string;
  company_logo: string;
  company_address: string;
  company_tax_id: string;
  company_email: string;
  company_phone: string;
}

function authHeaders() {
  return { Authorization: `Bearer ${sessionStorage.getItem(ADMIN_SESSION_KEY) || ''}` };
}

function money(n: number, currency: string) {
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currency}`;
}

function InvoiceViewInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [company, setCompany] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!id) {
      setError('No invoice id given.');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [invRes, settingsRes] = await Promise.all([
        fetch(`/api/admin/accountant/invoices?id=${id}`, { headers: authHeaders() }),
        fetch('/api/admin/accountant/settings', { headers: authHeaders() }),
      ]);
      const invData = await invRes.json();
      if (!invRes.ok) throw new Error(invData.error || 'Failed to load invoice');
      const settingsData = await settingsRes.json();
      setInvoice(invData.invoice);
      setItems(invData.items || []);
      setCompany(settingsData.settings || null);
    } catch (e: any) {
      setError(e.message || 'Failed to load invoice');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <div className="py-20 text-center text-slate-400">Loading…</div>;
  }
  if (error || !invoice) {
    return <div className="py-20 text-center text-red-600">{error || 'Invoice not found.'}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 print:bg-white print:p-0">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <Link
            href="/accountant/invoices"
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600"
          >
            <ArrowLeft size={14} /> Invoices
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3B82F6] text-white text-sm font-medium"
          >
            <Printer size={16} /> Print / Save as PDF
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-10 print:border-0 print:shadow-none print:p-0">
          <div className="flex justify-between items-start mb-10">
            <div>
              {company?.company_logo && (
                <img src={company.company_logo} alt="" className="h-12 max-w-[10rem] object-contain mb-2" />
              )}
              <h1 className="text-xl font-bold text-slate-900">{company?.company_name || 'Your Company'}</h1>
              {company?.company_address && <p className="text-sm text-slate-500 whitespace-pre-line">{company.company_address}</p>}
              {company?.company_tax_id && <p className="text-sm text-slate-500">Tax ID: {company.company_tax_id}</p>}
              {company?.company_email && <p className="text-sm text-slate-500">{company.company_email}</p>}
              {company?.company_phone && <p className="text-sm text-slate-500">{company.company_phone}</p>}
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">INVOICE</h2>
              <p className="text-sm text-slate-500">{invoice.invoice_number}</p>
              <p className="text-xs uppercase tracking-wide mt-2 font-semibold text-slate-400">{invoice.status}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
              <h3 className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-1">Bill To</h3>
              <p className="font-medium text-slate-900">{invoice.client_name}</p>
              {invoice.client_contact_name && <p className="text-sm text-slate-500">{invoice.client_contact_name}</p>}
              {invoice.client_address && <p className="text-sm text-slate-500 whitespace-pre-line">{invoice.client_address}</p>}
              {invoice.client_tax_id && <p className="text-sm text-slate-500">Tax ID: {invoice.client_tax_id}</p>}
              {invoice.client_email && <p className="text-sm text-slate-500">{invoice.client_email}</p>}
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">
                Issue Date: <span className="text-slate-800">{invoice.issue_date}</span>
              </p>
              {invoice.due_date && (
                <p className="text-sm text-slate-500">
                  Due Date: <span className="text-slate-800">{invoice.due_date}</span>
                </p>
              )}
            </div>
          </div>

          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-200">
                <th className="py-2">Description</th>
                <th className="py-2 text-right">Qty</th>
                <th className="py-2 text-right">Unit Price</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b border-slate-100">
                  <td className="py-2 text-slate-800">{it.description}</td>
                  <td className="py-2 text-right text-slate-600">{it.quantity}</td>
                  <td className="py-2 text-right text-slate-600">{money(it.unit_price, invoice.currency)}</td>
                  <td className="py-2 text-right text-slate-800">{money(it.quantity * it.unit_price, invoice.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mb-10">
            <div className="w-56 text-sm space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{money(invoice.subtotal, invoice.currency)}</span>
              </div>
              {invoice.tax_rate > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Tax ({invoice.tax_rate}%)</span>
                  <span>{money(invoice.tax_amount, invoice.currency)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-slate-900 text-base border-t border-slate-200 pt-1">
                <span>Total</span>
                <span>{money(invoice.total, invoice.currency)}</span>
              </div>
            </div>
          </div>

          {invoice.payment_instructions && (
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-1">Payment Instructions</h3>
              <p className="text-sm text-slate-600 whitespace-pre-line">{invoice.payment_instructions}</p>
            </div>
          )}

          {invoice.notes && (
            <div>
              <h3 className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-1">Notes</h3>
              <p className="text-sm text-slate-600 whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AccountantInvoiceViewPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400">Loading…</div>}>
      <InvoiceViewInner />
    </Suspense>
  );
}
