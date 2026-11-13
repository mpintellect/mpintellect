// functions/api/admin/accountant/invoices.ts
//
// Invoice CRUD for app/accountant/invoices/* - create/list/view/update/
// delete, each invoice made of accountant_invoices + its line items in
// accountant_invoice_items. Subtotal/tax/total are always computed here from
// the line items, never stored, so an edited item can't leave a stale total
// behind. Same admin gate as the rest of /api/admin/* (Bearer
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

function badRequest(message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
}

interface InvoiceItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
}

function withTotals(invoice: any, items: any[]) {
  const subtotal = items.reduce((sum, it) => sum + Number(it.quantity) * Number(it.unit_price), 0);
  const taxAmount = subtotal * (Number(invoice.tax_rate) || 0) / 100;
  return { ...invoice, subtotal, tax_amount: taxAmount, total: subtotal + taxAmount };
}

// "INV-2026-0001" - reads+increments accountant_settings' invoice_prefix/
// next_invoice_number counter. Not wrapped in a D1 transaction (Pages
// Functions' D1 binding has no multi-statement transaction API) - acceptable
// here since this is a single-admin internal tool, same tradeoff already
// made elsewhere in this app (e.g. admin_totp's lockout counter).
async function nextInvoiceNumber(env: any): Promise<string> {
  const rows = await env.DB.prepare(
    `SELECT key, value FROM accountant_settings WHERE key IN ('invoice_prefix', 'next_invoice_number')`
  ).all();
  const map: Record<string, string> = {};
  for (const r of (rows?.results || []) as any[]) map[r.key] = r.value;
  const prefix = map.invoice_prefix || 'INV';
  const counter = parseInt(map.next_invoice_number || '1', 10) || 1;
  const year = new Date().getFullYear();
  const invoiceNumber = `${prefix}-${year}-${String(counter).padStart(4, '0')}`;

  await env.DB.prepare(
    `INSERT INTO accountant_settings (key, value) VALUES ('next_invoice_number', ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`
  )
    .bind(String(counter + 1))
    .run();

  return invoiceNumber;
}

async function replaceItems(env: any, invoiceId: number, items: InvoiceItemInput[]) {
  await env.DB.prepare('DELETE FROM accountant_invoice_items WHERE invoice_id = ?').bind(invoiceId).run();
  if (items.length === 0) return;
  const stmt = env.DB.prepare(
    `INSERT INTO accountant_invoice_items (invoice_id, description, quantity, unit_price, sort_order)
     VALUES (?, ?, ?, ?, ?)`
  );
  await env.DB.batch(
    items.map((it, i) => stmt.bind(invoiceId, it.description, it.quantity, it.unitPrice, i))
  );
}

export async function onRequestGet(context: any) {
  const { request, env } = context;
  if (!checkAuth(request, env)) return unauthorized();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const invoice = await env.DB.prepare(
        `SELECT i.*, c.name AS client_name, c.email AS client_email, c.address AS client_address,
           c.tax_id AS client_tax_id, c.country AS client_country, c.contact_name AS client_contact_name
         FROM accountant_invoices i JOIN accountant_clients c ON c.id = i.client_id
         WHERE i.id = ?`
      )
        .bind(id)
        .first();
      if (!invoice) {
        return new Response(JSON.stringify({ error: 'Invoice not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const items = await env.DB.prepare(
        'SELECT * FROM accountant_invoice_items WHERE invoice_id = ? ORDER BY sort_order ASC, id ASC'
      )
        .bind(id)
        .all();
      return new Response(JSON.stringify({ invoice: withTotals(invoice, items?.results || []), items: items?.results || [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const invoices = await env.DB.prepare(
      `SELECT i.*, c.name AS client_name,
         COALESCE((SELECT SUM(quantity * unit_price) FROM accountant_invoice_items WHERE invoice_id = i.id), 0) AS subtotal
       FROM accountant_invoices i JOIN accountant_clients c ON c.id = i.client_id
       ORDER BY i.issue_date DESC, i.id DESC`
    ).all();
    const list = ((invoices?.results || []) as any[]).map((inv) => {
      const taxAmount = inv.subtotal * (Number(inv.tax_rate) || 0) / 100;
      return { ...inv, tax_amount: taxAmount, total: inv.subtotal + taxAmount };
    });
    return new Response(JSON.stringify({ invoices: list }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to load invoices' }), {
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
    const clientId = parseInt(body.clientId, 10);
    const issueDate = (body.issueDate || '').trim();
    const items: InvoiceItemInput[] = Array.isArray(body.items) ? body.items : [];

    if (!clientId) return badRequest('clientId is required');
    if (!issueDate) return badRequest('issueDate is required');
    if (items.length === 0) return badRequest('At least one line item is required');
    for (const it of items) {
      if (!it.description || !it.description.trim()) return badRequest('Every line item needs a description');
    }

    const invoiceNumber = await nextInvoiceNumber(env);
    const currency = (body.currency || 'USD').trim();
    const taxRate = Number(body.taxRate) || 0;
    const status = (body.status || 'draft').trim();

    const result = await env.DB.prepare(
      `INSERT INTO accountant_invoices
        (invoice_number, client_id, issue_date, due_date, currency, status, tax_rate, notes, payment_instructions)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        invoiceNumber,
        clientId,
        issueDate,
        (body.dueDate || '').trim() || null,
        currency,
        status,
        taxRate,
        (body.notes || '').trim() || null,
        (body.paymentInstructions || '').trim() || null
      )
      .run();

    const invoiceId = result.meta?.last_row_id;
    await replaceItems(env, invoiceId, items);

    return new Response(JSON.stringify({ ok: true, id: invoiceId, invoiceNumber }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to create invoice' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestPut(context: any) {
  const { request, env } = context;
  if (!checkAuth(request, env)) return unauthorized();

  try {
    const body: any = await request.json();
    const id = parseInt(body.id, 10);
    if (!id) return badRequest('id is required');

    const existing = await env.DB.prepare('SELECT id FROM accountant_invoices WHERE id = ?').bind(id).first();
    if (!existing) {
      return new Response(JSON.stringify({ error: 'Invoice not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const status = (body.status || 'draft').trim();
    const paidAt = status === 'paid' ? (body.paidAt || new Date().toISOString().slice(0, 10)) : body.paidAt || null;

    await env.DB.prepare(
      `UPDATE accountant_invoices
       SET client_id = ?, issue_date = ?, due_date = ?, currency = ?, status = ?, tax_rate = ?,
           notes = ?, payment_instructions = ?, paid_at = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    )
      .bind(
        parseInt(body.clientId, 10) || existing.client_id,
        (body.issueDate || '').trim(),
        (body.dueDate || '').trim() || null,
        (body.currency || 'USD').trim(),
        status,
        Number(body.taxRate) || 0,
        (body.notes || '').trim() || null,
        (body.paymentInstructions || '').trim() || null,
        paidAt,
        id
      )
      .run();

    if (Array.isArray(body.items)) {
      await replaceItems(env, id, body.items);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to update invoice' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestDelete(context: any) {
  const { request, env } = context;
  if (!checkAuth(request, env)) return unauthorized();

  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id') || '', 10);
  if (!id) return badRequest('id is required');

  try {
    await env.DB.prepare('DELETE FROM accountant_invoice_items WHERE invoice_id = ?').bind(id).run();
    await env.DB.prepare('DELETE FROM accountant_invoices WHERE id = ?').bind(id).run();
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to delete invoice' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
