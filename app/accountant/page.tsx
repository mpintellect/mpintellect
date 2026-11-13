import Link from 'next/link';
import { FileText, Users, Receipt, BarChart3, Settings, type LucideIcon } from 'lucide-react';

// ----------------------------------------------------------------------------
// Accountant hub (accountant.mpintellect.com). Add a new tool by adding one
// entry here - no other wiring needed. Every /accountant/* page shares one
// gate (password + TOTP, same shared secret as /admin), enforced once at
// app/accountant/layout.tsx via AdminGateProvider.
// ----------------------------------------------------------------------------

interface AccountantSection {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const ACCOUNTANT_SECTIONS: AccountantSection[] = [
  {
    href: '/accountant/invoices',
    title: 'Invoices',
    description: 'Create, send, and track invoices for clients and partners.',
    icon: FileText,
  },
  {
    href: '/accountant/clients',
    title: 'Clients',
    description: 'Directory of clients and partners you invoice.',
    icon: Users,
  },
  {
    href: '/accountant/expenses',
    title: 'Expenses',
    description: 'General company expense ledger.',
    icon: Receipt,
  },
  {
    href: '/accountant/overview',
    title: 'Overview',
    description: 'Revenue vs. expenses by month, and outstanding invoices.',
    icon: BarChart3,
  },
  {
    href: '/accountant/settings',
    title: 'Settings',
    description: 'Company profile, bank details, and invoice numbering.',
    icon: Settings,
  },
];

export default function AccountantHub() {
  return (
    <div className="min-h-screen bg-white text-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center text-slate-900">Accountant</h1>
        <p className="text-center text-slate-500 mb-10">Invoicing &amp; company accounting</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {ACCOUNTANT_SECTIONS.map(({ href, title, description, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group bg-white border border-slate-200 shadow-sm rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">{title}</h2>
              </div>
              <p className="text-sm text-slate-500">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
