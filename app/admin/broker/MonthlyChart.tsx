'use client';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// ----------------------------------------------------------------------------
// Shared monthly Deposits-vs-Withdrawals(-vs-Local Balance Deposit) bar chart
// for both broker panels' Statistics tab. One shared y-axis (all series are
// USD amounts, so a dual-axis chart would be misleading here) - see the
// dataviz skill's "one axis" rule. Colors are the validated default
// categorical palette's slot 1 (blue), slot 2 (orange), slot 3 (aqua), fixed
// order, never cycled.
// ----------------------------------------------------------------------------

export interface MonthlyStat {
  month: string; // "YYYY-MM"
  deposits: number;
  withdrawals: number;
  // LiteFinance only (Local Service's "Local Balance Deposit" side, not
  // "Local Deposit IN") - absent entirely on Investizo's monthlyStats, so
  // the chart only draws this series when at least one row has it.
  localBalanceDeposit?: number;
}

const DEPOSITS_COLOR = '#2a78d6';
const WITHDRAWALS_COLOR = '#eb6834';
const LOCAL_BALANCE_DEPOSIT_COLOR = '#1baf7a';

function monthLabel(key: string): string {
  const [year, month] = key.split('-').map(Number);
  if (!year || !month) return key;
  return new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'short', year: '2-digit' });
}

function money(n: number): string {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md text-sm">
      <div className="font-semibold text-slate-700 mb-1">{monthLabel(label)}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-slate-600">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="font-medium text-slate-800">{money(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function MonthlyChart({ data }: { data: MonthlyStat[] }) {
  if (data.length === 0) {
    return <div className="p-10 text-center text-sm text-slate-400">No monthly data yet.</div>;
  }
  const hasLocalBalanceDeposit = data.some((d) => d.localBalanceDeposit !== undefined);
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }} barGap={2}>
          <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="0" />
          <XAxis
            dataKey="month"
            tickFormatter={monthLabel}
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => money(v)}
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={70}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
          <Legend
            wrapperStyle={{ fontSize: 13, color: '#334155' }}
            formatter={(value) => <span style={{ color: '#334155' }}>{value}</span>}
          />
          <Bar dataKey="deposits" name="Deposits" fill={DEPOSITS_COLOR} radius={[4, 4, 0, 0]} maxBarSize={24} />
          <Bar dataKey="withdrawals" name="Withdrawals" fill={WITHDRAWALS_COLOR} radius={[4, 4, 0, 0]} maxBarSize={24} />
          {hasLocalBalanceDeposit && (
            <Bar
              dataKey="localBalanceDeposit"
              name="Local Balance Deposit"
              fill={LOCAL_BALANCE_DEPOSIT_COLOR}
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
