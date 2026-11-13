'use client';

import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { MonthlyStat } from './MonthlyChart';

// ----------------------------------------------------------------------------
// LiteFinance-only monthly Deposits/Withdrawals chart for the Statistics tab -
// deliberately a separate component from the shared MonthlyChart.tsx (which
// InvestizoPanel.tsx also uses), so this panel's multi-year history/trend
// line/stacked-local-portion treatment never affects Investizo's chart.
//
// Per the admin's request: only Deposits and Withdrawals as bars (no
// separate third "Local Balance Deposit" bar), plus a line tracing Deposits
// across the whole range. The one month that actually has synced Local
// Balance Deposit data (litefinance_local_ops only ever holds the CURRENT
// month - everything before it comes from litefinance_monthly_stats_history,
// which has no such breakdown) gets its Deposit bar split into two stacked
// colors - the local portion and the rest - instead of a separate bar, so
// that single month's bar visually reads as "one candle, two colors" while
// every other month is just a plain single-color deposit bar.
// ----------------------------------------------------------------------------

const DEPOSITS_COLOR = '#2a78d6';
const WITHDRAWALS_COLOR = '#eb6834';
const LOCAL_BALANCE_DEPOSIT_COLOR = '#1baf7a';
const DEPOSITS_LINE_COLOR = '#111827';

function monthLabel(key: string): string {
  const [year, month] = key.split('-').map(Number);
  if (!year || !month) return key;
  return new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'short', year: '2-digit' });
}

function money(n: number): string {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

interface ChartRow {
  month: string;
  deposits: number;
  withdrawals: number;
  localPortion: number;
  depositRest: number;
  hasLocal: boolean;
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const row: ChartRow = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md text-sm">
      <div className="font-semibold text-slate-700 mb-1">{monthLabel(label)}</div>
      <div className="flex items-center gap-2 text-slate-600">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: DEPOSITS_COLOR }} />
        Deposits: <span className="font-medium text-slate-800">{money(row.deposits)}</span>
      </div>
      {row.hasLocal && (
        <div className="flex items-center gap-2 text-slate-600 pl-4">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: LOCAL_BALANCE_DEPOSIT_COLOR }} />
          of which Local Balance Deposit: <span className="font-medium text-slate-800">{money(row.localPortion)}</span>
        </div>
      )}
      <div className="flex items-center gap-2 text-slate-600">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: WITHDRAWALS_COLOR }} />
        Withdrawals: <span className="font-medium text-slate-800">{money(row.withdrawals)}</span>
      </div>
    </div>
  );
}

export default function LiteFinanceMonthlyChart({ data }: { data: MonthlyStat[] }) {
  if (data.length === 0) {
    return <div className="p-10 text-center text-sm text-slate-400">No monthly data yet.</div>;
  }
  const hasAnyLocal = data.some((d) => (d.localBalanceDeposit || 0) > 0);
  const chartData: ChartRow[] = data.map((d) => {
    const localPortion = Math.min(d.localBalanceDeposit || 0, d.deposits);
    return {
      month: d.month,
      deposits: d.deposits,
      withdrawals: d.withdrawals,
      localPortion,
      depositRest: d.deposits - localPortion,
      hasLocal: localPortion > 0,
    };
  });
  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 24 }} barGap={2}>
          <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="0" />
          <XAxis
            dataKey="month"
            tickFormatter={monthLabel}
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
            angle={-45}
            textAnchor="end"
            height={50}
            interval="preserveStartEnd"
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
          <Bar dataKey="depositRest" name="Deposits" stackId="deposits" fill={DEPOSITS_COLOR} radius={[4, 4, 0, 0]} maxBarSize={16} />
          <Bar
            dataKey="localPortion"
            name="Local Balance Deposit"
            stackId="deposits"
            fill={LOCAL_BALANCE_DEPOSIT_COLOR}
            radius={[4, 4, 0, 0]}
            maxBarSize={16}
            legendType={hasAnyLocal ? 'square' : 'none'}
          />
          <Bar dataKey="withdrawals" name="Withdrawals" fill={WITHDRAWALS_COLOR} radius={[4, 4, 0, 0]} maxBarSize={16} />
          <Line
            type="monotone"
            dataKey="deposits"
            name="Deposits Trend"
            stroke={DEPOSITS_LINE_COLOR}
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
