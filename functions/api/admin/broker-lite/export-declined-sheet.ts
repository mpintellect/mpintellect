// functions/api/admin/broker-lite/export-declined-sheet.ts
//
// "Push Declined Bank Card Deposits to Sheet" button on the LiteFinance
// Deposits tab. Syncs declined bank-card deposits to the call center's
// "bank card Failed" Google Sheet - exactly ONE row per client, ever.
//
// "Last Failed Deposit Date" is singular by design: a client who declines
// again after already being on the list gets their EXISTING row updated in
// place (Date/User/Last Failed Deposit Date overwritten with the newer
// failure), never a second row appended - appending on every new failure
// was the original bug (reported back as "still send duplicated rows").
// Call status and CALL ANSWER are never touched on update - manual fields
// for the call center.
//
// A single client can also rack up several declined attempts in one go
// (same UID, timestamps minutes apart) - candidates are collapsed to one
// row per client (by UID, falling back to name if a row has no UID) before
// comparing against the sheet, keeping only their most recent failure.
//
// Columns: Date | User | UID | Call status | Last Failed Deposit Date |
// CALL ANSWER. UID is the numeric MT5 login (digits after "MT5-ECN-"/
// "MT5-CLS-"/etc in the account string), not litefinance_users.client_uid -
// matches what's already in the sheet's existing rows.
//
// Uses its OWN dedicated service account (GOOGLE_SHEETS_DECLINED_CLIENT_EMAIL/
// _PRIVATE_KEY), not the shared one the local-ledger export uses - the
// admin granted this sheet's access to a separate "failsync" service
// account instead, so getAccessToken() is called with a shimmed env object
// pointing at those two vars under the field names it expects.
//
// Note: LiteFinance's own native "Push Failed Card Deposits to Google
// Sheets" button, if also used on this same sheet, writes independently of
// this endpoint and does not share its per-client dedup - duplicates from
// that source are outside what this endpoint can prevent.
//
// Admin-gated the same way as the rest of /api/admin/* (Bearer
// <ADMIN_PASSWORD|ADMIN_KEY>, fails closed).

import {
  getAccessToken,
  getSheetTabByGid,
  getSheetValues,
  appendSheetValues,
  batchUpdateValues,
  formatDateColumn,
} from '../../../../backend-lib/google-sheets';

function uidFromAccount(account: string): string {
  const match = (account || '').match(/(\d+)$/);
  return match ? match[1] : '';
}

// "02.11.2026 21:52" -> "20261102 21:52", sortable as plain text - same
// re-slice trick as chronoKey() in tampermonkey/litefinance-sync.user.js.
function chronoKey(date: string): string {
  const [d, t] = (date || '').split(' ');
  const [dd, mm, yyyy] = (d || '').split('.');
  return `${yyyy || ''}${mm || ''}${dd || ''} ${t || ''}`;
}

interface Candidate {
  date: string;
  user: string;
  uid: string;
}

// Keeps only the most recent row per client.
function latestPerClient(rows: Candidate[]): Candidate[] {
  const byClient = new Map<string, Candidate>();
  for (const row of rows) {
    const key = (row.uid || row.user).trim().toLowerCase();
    if (!key) continue;
    const existing = byClient.get(key);
    if (!existing || chronoKey(row.date) > chronoKey(existing.date)) {
      byClient.set(key, row);
    }
  }
  return Array.from(byClient.values());
}

export async function onRequestPost(context: any) {
  const { env } = context;

  const authHeader = context.request.headers.get('Authorization');
  const expectedSecret = env.ADMIN_PASSWORD || env.ADMIN_KEY;
  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const sheetId = env.GOOGLE_SHEETS_DECLINED_ID;
  if (!sheetId) {
    return new Response(JSON.stringify({ ok: false, message: 'GOOGLE_SHEETS_DECLINED_ID not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const gidEnv = env.GOOGLE_SHEETS_DECLINED_GID;
  const requestedGid = gidEnv !== undefined && gidEnv !== '' ? parseInt(gidEnv, 10) : 0;

  try {
    const accessToken = await getAccessToken({
      GOOGLE_SHEETS_CLIENT_EMAIL: env.GOOGLE_SHEETS_DECLINED_CLIENT_EMAIL,
      GOOGLE_SHEETS_PRIVATE_KEY: env.GOOGLE_SHEETS_DECLINED_PRIVATE_KEY,
    });
    const { title: tab, gid } = await getSheetTabByGid(sheetId, requestedGid, accessToken);

    const [existingRows, declined] = await Promise.all([
      getSheetValues(sheetId, `${tab}!A2:F100000`, accessToken),
      env.DB.prepare(
        `SELECT * FROM litefinance_deposits WHERE LOWER(status) = 'declined' AND LOWER(method) LIKE 'bank card%'`
      ).all(),
    ]);

    // Last occurrence wins if a UID somehow already appears more than once
    // (pre-existing duplicates from before this fix, or from LiteFinance's
    // own native export writing to the same sheet) - defensive, not relied
    // on to actually clean those up.
    const uidToRow = new Map<string, { rowNumber: number; date: string }>();
    existingRows.forEach((r: string[], i: number) => {
      const uid = String(r[2] || '').trim();
      if (!uid) return;
      uidToRow.set(uid, { rowNumber: i + 2, date: String(r[0] || '') }); // sheet rows are 1-indexed, data starts at row 2
    });

    const allDeclined: Candidate[] = (declined.results || []).map((r: any) => ({
      date: r.tx_date || '',
      user: r.user_name || '',
      uid: uidFromAccount(r.account || ''),
    }));
    const candidates = latestPerClient(allDeclined);

    const toAppend: Candidate[] = [];
    const toUpdate: (Candidate & { rowNumber: number })[] = [];
    for (const r of candidates) {
      const existing = uidToRow.get(r.uid);
      if (!existing) {
        toAppend.push(r);
      } else if (chronoKey(r.date) > chronoKey(existing.date)) {
        toUpdate.push({ ...r, rowNumber: existing.rowNumber });
      }
      // else: no failure newer than what's already on their row - skip.
    }

    if (toAppend.length === 0 && toUpdate.length === 0) {
      return new Response(
        JSON.stringify({ ok: true, added: 0, updated: 0, skipped: candidates.length, message: 'Nothing new to export.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (toUpdate.length > 0) {
      const updates = toUpdate.flatMap((r) => [
        { range: `${tab}!A${r.rowNumber}:B${r.rowNumber}`, values: [[r.date, r.user]] },
        { range: `${tab}!E${r.rowNumber}`, values: [[r.date]] },
      ]);
      await batchUpdateValues(sheetId, updates, accessToken);
      for (const r of toUpdate) {
        await formatDateColumn(sheetId, gid, r.rowNumber - 1, r.rowNumber, accessToken);
      }
    }

    if (toAppend.length > 0) {
      const values = toAppend.map((r) => [r.date, r.user, r.uid, '', r.date, '']);
      const { startRowIndex, endRowIndex } = await appendSheetValues(sheetId, `${tab}!A:F`, values, accessToken);
      await formatDateColumn(sheetId, gid, startRowIndex, endRowIndex, accessToken);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        added: toAppend.length,
        updated: toUpdate.length,
        skipped: candidates.length - toAppend.length - toUpdate.length,
        message: `Added ${toAppend.length} new row(s), updated ${toUpdate.length} existing row(s), skipped ${
          candidates.length - toAppend.length - toUpdate.length
        } with nothing new.`,
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
