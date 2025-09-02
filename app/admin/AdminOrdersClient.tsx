'use client';

import { useMemo, useState } from 'react';

const fmtDateTime = (ts: number, tz: 'local' | 'utc') =>
  tz === 'utc'
    ? new Date(ts).toISOString().replace('T', ' ').replace('Z', ' UTC')
    : new Date(ts).toLocaleString(undefined, { hour12: false });

type Order = {
  id: string;
  email?: string | null;
  buyerName?: string | null; 
  productId: string;
  productName: string;
  filePath: string;
  amountUsd: number;
  method: 'card';
  status: 'pending' | 'paid' | 'expired';
  createdAt: number;
  createdAtISO?: string;
  txid?: string | null;
  ip?: string | null;
  countryCode?: string | null;
  countryName?: string | null;
  downloadUsed?: boolean;
};

export default function AdminOrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders] = useState<Order[]>(initialOrders);
  const [query, setQuery] = useState<string>('');
  const [status, setStatus] = useState<'all' | 'pending' | 'paid' | 'expired'>('all');
  const [method, setMethod] = useState<'all' | 'usdt' | 'card'>('all');
  const [tz, setTz] = useState<'local' | 'utc'>('local');

  // --- date range state (default: last 30 days → today) ---
  const fmtDate = (d: Date) => d.toISOString().slice(0, 10);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d30 = new Date(today);
  d30.setDate(d30.getDate() - 29);

  const [startDate, setStartDate] = useState<string>(fmtDate(d30));
  const [endDate, setEndDate] = useState<string>(fmtDate(today));
const [pendingStart, setPendingStart] = useState<string>(fmtDate(d30));
const [pendingEnd, setPendingEnd] = useState<string>(fmtDate(today));
  const toDayStartTs = (isoDate: string) => new Date(isoDate + 'T00:00:00').getTime();
  const toDayEndTs = (isoDate: string) => new Date(isoDate + 'T23:59:59.999').getTime();

  const rangeStart = startDate ? toDayStartTs(startDate) : Number.NEGATIVE_INFINITY;
  const rangeEnd = endDate ? toDayEndTs(endDate) : Number.POSITIVE_INFINITY;

  // filter orders by date
  const ordersInRange = useMemo(
    () => orders.filter(o => o.createdAt >= rangeStart && o.createdAt <= rangeEnd),
    [orders, rangeStart, rangeEnd]
  );

  // quick presets
  const preset = (days: number) => {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  const s = new Date(t);
  s.setDate(s.getDate() - (days - 1));
  setPendingStart(fmtDate(s));
  setPendingEnd(fmtDate(t));
};
const clearRange = () => {
  setPendingStart('');
  setPendingEnd('');
};

  // filter by status/method/query
  const filtered = useMemo(() => {
    return ordersInRange.filter(o => {
      if (status !== 'all' && o.status !== status) return false;
      if (method !== 'all' && o.method !== method) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const hay = [
          o.id,
          o.email || '',
          o.buyerName || '',
          o.productName,
          o.txid || '',
          o.countryName || o.countryCode || '',
          o.ip || '',
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [ordersInRange, status, method, query]);

  // summary stats
  const paidInRange = ordersInRange
    .filter(o => o.status === 'paid')
    .reduce((s, o) => s + (Number(o.amountUsd) || 0), 0);

  const counts = {
    pending: ordersInRange.filter(o => o.status === 'pending').length,
    paid: ordersInRange.filter(o => o.status === 'paid').length,
    expired: ordersInRange.filter(o => o.status === 'expired').length,
    total: ordersInRange.length,
  };

  // revenue sparkline
  const buckets: Record<string, number> = {};
  ordersInRange.forEach(o => {
    if (o.status !== 'paid') return;
    const key = new Date(new Date(o.createdAt).setHours(0, 0, 0, 0))
      .toISOString()
      .slice(0, 10);
    buckets[key] = (buckets[key] || 0) + (Number(o.amountUsd) || 0);
  });
  const keysSorted = Object.keys(buckets).sort();
  const lastKeys = keysSorted.slice(-30);
  const sparkLabels = lastKeys;
  const sparkValues = lastKeys.map(k => buckets[k]);
  const sparkMax = Math.max(1, ...sparkValues);

  const totalPaidFiltered = filtered
    .filter(o => o.status === 'paid')
    .reduce((sum, o) => sum + (Number(o.amountUsd) || 0), 0);

  // CSV export
  const downloadCSV = () => {
    const headers = [
      'createdAt',
      'status',
      'product',
      'amountUsd',
      'method',
      'name',  
      'email',
      'txid',
      'country',
      'ip',
      'orderId',
    ];

    const rows = filtered.map(o => [
      fmtDateTime(o.createdAt, tz),
      o.status,
      o.productName,
      String(o.amountUsd),
      o.method,
      o.buyerName || '',  
      o.email || '',
      o.txid || '',
      o.countryName || o.countryCode || '',
      o.ip || '',
      o.id,
    ]);

    const csv = [headers, ...rows]
      .map(cols => cols.map(escapeCSV).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    a.href = url;
    a.download = `orders-${ts}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Toolbar */}
      <div className="admin-toolbar">
        <input
          className="admin-input"
          placeholder="Search…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <select
          className="admin-select"
          value={status}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setStatus(e.target.value as typeof status)
          }
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="expired">Expired</option>
        </select>
        <select
          className="admin-select"
          value={method}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setMethod(e.target.value as typeof method)
          }
        >
          <option value="all">All methods</option>
          <option value="usdt">USDT</option>
          <option value="card">Card</option>
        </select>

        {/* Date range */}
        <div className="date-range">
  <label>From</label>
  <input
    type="date"
    value={pendingStart}
    onChange={e => setPendingStart(e.target.value)}
  />
  <label>To</label>
  <input
    type="date"
    value={pendingEnd}
    onChange={e => setPendingEnd(e.target.value)}
  />
  <button
    className="admin-btn"
    onClick={() => {
      setStartDate(pendingStart);
      setEndDate(pendingEnd);
    }}
    style={{ marginLeft: 8 }}
  >
    Apply
  </button>
</div>

        {/* Presets */}
        <div className="presets">
          <button className="preset-btn" onClick={() => preset(7)}>
            Last 7d
          </button>
          <button className="preset-btn" onClick={() => preset(30)}>
            Last 30d
          </button>
          <button className="preset-btn" onClick={clearRange}>
            All time
          </button>
        </div>

        {/* Timezone selector */}
        <select
          className="admin-select"
          value={tz}
          onChange={(e) => setTz(e.target.value as 'local' | 'utc')}
          title="Timezone"
        >
          <option value="local">Local time</option>
          <option value="utc">UTC</option>
        </select>

        <button className="admin-btn" onClick={downloadCSV}>
          Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="admin-summary">
        <div className="card">
          <div className="card-title">Orders (in range)</div>
          <div className="card-tags">
            <span className="tag">Total: {counts.total}</span>
            <span className="tag success">Paid: {counts.paid}</span>
            <span className="tag warn">Pending: {counts.pending}</span>
            <span className="tag muted">Expired: {counts.expired}</span>
          </div>
        </div>
        <div className="card">
          <div className="card-title">Revenue (in range)</div>
          <div className="card-value">${paidInRange.toFixed(2)}</div>
        </div>
      </div>

      {/* Sparkline */}
      <div className="spark-wrap">
        <div className="spark-title">Revenue per day (in range)</div>
        <div className="spark-line">
          {sparkValues.map((v, i) => (
            <div
              key={i}
              className="spark-bar"
              title={`${sparkLabels[i]}: $${v.toFixed(2)}`}
              style={{ height: `${Math.round((v / sparkMax) * 100)}%` }}
            />
          ))}
        </div>
        {sparkLabels.length > 0 && (
          <div className="spark-legend">
            <span>{sparkLabels[0]}</span>
            <span>{sparkLabels[sparkLabels.length - 1]}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <div className="stat">
          <div className="stat-label">Filtered Orders</div>
          <div className="stat-value">{filtered.length}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Filtered Paid Revenue</div>
          <div className="stat-value">${totalPaidFiltered.toFixed(2)}</div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Created</th>
              <th>Status</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Name</th>  
              <th>Email</th>
              <th>TXID</th>
              <th>Country</th>
              <th>IP</th>
              <th>Order ID</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id}>
                <td>{fmtDateTime(o.createdAt, tz)}</td>
                <td>{o.status}</td>
                <td>{o.productName}</td>
                <td>${Number(o.amountUsd).toFixed(2)}</td>
                <td>{o.method}</td>
                 <td data-label="Name">{o.buyerName || '-'}</td>
                <td>{o.email || '-'}</td>
                <td className="truncate">{o.txid || '-'}</td>
                <td>{o.countryName || o.countryCode || '-'}</td>
                <td className="truncate">{o.ip || '-'}</td>
                <td className="mono truncate">{o.id}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center' }}>
                  No matching orders.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function escapeCSV(val: string) {
  const needsQuotes = /[",\n]/.test(String(val));
  const s = String(val).replace(/"/g, '""');
  return needsQuotes ? `"${s}"` : s;
}