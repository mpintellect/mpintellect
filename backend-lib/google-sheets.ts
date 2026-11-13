// backend-lib/google-sheets.ts
//
// Minimal Google Sheets client for Cloudflare Workers - no googleapis/
// google-auth-library (both assume Node APIs this runtime doesn't fully
// have). Auths as a service account via the JWT Bearer flow, signed with
// Web Crypto (crypto.subtle), which Workers supports natively.
//
// Used by functions/api/admin/broker/export-sheet.ts to append local-
// deposit/withdrawal rows to a manually-maintained ledger sheet.
//
// One-time setup for GOOGLE_SHEETS_CLIENT_EMAIL / GOOGLE_SHEETS_PRIVATE_KEY:
//   1. console.cloud.google.com -> create/pick a project
//   2. APIs & Services -> Library -> enable "Google Sheets API"
//   3. APIs & Services -> Credentials -> Create Credentials -> Service
//      Account (no IAM roles needed)
//   4. That service account -> Keys -> Add Key -> Create new key -> JSON
//      (downloads a .json file)
//   5. Open the target sheet -> Share -> paste in the JSON's `client_email`
//      -> give it Editor access
//   6. From the JSON, set GOOGLE_SHEETS_CLIENT_EMAIL to `client_email` and
//      GOOGLE_SHEETS_PRIVATE_KEY to `private_key` (keep the \n escapes
//      as-is - importPrivateKey() below undoes them)
// GOOGLE_SHEETS_ID and GOOGLE_SHEETS_GID come straight from the sheet's own
// URL (.../spreadsheets/d/<ID>/edit#gid=<GID>) - not secrets.

export interface GoogleSheetsEnv {
  GOOGLE_SHEETS_CLIENT_EMAIL?: string;
  GOOGLE_SHEETS_PRIVATE_KEY?: string;
  GOOGLE_SHEETS_ID?: string;
  // The tab's numeric id (the #gid=N in its share link), not its name.
  GOOGLE_SHEETS_GID?: string;
}

function base64UrlEncode(bytes: ArrayBuffer | Uint8Array | string): string {
  let binary: string;
  if (typeof bytes === 'string') {
    binary = bytes;
  } else {
    const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    binary = String.fromCharCode(...arr);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// .dev.vars / Cloudflare secrets can't hold real newlines in a single-line
// value, so the downloaded JSON key's \n escapes come through as literal
// backslash-n characters - restore them before parsing the PEM.
function importPrivateKey(pem: string): Promise<CryptoKey> {
  const normalized = pem.replace(/\\n/g, '\n');
  const body = normalized
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');
  const der = atob(body);
  const bytes = new Uint8Array(der.length);
  for (let i = 0; i < der.length; i++) bytes[i] = der.charCodeAt(i);
  return crypto.subtle.importKey('pkcs8', bytes, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
}

async function signJwt(clientEmail: string, privateKeyPem: string, scope: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claims = {
    iss: clientEmail,
    scope,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };
  const signingInput = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(claims))}`;
  const key = await importPrivateKey(privateKeyPem);
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(signingInput)
  );
  return `${signingInput}.${base64UrlEncode(signature)}`;
}

export async function getAccessToken(env: GoogleSheetsEnv): Promise<string> {
  if (!env.GOOGLE_SHEETS_CLIENT_EMAIL || !env.GOOGLE_SHEETS_PRIVATE_KEY) {
    throw new Error('GOOGLE_SHEETS_CLIENT_EMAIL / GOOGLE_SHEETS_PRIVATE_KEY not configured');
  }
  const jwt = await signJwt(
    env.GOOGLE_SHEETS_CLIENT_EMAIL,
    env.GOOGLE_SHEETS_PRIVATE_KEY,
    'https://www.googleapis.com/auth/spreadsheets'
  );
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }).toString(),
  });
  const json: any = await res.json();
  if (!res.ok || !json.access_token) {
    throw new Error(`Google token exchange failed: ${JSON.stringify(json)}`);
  }
  return json.access_token;
}

// Resolves a tab's title from its numeric gid (the ...#gid=0 in a sheet's
// URL) rather than requiring a human-typed tab name - gid is what's
// actually in the share link, title is just for building A1-notation
// ranges, which the Sheets values API needs.
export async function getSheetTabByGid(
  sheetId: string,
  gid: number,
  accessToken: string
): Promise<{ title: string; gid: number }> {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=sheets.properties`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const json: any = await res.json();
  if (!res.ok) throw new Error(`Failed to read spreadsheet metadata: ${JSON.stringify(json)}`);
  const sheets = json.sheets || [];
  const sheet = sheets.find((s: any) => s.properties?.sheetId === gid) || sheets[0];
  if (!sheet) throw new Error('Spreadsheet has no tabs');
  return { title: sheet.properties.title, gid: sheet.properties.sheetId };
}

export async function getSheetValues(
  sheetId: string,
  range: string,
  accessToken: string
): Promise<string[][]> {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const json: any = await res.json();
  if (!res.ok) throw new Error(`Failed to read sheet values: ${JSON.stringify(json)}`);
  return json.values || [];
}

// Appends after the last row with data in `range` - never touches existing
// rows. Returns the 0-indexed row range the new values landed in, so the
// caller can apply formatting (e.g. coloring withdrawal rows) to exactly
// those new rows and nothing else.
export async function appendSheetValues(
  sheetId: string,
  range: string,
  values: (string | number)[][],
  accessToken: string
): Promise<{ startRowIndex: number; endRowIndex: number }> {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
      range
    )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values }),
    }
  );
  const json: any = await res.json();
  if (!res.ok) throw new Error(`Failed to append sheet values: ${JSON.stringify(json)}`);
  // updatedRange looks like "Sheet1!A42:F45" - 1-indexed, inclusive.
  const match = (json.updates?.updatedRange || '').match(/![A-Z]+(\d+):[A-Z]+(\d+)/);
  const startRow1 = match ? parseInt(match[1], 10) : 1;
  const endRow1 = match ? parseInt(match[2], 10) : startRow1 + values.length - 1;
  return { startRowIndex: startRow1 - 1, endRowIndex: endRow1 };
}

// Overwrites specific cell ranges in place (e.g. updating one existing
// row's Date column without touching the rest of the row) - unlike
// appendSheetValues, this never creates new rows. Each entry's `range`
// should be a specific A1 range (e.g. "Sheet1!A5:B5"), not a whole column.
export async function batchUpdateValues(
  sheetId: string,
  updates: { range: string; values: (string | number)[][] }[],
  accessToken: string
): Promise<void> {
  if (updates.length === 0) return;
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchUpdate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      valueInputOption: 'USER_ENTERED',
      data: updates.map((u) => ({ range: u.range, values: u.values })),
    }),
  });
  if (!res.ok) {
    const json: any = await res.json();
    throw new Error(`Failed to batch-update sheet values: ${JSON.stringify(json)}`);
  }
}

export async function colorRows(
  sheetId: string,
  gid: number,
  rowIndexes: number[], // 0-indexed sheet rows to color
  rgb: { red: number; green: number; blue: number },
  accessToken: string
): Promise<void> {
  if (rowIndexes.length === 0) return;
  const requests = rowIndexes.map((rowIndex) => ({
    repeatCell: {
      range: { sheetId: gid, startRowIndex: rowIndex, endRowIndex: rowIndex + 1, startColumnIndex: 0, endColumnIndex: 6 },
      cell: { userEnteredFormat: { backgroundColor: rgb } },
      fields: 'userEnteredFormat.backgroundColor',
    },
  }));
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}:batchUpdate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests }),
  });
  if (!res.ok) {
    const json: any = await res.json();
    throw new Error(`Failed to color rows: ${JSON.stringify(json)}`);
  }
}

// Bold white-on-color header row, for a freshly-created tab that has no
// header formatting yet. Only ever applied to row 0 (the header), and only
// once (callers check the header text is already there before calling this
// again) - never touches data rows.
export async function formatHeaderRow(
  sheetId: string,
  gid: number,
  columnCount: number,
  rgb: { red: number; green: number; blue: number },
  accessToken: string
): Promise<void> {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}:batchUpdate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requests: [
        {
          repeatCell: {
            range: { sheetId: gid, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: columnCount },
            cell: {
              userEnteredFormat: {
                backgroundColor: rgb,
                textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
              },
            },
            fields: 'userEnteredFormat.backgroundColor,userEnteredFormat.textFormat',
          },
        },
      ],
    }),
  });
  if (!res.ok) {
    const json: any = await res.json();
    throw new Error(`Failed to format header row: ${JSON.stringify(json)}`);
  }
}

// USER_ENTERED parses a recognizable date string like "14/10/2026 14:58"
// into Sheets' internal date serial, but doesn't reliably auto-apply a
// date-time display format to the cell - without one it shows the raw
// serial number (e.g. "46309.62361") instead of the date. Set it
// explicitly on column A for the new rows rather than rely on detection.
export async function formatDateColumn(
  sheetId: string,
  gid: number,
  startRowIndex: number,
  endRowIndex: number,
  accessToken: string
): Promise<void> {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}:batchUpdate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requests: [
        {
          repeatCell: {
            range: { sheetId: gid, startRowIndex, endRowIndex, startColumnIndex: 0, endColumnIndex: 1 },
            cell: { userEnteredFormat: { numberFormat: { type: 'DATE_TIME', pattern: 'dd/mm/yyyy hh:mm' } } },
            fields: 'userEnteredFormat.numberFormat',
          },
        },
      ],
    }),
  });
  if (!res.ok) {
    const json: any = await res.json();
    throw new Error(`Failed to set date format: ${JSON.stringify(json)}`);
  }
}
