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
// Styled to match the user's reference invoice template exactly (black thin
// borders, boxed From/Client panels, centered "Invoice" title, a 5-column
// meta row, a Form of Payment/Type of Shipment row, a Concept/Quantity/Uts/
// Price/Value items table, and a Rate/Base/Value VAT box) - "Uts" is a
// static label from that template (always "units"), not a stored field, so
// nothing new has to be entered per line item. "Stamp and signature" is left
// as a blank bordered area, same as the original (a physically signed/
// stamped printout), not something generated here.
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
  order_number: string | null;
  order_external_id: string | null;
  contract: string | null;
  payment_method: string | null;
  shipment_type: string | null;
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

function money(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(d: string) {
  const [y, m, day] = d.split('-').map(Number);
  if (!y || !m || !day) return d;
  const date = new Date(y, m - 1, day);
  const suffix = (n: number) => (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th');
  return `${day}${suffix(day)} ${date.toLocaleString('en-US', { month: 'long' })}, ${y}`;
}

function Cell({ label, value, className = '' }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={`border border-black ${className}`}>
      <div className="text-xs font-bold px-2 py-1 border-b border-black">{label}</div>
      <div className="text-sm px-2 py-1.5 min-h-[1.75rem]">{value}</div>
    </div>
  );
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

  const totalQuantity = items.reduce((sum, it) => sum + Number(it.quantity), 0);

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

        <div className="bg-white shadow-sm print:shadow-none p-10 text-black font-sans text-sm">
          {/* Logo */}
          {company?.company_logo && (
            <img src={company.company_logo} alt="" className="h-20 w-20 object-contain border border-black p-1 mb-3" />
          )}

          {/* From / Client panels */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="border border-black">
              <div className="font-bold px-2 py-1">{company?.company_name || 'Your Company'}</div>
              <div className="px-2 pb-2 text-xs leading-relaxed">
                {company?.company_address && <div className="whitespace-pre-line">Address: {company.company_address}</div>}
              </div>
              <div className="border-t border-black px-2 py-1.5 text-xs">
                {company?.company_email && <div>E-Mail: {company.company_email}</div>}
                {company?.company_phone && <div>Phone: {company.company_phone}</div>}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold mb-1">Client:</div>
              <div className="border border-black">
                <div className="font-bold px-2 py-1">{invoice.client_name}</div>
                <div className="px-2 pb-2 text-xs leading-relaxed">
                  {invoice.client_tax_id && <div>Company No. {invoice.client_tax_id}</div>}
                  {invoice.client_address && (
                    <div className="whitespace-pre-line">
                      Address: {invoice.client_address}
                      {invoice.client_country ? `, ${invoice.client_country}` : ''}
                    </div>
                  )}
                  {invoice.client_email && <div>E-Mail: {invoice.client_email}</div>}
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-center text-2xl font-bold mb-6">Invoice</h1>

          {/* Meta row */}
          <div className="grid grid-cols-5 mb-4">
            <Cell label="Date" value={formatDate(invoice.issue_date)} />
            <Cell label="Number" value={invoice.invoice_number} className="border-l-0" />
            <Cell label="Order Number" value={invoice.order_number || ''} className="border-l-0" />
            <Cell label="Order external ID" value={invoice.order_external_id || ''} className="border-l-0" />
            <Cell label="Contract" value={invoice.contract || ''} className="border-l-0" />
          </div>

          {/* Payment / shipment row */}
          <div className="grid grid-cols-2 mb-6">
            <Cell label="Form of Payment" value={invoice.payment_method || ''} />
            <Cell label="Type of Shipment" value={invoice.shipment_type || ''} className="border-l-0" />
          </div>

          {/* Line items */}
          <table className="w-full border-collapse mb-0">
            <thead>
              <tr className="text-xs font-bold">
                <th className="border border-black px-2 py-1 w-10">№</th>
                <th className="border border-black px-2 py-1 text-left">Concept</th>
                <th className="border border-black px-2 py-1 w-16">Quantity</th>
                <th className="border border-black px-2 py-1 w-14"></th>
                <th className="border border-black px-2 py-1 w-20">Price</th>
                <th className="border border-black px-2 py-1 w-24">Value</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={it.id} className="text-sm">
                  <td className="border border-black px-2 py-1 text-center">{i + 1}</td>
                  <td className="border border-black px-2 py-1">{it.description}</td>
                  <td className="border border-black px-2 py-1 text-center">{it.quantity}</td>
                  <td className="border border-black px-2 py-1 text-center text-xs">Uts</td>
                  <td className="border border-black px-2 py-1 text-right">{money(it.unit_price)}</td>
                  <td className="border border-black px-2 py-1 text-right">{money(it.quantity * it.unit_price)}</td>
                </tr>
              ))}
              <tr className="text-sm font-bold">
                <td className="border border-black px-2 py-1" colSpan={2}>Subtotal</td>
                <td className="border border-black px-2 py-1 text-center" colSpan={2}>{totalQuantity}</td>
                <td className="border border-black px-2 py-1"></td>
                <td className="border border-black px-2 py-1 text-right">{money(invoice.subtotal)}</td>
              </tr>
            </tbody>
          </table>

          {/* VAT + total */}
          <div className="flex justify-end mt-4">
            <div className="w-72">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="text-xs font-bold">
                    <th className="border border-black px-2 py-1 text-left"></th>
                    <th className="border border-black px-2 py-1">Rate</th>
                    <th className="border border-black px-2 py-1">Base</th>
                    <th className="border border-black px-2 py-1">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black px-2 py-1 font-bold">VAT:</td>
                    <td className="border border-black px-2 py-1 text-right">{invoice.tax_rate}%</td>
                    <td className="border border-black px-2 py-1 text-right">{money(invoice.subtotal)}</td>
                    <td className="border border-black px-2 py-1 text-right">{money(invoice.tax_amount)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-between items-center border border-black px-2 py-1.5 mt-3 font-bold">
                <span>Invoice total:</span>
                <span>{money(invoice.total)}</span>
              </div>
              <div className="text-right text-xs mt-1">Currency: {invoice.currency}</div>
            </div>
          </div>

          {(invoice.payment_instructions || invoice.notes) && (
            <div className="mt-8 space-y-4">
              {invoice.payment_instructions && (
                <div>
                  <h3 className="text-xs font-bold mb-1">Payment Instructions</h3>
                  <p className="text-sm whitespace-pre-line">{invoice.payment_instructions}</p>
                </div>
              )}
              {invoice.notes && (
                <div>
                  <h3 className="text-xs font-bold mb-1">Notes</h3>
                  <p className="text-sm whitespace-pre-line">{invoice.notes}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-10 text-center">
            <div className="font-bold text-sm mb-2">Stamp and signature</div>
            <div className="border border-black h-24 w-56 mx-auto" />
          </div>

          <div className="mt-10 text-center text-xs text-slate-500">Page 1 of 1</div>
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
