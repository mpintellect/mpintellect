// functions/api/admin/accountant/overview.ts
//
// Revenue/expenses/bank fees from the bank ledger (accountant_expenses),
// broken out per accounting fiscal year (1 Sep - 31 Aug) plus an all-time
// total, for app/accountant/overview/page.tsx's year tabs. Also reports
// outstanding (sent/overdue, not yet paid) invoice totals separately -
// formally-invoiced revenue is NOT folded into the ledger totals below,
// since accountant_invoices and accountant_expenses are two independent
// sources and summing them would double-count a client payment recorded in
// both. Per-currency totals are never summed together directly (no implicit
// conversion) - each `rows` entry is one currency's own numbers. A separate
// `gbpEquivalent` total IS computed per period, for UK tax declaration,
// using each row's own `fx_rate_to_gbp` (the real historical spot rate on
// its own expense_date, looked up per transaction, never estimated) - see
// [[accountant-bank-import]] memory for the specific rates/dates used and
// why. A row in a non-GBP currency with no rate backfilled yet is excluded
// from gbpEquivalent and counted in `unconvertedCount` so the UI can warn
// rather than silently under-report. Same admin gate as the rest of
// /api/admin/* (Bearer <ADMIN_PASSWORD|ADMIN_KEY>).

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

// Fiscal year = 1 Sep - 31 Aug, labeled by its ending year (e.g. Sep 2025 -
// Aug 2026 is fiscal year "2026"). A month >= 09 rolls into the NEXT
// calendar year's fiscal label.
const FISCAL_YEAR_EXPR = `
  (CAST(substr(expense_date, 1, 4) AS INTEGER)
    + CASE WHEN CAST(substr(expense_date, 6, 2) AS INTEGER) >= 9 THEN 1 ELSE 0 END)
`;

function fiscalYearOfMonth(month: string): number {
  const [year, mo] = month.split('-').map(Number);
  return year + (mo >= 9 ? 1 : 0);
}

export async function onRequestGet(context: any) {
  const { request, env } = context;
  if (!checkAuth(request, env)) return unauthorized();

  try {
    const [
      outstandingRows,
      clientCount,
      invoiceCount,
      fiscalYearRows,
      allTimeRows,
      categoryByFYRows,
      categoryAllTimeRows,
      vendorByFYRows,
      vendorAllTimeRows,
      monthlyRows,
      gbpByFYRows,
      gbpAllTimeRows,
    ] = await Promise.all([
      env.DB.prepare(
        `SELECT i.currency, SUM(${INVOICE_TOTAL_EXPR}) AS total, COUNT(*) AS count
         FROM accountant_invoices i
         WHERE i.status IN ('sent', 'overdue')
         GROUP BY i.currency`
      ).all(),
      env.DB.prepare('SELECT COUNT(*) AS count FROM accountant_clients').first(),
      env.DB.prepare('SELECT COUNT(*) AS count FROM accountant_invoices').first(),
      env.DB.prepare(
        `SELECT ${FISCAL_YEAR_EXPR} AS fiscalYearEnd, type, currency, SUM(amount) AS total
         FROM accountant_expenses
         GROUP BY fiscalYearEnd, type, currency
         ORDER BY fiscalYearEnd`
      ).all(),
      env.DB.prepare(
        `SELECT type, currency, SUM(amount) AS total
         FROM accountant_expenses
         GROUP BY type, currency`
      ).all(),
      env.DB.prepare(
        `SELECT ${FISCAL_YEAR_EXPR} AS fiscalYearEnd, category, type, currency, SUM(amount) AS total, COUNT(*) AS count
         FROM accountant_expenses
         WHERE category IS NOT NULL
         GROUP BY fiscalYearEnd, category, type, currency`
      ).all(),
      env.DB.prepare(
        `SELECT category, type, currency, SUM(amount) AS total, COUNT(*) AS count
         FROM accountant_expenses
         WHERE category IS NOT NULL
         GROUP BY category, type, currency`
      ).all(),
      env.DB.prepare(
        `SELECT ${FISCAL_YEAR_EXPR} AS fiscalYearEnd, vendor, type, currency, SUM(amount) AS total, COUNT(*) AS count
         FROM accountant_expenses
         WHERE vendor IS NOT NULL
         GROUP BY fiscalYearEnd, vendor, type, currency`
      ).all(),
      env.DB.prepare(
        `SELECT vendor, type, currency, SUM(amount) AS total, COUNT(*) AS count
         FROM accountant_expenses
         WHERE vendor IS NOT NULL
         GROUP BY vendor, type, currency`
      ).all(),
      env.DB.prepare(
        `SELECT substr(expense_date, 1, 7) AS month, type, currency, SUM(amount) AS total
         FROM accountant_expenses
         GROUP BY month, type, currency
         ORDER BY month`
      ).all(),
      // GBP-equivalent totals for tax declaration: GBP rows pass through
      // as-is, non-GBP rows are converted using their own backfilled
      // fx_rate_to_gbp (the real spot rate for that transaction's date,
      // never an estimate), and any non-GBP row still missing a rate is
      // excluded and counted so the UI can flag it instead of silently
      // under-reporting.
      env.DB.prepare(
        `SELECT ${FISCAL_YEAR_EXPR} AS fiscalYearEnd, type,
           SUM(CASE WHEN currency = 'GBP' THEN amount WHEN fx_rate_to_gbp IS NOT NULL THEN amount * fx_rate_to_gbp ELSE 0 END) AS total,
           SUM(CASE WHEN currency != 'GBP' AND fx_rate_to_gbp IS NULL THEN 1 ELSE 0 END) AS unconverted
         FROM accountant_expenses
         GROUP BY fiscalYearEnd, type`
      ).all(),
      env.DB.prepare(
        `SELECT type,
           SUM(CASE WHEN currency = 'GBP' THEN amount WHEN fx_rate_to_gbp IS NOT NULL THEN amount * fx_rate_to_gbp ELSE 0 END) AS total,
           SUM(CASE WHEN currency != 'GBP' AND fx_rate_to_gbp IS NULL THEN 1 ELSE 0 END) AS unconverted
         FROM accountant_expenses
         GROUP BY type`
      ).all(),
    ]);

    // { key: { revenue, expense, bank_fee } } -> net = revenue - expense - bank_fee.
    type Bucket = { revenue: number; expense: number; bank_fee: number };
    const emptyBucket = (): Bucket => ({ revenue: 0, expense: 0, bank_fee: 0 });
    const toRow = (currency: string, t: Bucket, extra: Record<string, unknown> = {}) => ({
      ...extra,
      currency,
      revenue: t.revenue,
      expense: t.expense,
      bankFees: t.bank_fee,
      net: t.revenue - t.expense - t.bank_fee,
    });

    const byFiscalYear = new Map<number, Map<string, Bucket>>();
    for (const r of (fiscalYearRows?.results || []) as any[]) {
      const byCurrency = byFiscalYear.get(r.fiscalYearEnd) || new Map<string, Bucket>();
      const bucket = byCurrency.get(r.currency) || emptyBucket();
      bucket[r.type as keyof Bucket] = r.total;
      byCurrency.set(r.currency, bucket);
      byFiscalYear.set(r.fiscalYearEnd, byCurrency);
    }

    // category/vendor breakdowns - same {name, type, currency, total, count}
    // shape for both the per-fiscal-year and all-time cuts, just grouped by
    // a different key (fiscalYearEnd vs none) and sorted biggest-first, top
    // 10 kept per period so the UI stays readable (23 vendors total, so this
    // rarely truncates anything meaningful).
    const topN = <T extends { total: number }>(rows: T[], n = 10) =>
      rows.sort((a, b) => b.total - a.total).slice(0, n);
    // Keep top N per type separately (revenue vs. expense/bank_fee) - a flat
    // top-10 across both would let a few big expense vendors crowd every
    // small revenue client out of the list entirely.
    const topNByType = <T extends { total: number; type: string }>(rows: T[], n = 10) => [
      ...topN(rows.filter((r) => r.type === 'revenue'), n),
      ...topN(rows.filter((r) => r.type !== 'revenue'), n),
    ];

    const groupByFY = (rows: any[], nameKey: 'category' | 'vendor') => {
      const map = new Map<number, any[]>();
      for (const r of rows) {
        const list = map.get(r.fiscalYearEnd) || [];
        list.push({ [nameKey]: r[nameKey], type: r.type, currency: r.currency, total: r.total, count: r.count });
        map.set(r.fiscalYearEnd, list);
      }
      return map;
    };
    const categoriesByFY = groupByFY((categoryByFYRows?.results || []) as any[], 'category');
    const vendorsByFY = groupByFY((vendorByFYRows?.results || []) as any[], 'vendor');
    const categoriesAllTime = topNByType(
      ((categoryAllTimeRows?.results || []) as any[]).map((r) => ({ category: r.category, type: r.type, currency: r.currency, total: r.total, count: r.count }))
    );
    const vendorsAllTime = topNByType(
      ((vendorAllTimeRows?.results || []) as any[]).map((r) => ({ vendor: r.vendor, type: r.type, currency: r.currency, total: r.total, count: r.count }))
    );

    // Monthly trend, tagged with its fiscal year so the frontend can filter
    // it per tab without a second round trip.
    const monthlyMap = new Map<string, { month: string; fiscalYearEnd: number; currency: string; revenue: number; expense: number; bank_fee: number }>();
    for (const r of (monthlyRows?.results || []) as any[]) {
      const key = `${r.month}|${r.currency}`;
      const row = monthlyMap.get(key) || {
        month: r.month,
        fiscalYearEnd: fiscalYearOfMonth(r.month),
        currency: r.currency,
        revenue: 0,
        expense: 0,
        bank_fee: 0,
      };
      row[r.type as 'revenue' | 'expense' | 'bank_fee'] = r.total;
      monthlyMap.set(key, row);
    }
    const monthly = Array.from(monthlyMap.values())
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((r) => ({
        month: r.month,
        fiscalYearEnd: r.fiscalYearEnd,
        currency: r.currency,
        revenue: r.revenue,
        expense: r.expense,
        bankFees: r.bank_fee,
        net: r.revenue - r.expense - r.bank_fee,
      }));

    // GBP-equivalent bucket per fiscal year, plus how many non-GBP rows (if
    // any) still lack a backfilled rate and were excluded from it.
    const gbpByFiscalYear = new Map<number, Bucket & { unconverted: number }>();
    for (const r of (gbpByFYRows?.results || []) as any[]) {
      const bucket = gbpByFiscalYear.get(r.fiscalYearEnd) || { ...emptyBucket(), unconverted: 0 };
      bucket[r.type as keyof Bucket] = r.total;
      bucket.unconverted += r.unconverted;
      gbpByFiscalYear.set(r.fiscalYearEnd, bucket);
    }
    const toGbpRow = (t: Bucket & { unconverted: number }) => ({
      revenue: t.revenue,
      expense: t.expense,
      bankFees: t.bank_fee,
      net: t.revenue - t.expense - t.bank_fee,
      unconvertedCount: t.unconverted,
    });

    const fiscalYears = Array.from(byFiscalYear.entries())
      .sort(([a], [b]) => a - b)
      .map(([fiscalYearEnd, byCurrency]) => ({
        fiscalYearEnd,
        label: `${fiscalYearEnd - 1}–${fiscalYearEnd}`,
        rows: Array.from(byCurrency.entries()).map(([currency, t]) => toRow(currency, t)),
        categories: topNByType(categoriesByFY.get(fiscalYearEnd) || []),
        topVendors: topNByType(vendorsByFY.get(fiscalYearEnd) || []),
        gbpEquivalent: toGbpRow(gbpByFiscalYear.get(fiscalYearEnd) || { ...emptyBucket(), unconverted: 0 }),
      }));

    const allTimeByCurrency = new Map<string, Bucket>();
    for (const r of (allTimeRows?.results || []) as any[]) {
      const bucket = allTimeByCurrency.get(r.currency) || emptyBucket();
      bucket[r.type as keyof Bucket] = r.total;
      allTimeByCurrency.set(r.currency, bucket);
    }
    const gbpAllTimeBucket = { ...emptyBucket(), unconverted: 0 };
    for (const r of (gbpAllTimeRows?.results || []) as any[]) {
      gbpAllTimeBucket[r.type as keyof Bucket] = r.total;
      gbpAllTimeBucket.unconverted += r.unconverted;
    }
    const allTime = {
      rows: Array.from(allTimeByCurrency.entries()).map(([currency, t]) => toRow(currency, t)),
      categories: categoriesAllTime,
      topVendors: vendorsAllTime,
      gbpEquivalent: toGbpRow(gbpAllTimeBucket),
    };

    return new Response(
      JSON.stringify({
        fiscalYears,
        allTime,
        monthly,
        outstanding: outstandingRows?.results || [],
        clientCount: Number(clientCount?.count || 0),
        invoiceCount: Number(invoiceCount?.count || 0),
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
