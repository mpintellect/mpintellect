// functions/api/admin/broker/export-sheet.ts
//
// "Export to Sheet" button on app/admin/broker/page.tsx. Appends local
// (Morocco) deposit/withdrawal rows (see LOCAL_METHOD_FILTER below,
// successful/completed only) plus any manually-entered local expenses
// (functions/api/admin/broker/expenses.ts) to a manually-maintained Google
// Sheet ledger - never touches rows already there. Reads the sheet first to
// dedupe by (date, name, account, amount MAD, amount USD), so re-clicking
// is safe.
//
// Columns written: Date | Status | Name | Account | Amount USD | Amount MAD
// Withdrawals and expenses get a negative amount; withdrawals get a
// light-red row background, expenses a light-amber one, so all three read
// distinctly in an otherwise single chronological list. Deposit rows are
// explicitly reset to no fill - Google Sheets auto-inherits the row-above's
// formatting when inserting rows via the API, so without this they'd pick
// up whatever color happens to be above them.
//
// Admin-gated the same way as the rest of /api/admin/* (Bearer
// <ADMIN_PASSWORD|ADMIN_KEY>, fails closed).

import {
  getAccessToken,
  getSheetTabByGid,
  getSheetValues,
  appendSheetValues,
  colorRows,
  formatDateColumn,
} from '../../../../backend-lib/google-sheets';

// Same match as functions/api/admin/broker/data.ts - keep in sync if either
// changes. Matches the normal "local (Local Deposit Morocco)" method
// string, AND bare "local" (seen on at least one real deposit, id 450716,
// confirmed by the admin as a Morocco transaction) - but NOT "local (Local
// deposit Algeria)", a different, unrelated method.
const LOCAL_METHOD_FILTER = `(LOWER(method) = 'local' OR LOWER(method) LIKE 'local (local deposit morocco)%')`;
const WITHDRAWAL_ROW_COLOR = { red: 0.98, green: 0.87, blue: 0.87 }; // light red
const EXPENSE_ROW_COLOR = { red: 1, green: 0.93, blue: 0.78 }; // light amber
const NO_FILL = { red: 1, green: 1, blue: 1 }; // white - deposits get no color

type RowType = 'deposit' | 'withdrawal' | 'expense';

interface LedgerRow {
  sortKey: string; // normalized "YYYYMMDDHHMM" for chronological sort
  date: string; // full "DD/MM/YYYY HH:MM" as written to the sheet
  status: string;
  name: string;
  account: string;
  amountMad: number;
  amountUsd: number;
  type: RowType;
}

// Investizo's list pages only give minute precision ("13:57"), never
// seconds - "DD.MM.YYYY HH:MM" becomes "DD/MM/YYYY HH:MM", not a fabricated
// ":00" or similar.
function formatSheetDate(txDate: string): string {
  const [datePart, timePart] = (txDate || '').split(' ');
  return `${(datePart || '').replace(/\./g, '/')}${timePart ? ' ' + timePart : ''}`;
}

function chronoKeyFromDots(txDate: string): string {
  const [d, rest] = (txDate || '').split(' ');
  const [dd, mm, yyyy] = (d || '').split('.');
  return `${yyyy || ''}${mm || ''}${dd || ''}${(rest || '').replace(':', '')}`;
}

// Expenses are admin-entered as "YYYY-MM-DD HH:MM" (see expenses.ts) - both
// the sheet's display format and the sort key need the same treatment as
// Investizo's dot-separated dates, just parsed differently.
function formatSheetDateFromIso(isoDate: string): string {
  const [datePart, timePart] = (isoDate || '').split(' ');
  const [yyyy, mm, dd] = (datePart || '').split('-');
  return `${dd || ''}/${mm || ''}/${yyyy || ''}${timePart ? ' ' + timePart : ''}`;
}

function chronoKeyFromIso(isoDate: string): string {
  const [d, rest] = (isoDate || '').split(' ');
  return `${(d || '').replace(/-/g, '')}${(rest || '').replace(':', '')}`;
}

function dedupeKey(row: { date: string; name: string; account: string; amountMad: number; amountUsd: number }): string {
  return `${row.date}|${row.name.trim().toLowerCase()}|${row.account.trim().toLowerCase()}|${row.amountMad.toFixed(
    2
  )}|${row.amountUsd.toFixed(2)}`;
}

// payment_amount is normally already MAD for local transactions, but at
// least one row (id 450716, bare "local" method) has payment_currency USD
// instead - Investizo's own Payment column showed a dollar figure for it.
// Confirmed by the admin: MAD = USD * 10 (their fixed rate) in that case.
// Same logic as data.ts's MAD_AMOUNT_EXPR - keep in sync.
function madAmount(r: any): number {
  if ((r.payment_currency || '').toLowerCase() === 'mad') return r.payment_amount ?? 0;
  return (r.account_amount ?? 0) * 10;
}

export async function onRequestPost(context: any) {
  const { request, env } = context;

  const authHeader = request.headers.get('Authorization');
  const expectedSecret = env.ADMIN_PASSWORD || env.ADMIN_KEY;
  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const sheetId = env.GOOGLE_SHEETS_ID;
  if (!sheetId) {
    return new Response(JSON.stringify({ ok: false, message: 'GOOGLE_SHEETS_ID not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  // GOOGLE_SHEETS_GID is the tab's numeric id (the #gid=0 in its share
  // link) - defaults to the sheet's first tab if unset. The tab's actual
  // title (needed for A1-notation ranges) is resolved from it below, so
  // nobody has to type the tab name in by hand.
  const gidEnv = env.GOOGLE_SHEETS_GID;
  const requestedGid = gidEnv !== undefined && gidEnv !== '' ? parseInt(gidEnv, 10) : 0;

  try {
    const accessToken = await getAccessToken(env);
    const { title: tab, gid } = await getSheetTabByGid(sheetId, requestedGid, accessToken);

    // Deposits keep method clean ("local (Local Deposit Morocco)"), but
    // withdrawals fold the purse/bank details into the same column
    // ("local (Local Deposit Morocco): MAD, <account>, <bank>") - see
    // backend-lib/investizo-scraper.ts's withdrawals column mapping. Match
    // by prefix for both, not exact equality, so withdrawals aren't missed.
    const [existingRows, deposits, withdrawals, expenses] = await Promise.all([
      getSheetValues(sheetId, `${tab}!A2:F100000`, accessToken),
      env.DB.prepare(`SELECT * FROM broker_deposits WHERE ${LOCAL_METHOD_FILTER} AND LOWER(status) = 'deposited'`).all(),
      env.DB.prepare(
        `SELECT * FROM broker_withdrawals WHERE ${LOCAL_METHOD_FILTER} AND LOWER(status) IN ('complete', 'completed')`
      ).all(),
      env.DB.prepare(`SELECT * FROM broker_local_expenses`).all(),
    ]);

    const existingKeys = new Set(
      existingRows
        .filter((r) => r.length >= 5)
        .map((r) =>
          dedupeKey({
            date: String(r[0] || ''),
            name: String(r[2] || ''),
            account: String(r[3] || ''),
            amountUsd: parseFloat(String(r[4]).replace(/[^\d.-]/g, '')) || 0,
            amountMad: parseFloat(String(r[5]).replace(/[^\d.-]/g, '')) || 0,
          })
        )
    );

    const candidates: LedgerRow[] = [
      ...(deposits.results || []).map((r: any) => ({
        sortKey: chronoKeyFromDots(r.tx_date),
        date: formatSheetDate(r.tx_date),
        status: 'Deposited',
        name: r.user_name || '',
        account: r.account || '',
        amountMad: madAmount(r),
        amountUsd: r.account_amount ?? 0,
        type: 'deposit' as RowType,
      })),
      ...(withdrawals.results || []).map((r: any) => ({
        sortKey: chronoKeyFromDots(r.tx_date),
        date: formatSheetDate(r.tx_date),
        status: 'Withdrawal Complete',
        name: r.user_name || '',
        account: r.account || '',
        amountMad: -Math.abs(madAmount(r)),
        amountUsd: -Math.abs(r.account_amount ?? 0),
        type: 'withdrawal' as RowType,
      })),
      ...(expenses.results || []).map((r: any) => ({
        sortKey: chronoKeyFromIso(r.expense_date),
        date: formatSheetDateFromIso(r.expense_date),
        status: r.category ? `Expense - ${r.category}` : 'Expense',
        name: r.description || '',
        account: r.category || '',
        amountMad: r.amount_mad === null ? 0 : -Math.abs(r.amount_mad),
        amountUsd: r.amount_usd === null ? 0 : -Math.abs(r.amount_usd),
        type: 'expense' as RowType,
      })),
    ].sort((a, b) => a.sortKey.localeCompare(b.sortKey));

    const newRows = candidates.filter((row) => !existingKeys.has(dedupeKey(row)));

    if (newRows.length === 0) {
      return new Response(JSON.stringify({ ok: true, added: 0, skipped: candidates.length, message: 'Nothing new to export.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const values = newRows.map((r) => [r.date, r.status, r.name, r.account, r.amountUsd, r.amountMad]);
    const { startRowIndex } = await appendSheetValues(sheetId, `${tab}!A:F`, values, accessToken);

    const rowIndexesOf = (type: RowType) =>
      newRows.map((r, i) => (r.type === type ? startRowIndex + i : -1)).filter((i) => i >= 0);
    const withdrawalRowIndexes = rowIndexesOf('withdrawal');
    const expenseRowIndexes = rowIndexesOf('expense');
    const depositRowIndexes = rowIndexesOf('deposit');

    await Promise.all([
      colorRows(sheetId, gid, withdrawalRowIndexes, WITHDRAWAL_ROW_COLOR, accessToken),
      colorRows(sheetId, gid, expenseRowIndexes, EXPENSE_ROW_COLOR, accessToken),
      colorRows(sheetId, gid, depositRowIndexes, NO_FILL, accessToken),
      formatDateColumn(sheetId, gid, startRowIndex, startRowIndex + newRows.length, accessToken),
    ]);

    return new Response(
      JSON.stringify({
        ok: true,
        added: newRows.length,
        skipped: candidates.length - newRows.length,
        withdrawalsColored: withdrawalRowIndexes.length,
        expensesColored: expenseRowIndexes.length,
        message: `Added ${newRows.length} row(s), skipped ${candidates.length - newRows.length} already in the sheet.`,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, message: err?.message || 'Export failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
