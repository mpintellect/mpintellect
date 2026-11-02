import Link from 'next/link';
import { Send, LineChart, Image as ImageIcon, Wallet, Radio, ShieldCheck, type LucideIcon } from 'lucide-react';

// ----------------------------------------------------------------------------
// Admin hub. Add a new tool by adding one entry here — no other wiring needed.
// Every /admin/* page shares one gate (password + TOTP), enforced once at
// app/admin/layout.tsx via AdminGateProvider - individual pages don't do
// their own auth.
// ----------------------------------------------------------------------------
interface AdminSection {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const ADMIN_SECTIONS: AdminSection[] = [
  {
    href: '/admin/telegram',
    title: 'Telegram',
    description: 'Publish signal charts and manual messages to the Telegram channel.',
    icon: Send,
  },
  {
    href: '/admin/monitoring',
    title: 'Ads Monitoring',
    description: 'Facebook & Google Ads campaigns, audiences, and exclusion gaps.',
    icon: LineChart,
  },
  {
    href: '/admin/ads',
    title: 'Ad Creative Preview',
    description: 'Preview generated ad creative variations across styles and sizes.',
    icon: ImageIcon,
  },
  {
    href: '/admin/broker',
    title: 'Broker (II)',
    description: 'Deposits, withdrawals, and partner totals synced from invest-panel.com.',
    icon: Wallet,
  },
  {
    href: '/admin/broadcast',
    title: 'Push Broadcast',
    description: 'Send AI signal, manual, or symbol-lookup push notifications and Telegram posts.',
    icon: Radio,
  },
  {
    href: '/admin/security',
    title: 'Security',
    description: 'Devices that have logged into /admin - review and disconnect sessions.',
    icon: ShieldCheck,
  },
];

export default function AdminHub() {
  return (
    <div className="min-h-screen bg-white text-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center text-slate-900">Admin</h1>
        <p className="text-center text-slate-500 mb-10">Internal tools</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {ADMIN_SECTIONS.map(({ href, title, description, icon: Icon }) => (
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
