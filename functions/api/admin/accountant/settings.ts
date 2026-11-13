// functions/api/admin/accountant/settings.ts
//
// Company profile shown on invoices (name, address, tax/ICE id, bank
// details) plus the invoice-numbering counter - a plain key/value store
// (accountant_settings) since these fields are few and rarely change. Same
// admin gate as the rest of /api/admin/* (Bearer <ADMIN_PASSWORD|ADMIN_KEY>).

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

// Every recognized setting key, with its default - keeps GET/POST in sync
// and means a brand-new deployment (empty accountant_settings table) still
// returns something sensible instead of blank fields everywhere.
const DEFAULTS: Record<string, string> = {
  company_name: '',
  company_logo: '', // data: URL, uploaded via the Settings page (no file storage on this static site)
  company_address: '',
  company_tax_id: '',
  company_email: '',
  company_phone: '',
  bank_name: '',
  bank_account: '',
  bank_iban: '',
  bank_swift: '',
  invoice_prefix: 'INV',
  next_invoice_number: '1',
  default_currency: 'USD',
  default_tax_rate: '0',
};

export async function onRequestGet(context: any) {
  const { request, env } = context;
  if (!checkAuth(request, env)) return unauthorized();

  try {
    const rows = await env.DB.prepare('SELECT key, value FROM accountant_settings').all();
    const settings = { ...DEFAULTS };
    for (const r of (rows?.results || []) as any[]) {
      if (r.key in settings || true) settings[r.key] = r.value;
    }
    return new Response(JSON.stringify({ settings }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to load settings' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  if (!checkAuth(request, env)) return unauthorized();

  try {
    const body: any = await request.json();
    const entries = Object.entries(body || {}).filter(([k]) => k in DEFAULTS);
    if (entries.length === 0) {
      return new Response(JSON.stringify({ error: 'No recognized settings in request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const stmt = env.DB.prepare(
      `INSERT INTO accountant_settings (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`
    );
    await env.DB.batch(entries.map(([k, v]) => stmt.bind(k, String(v ?? ''))));

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to save settings' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
