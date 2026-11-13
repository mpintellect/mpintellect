'use client';

import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// ----------------------------------------------------------------------------
// Calls-per-day bar chart for the Calls tab's "Daily" view
// (LiteFinancePanel.tsx). Single series - no legend box needed, per the
// dataviz skill. Bars below the average line (computed by the caller over
// whatever date range/filters are active) get the "below average" color
// instead of the normal one, so under-performing days read at a glance
// without having to check the table.
// ----------------------------------------------------------------------------

export interface DailyCallStat {
  date: string; // "YYYY-MM-DD"
  totalCalls: number;
  successfulCalls: number;
  firstCallTime: string | null; // "HH:MM", earliest call_start that day
  lastCallTime: string | null; // "HH:MM", latest call_start that day
}

const COLOR = '#2a78d6';
const BELOW_AVERAGE_COLOR = '#dc2626';

function dateLabel(key: string): string {
  const [year, month, day] = key.split('-').map(Number);
  if (!year || !month || !day) return key;
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function ChartTooltip({ active, payload, label, average }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const d: DailyCallStat = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md text-sm">
      <div className="font-semibold text-slate-700 mb-1">{dateLabel(label)}</div>
      <div className="flex items-center gap-2 text-slate-600">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.totalCalls < average ? BELOW_AVERAGE_COLOR : COLOR }} />
        Calls: <span className="font-medium text-slate-800">{d.totalCalls.toLocaleString()}</span>
      </div>
      <div className="text-slate-600">Successful: <span className="font-medium text-slate-800">{d.successfulCalls.toLocaleString()}</span></div>
      {d.firstCallTime && (
        <div className="text-slate-600">First call: <span className="font-medium text-slate-800">{d.firstCallTime}</span></div>
      )}
      {d.lastCallTime && (
        <div className="text-slate-600">Last call: <span className="font-medium text-slate-800">{d.lastCallTime}</span></div>
      )}
      {d.totalCalls < average && <div className="text-red-600 text-xs mt-1">Below average ({average.toFixed(1)})</div>}
    </div>
  );
}

export default function DailyCallsChart({ data, average }: { data: DailyCallStat[]; average: number }) {
  if (data.length === 0) {
    return <div className="p-10 text-center text-sm text-slate-400">No calls in this range yet.</div>;
  }
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="0" />
          <XAxis
            dataKey="date"
            tickFormatter={dateLabel}
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
          <Tooltip content={<ChartTooltip average={average} />} cursor={{ fill: '#f8fafc' }} />
          <ReferenceLine y={average} stroke="#94a3b8" strokeDasharray="4 4" />
          <Bar dataKey="totalCalls" name="Calls" radius={[4, 4, 0, 0]} maxBarSize={28}>
            {data.map((d) => (
              <Cell key={d.date} fill={d.totalCalls < average ? BELOW_AVERAGE_COLOR : COLOR} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
