'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// ----------------------------------------------------------------------------
// Shared "new clients registered per month" bar chart. Single series - no
// legend box needed (the title names what's plotted), per the dataviz
// skill. Reuses the categorical palette's slot 1 (blue), same as Deposits
// in MonthlyChart.tsx - no clash since the two charts are never shown
// side by side with different meanings for the same color.
// ----------------------------------------------------------------------------

export interface MonthlyCount {
  month: string; // "YYYY-MM"
  count: number;
}

const COLOR = '#2a78d6';

function monthLabel(key: string): string {
  const [year, month] = key.split('-').map(Number);
  if (!year || !month) return key;
  return new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'short', year: '2-digit' });
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md text-sm">
      <div className="font-semibold text-slate-700 mb-1">{monthLabel(label)}</div>
      <div className="flex items-center gap-2 text-slate-600">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLOR }} />
        New clients: <span className="font-medium text-slate-800">{payload[0].value.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default function MonthlyCountChart({ data }: { data: MonthlyCount[] }) {
  if (data.length === 0) {
    return <div className="p-10 text-center text-sm text-slate-400">No monthly data yet.</div>;
  }
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="0" />
          <XAxis
            dataKey="month"
            tickFormatter={monthLabel}
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={40}
            allowDecimals={false}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
          <Bar dataKey="count" name="New clients" fill={COLOR} radius={[4, 4, 0, 0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
