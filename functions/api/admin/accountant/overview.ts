// functions/api/admin/accountant/overview.ts
//
// Revenue (paid invoices) vs. expenses, by month and currency, plus
// outstanding (sent/overdue, not yet paid) invoice totals - for
// app/accountant/overview/page.tsx. Currencies are never mixed/converted
// (no exchange-rate data source here), so every total is reported per
// currency separately. Same admin gate as the rest of /api/admin/* (Bearer
// <ADMIN_PASSWORD|ADMIN_KEY>).

function checkAuth(request: Request, env: any): boolean {
  const authHeader = request.headers.get('Authorization');
  const expectedSecret = env.ADMIN_PASSWORD || env.ADMIN_KEY;
  return !!expectedSecret && authHeader === `Bearer ${expectedSecret}`;
}

function unauthorized() {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Invoice total = subtotal (from its line items) * (1 + tax_rate / 100) -
// same formula as invoices.ts's withTotals(), just computed inline in SQL
// here since these are aggregate queries, not single-invoice reads.
const INVOICE_TOTAL_EXPR = `
  (COALESCE((SELECT SUM(quantity * unit_price) FROM accountant_invoice_items WHERE invoice_id = i.id), 0)
   * (1 + i.tax_rate / 100.0))
`;

export async function onRequestGet(context: any) {
  const { request, env } = context;
  if (!checkAuth(request, env)) return unauthorized();

  try {
    const [revenueRows, expenseRows, outstandingRows, clientCount, invoiceCount, ledgerTotals] = await Promise.all([
      env.DB.prepare(
        `SELECT substr(i.paid_at, 1, 7) AS month, i.currency, SUM(${INVOICE_TOTAL_EXPR}) AS total, COUNT(*) AS count
         FROM accountant_invoices i
         WHERE i.status = 'paid' AND i.paid_at IS NOT NULL
         GROUP BY month, i.currency
         ORDER BY month`
      ).all(),
      env.DB.prepare(
        `SELECT substr(expense_date, 1, 7) AS month, currency, SUM(amount) AS total
         FROM accountant_expenses
         WHERE type = 'expense'
         GROUP BY month, currency
         ORDER BY month`
      ).all(),
      env.DB.prepare(
        `SELECT i.currency, SUM(${INVOICE_TOTAL_EXPR}) AS total, COUNT(*) AS count
         FROM accountant_invoices i
         WHERE i.status IN ('sent', 'overdue')
         GROUP BY i.currency`
      ).all(),
      env.DB.prepare('SELECT COUNT(*) AS count FROM accountant_clients').first(),
      env.DB.prepare('SELECT COUNT(*) AS count FROM accountant_invoices').first(),
      // Bank-ledger totals (the full accountant_expenses import: revenue/expense/bank_fee) -
      // reported separately from the invoice-based revenue above since they're two different
      // sources (formal invoicing vs. the raw bank statement) and summing them together would
      // double-count any client payment that is represented in both.
      env.DB.prepare(
        `SELECT type, currency, SUM(amount) AS total, COUNT(*) AS count
         FROM accountant_expenses
         GROUP BY type, currency`
      ).all(),
    ]);

    // Merge revenue + expenses into one row per (month, currency) so the
    // frontend can render a single grouped-bar chart/table, same convention
    // as app/admin/broker/MonthlyChart.tsx's {month, deposits, withdrawals}.
    const monthlyMap = new Map<string, { month: string; currency: string; revenue: number; expenses: number }>();
    const keyOf = (month: string, currency: string) => `${month}|${currency}`;
    for (const r of (revenueRows?.results || []) as any[]) {
      if (!r.month) continue;
      monthlyMap.set(keyOf(r.month, r.currency), { month: r.month, currency: r.currency, revenue: r.total, expenses: 0 });
    }
    for (const r of (expenseRows?.results || []) as any[]) {
      if (!r.month) continue;
      const key = keyOf(r.month, r.currency);
      const existing = monthlyMap.get(key);
      if (existing) existing.expenses = r.total;
      else monthlyMap.set(key, { month: r.month, currency: r.currency, revenue: 0, expenses: r.total });
    }
    const monthly = Array.from(monthlyMap.values()).sort(
      (a, b) => a.month.localeCompare(b.month) || a.currency.localeCompare(b.currency)
    );

    // { currency: { revenue, expense, bank_fee } } - net = revenue - expense - bank_fee per currency.
    const ledgerByCurrency = new Map<string, { revenue: number; expense: number; bank_fee: number }>();
    for (const r of (ledgerTotals?.results || []) as any[]) {
      const bucket = ledgerByCurrency.get(r.currency) || { revenue: 0, expense: 0, bank_fee: 0 };
      bucket[r.type as 'revenue' | 'expense' | 'bank_fee'] = r.total;
      ledgerByCurrency.set(r.currency, bucket);
    }
    const bankLedger = Array.from(ledgerByCurrency.entries()).map(([currency, t]) => ({
      currency,
      revenue: t.revenue,
      expense: t.expense,
      bankFees: t.bank_fee,
      net: t.revenue - t.expense - t.bank_fee,
    }));

    return new Response(
      JSON.stringify({
        monthly,
        outstanding: outstandingRows?.results || [],
        clientCount: Number(clientCount?.count || 0),
        invoiceCount: Number(invoiceCount?.count || 0),
        bankLedger,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to load overview' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
