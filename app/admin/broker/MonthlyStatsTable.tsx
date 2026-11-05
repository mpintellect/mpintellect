'use client';

import type { MonthlyStat } from './MonthlyChart';

function monthLabel(key: string): string {
  const [year, month] = key.split('-').map(Number);
  if (!year || !month) return key;
  return new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

function money(n: number): string {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export default function MonthlyStatsTable({ data }: { data: MonthlyStat[] }) {
  if (data.length === 0) {
    return <div className="p-6 text-center text-sm text-slate-400">No monthly data yet.</div>;
  }
  const sorted = [...data].sort((a, b) => b.month.localeCompare(a.month));
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-200">
            <th className="py-2 px-3">Month</th>
            <th className="py-2 px-3">Deposits</th>
            <th className="py-2 px-3">Withdrawals</th>
            <th className="py-2 px-3">Net</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.month} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-2 px-3 font-medium text-slate-700">{monthLabel(r.month)}</td>
              <td className="py-2 px-3 text-slate-700">{money(r.deposits)}</td>
              <td className="py-2 px-3 text-slate-700">{money(r.withdrawals)}</td>
              <td className={`py-2 px-3 font-medium ${r.deposits - r.withdrawals < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {money(r.deposits - r.withdrawals)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
