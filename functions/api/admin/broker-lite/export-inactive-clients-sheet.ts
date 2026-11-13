// functions/api/admin/broker-lite/export-inactive-clients-sheet.ts
//
// "Export Inactive Clients to Sheet" button on the LiteFinance panel's
// Local Service -> Clients tab. Pushes litefinance_local_service_clients
// rows with active = 0 (see schema.sql's comment for what that means) to a
// dedicated "no-active clients" tab the admin added to the SAME spreadsheet
// functions/api/admin/broker-lite/export-declined-sheet.ts already writes
// to (GOOGLE_SHEETS_DECLINED_ID) - just a different tab (gid), so this
// reuses that same service account rather than needing new secrets.
//
// Columns: Name | UID | Status Call. Only Name/UID are ever written by this
// endpoint - Status Call is a manual field for the call center (same
// convention as export-declined-sheet.ts's "Call status"/"CALL ANSWER"
// columns), never touched once a row exists. Append-only, deduped by UID
// against what's already in the sheet, so re-running this is always safe -
// a client who goes active then inactive again later won't get a second row.
//
// Admin-gated the same way as the rest of /api/admin/* (Bearer
// <ADMIN_PASSWORD|ADMIN_KEY>, fails closed).

import { getAccessToken, getSheetValues, appendSheetValues, formatHeaderRow } from '../../../../backend-lib/google-sheets';

// From the tab's own URL (...#gid=993547120) - not a secret, same as every
// other GOOGLE_SHEETS_*_GID in this codebase.
const NO_ACTIVE_CLIENTS_GID = 993547120;
const HEADER_COLOR = { red: 0.23, green: 0.51, blue: 0.96 }; // matches the dashboard's own #3B82F6 blue
const HEADERS = ['Name', 'UID', 'Status Call'];

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

  try {
    const accessToken = await getAccessToken({
      GOOGLE_SHEETS_CLIENT_EMAIL: env.GOOGLE_SHEETS_DECLINED_CLIENT_EMAIL,
      GOOGLE_SHEETS_PRIVATE_KEY: env.GOOGLE_SHEETS_DECLINED_PRIVATE_KEY,
    });

    // getSheetTabByGid isn't used here - the tab's title isn't known up
    // front and A1 ranges need it, so resolve it the same way that helper
    // does but against our fixed gid.
    const metaRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=sheets.properties`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const metaJson: any = await metaRes.json();
    if (!metaRes.ok) throw new Error(`Failed to read spreadsheet metadata: ${JSON.stringify(metaJson)}`);
    const sheet = (metaJson.sheets || []).find((s: any) => s.properties?.sheetId === NO_ACTIVE_CLIENTS_GID);
    if (!sheet) throw new Error(`No tab with gid ${NO_ACTIVE_CLIENTS_GID} found in this spreadsheet`);
    const tab = sheet.properties.title;

    const [headerRow, existingRows, inactiveClients] = await Promise.all([
      getSheetValues(sheetId, `${tab}!A1:C1`, accessToken),
      getSheetValues(sheetId, `${tab}!A2:B100000`, accessToken),
      env.DB.prepare(`SELECT name, uid FROM litefinance_local_service_clients WHERE active = 0 ORDER BY name`).all(),
    ]);

    if (headerRow.length === 0 || (headerRow[0] || []).join('|') !== HEADERS.join('|')) {
      await appendSheetValues(sheetId, `${tab}!A1:C1`, [HEADERS], accessToken);
      await formatHeaderRow(sheetId, NO_ACTIVE_CLIENTS_GID, HEADERS.length, HEADER_COLOR, accessToken);
    }

    const existingUids = new Set(existingRows.map((r) => String(r[1] || '').trim()).filter(Boolean));
    const toAppend = ((inactiveClients.results || []) as any[]).filter((c) => c.uid && !existingUids.has(String(c.uid)));

    if (toAppend.length === 0) {
      return new Response(
        JSON.stringify({ ok: true, added: 0, skipped: (inactiveClients.results || []).length, message: 'Nothing new to export.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const values = toAppend.map((c) => [c.name || '', c.uid || '', '']);
    await appendSheetValues(sheetId, `${tab}!A:C`, values, accessToken);

    return new Response(
      JSON.stringify({
        ok: true,
        added: toAppend.length,
        skipped: (inactiveClients.results || []).length - toAppend.length,
        message: `Added ${toAppend.length} new row(s), skipped ${
          (inactiveClients.results || []).length - toAppend.length
        } already in the sheet.`,
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
