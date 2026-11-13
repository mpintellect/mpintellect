// functions/api/admin/accountant/clients.ts
//
// Client/partner directory for invoicing - app/accountant/clients/page.tsx.
// Same admin gate as the rest of /api/admin/* (Bearer <ADMIN_PASSWORD|ADMIN_KEY>).

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

export async function onRequestGet(context: any) {
  const { request, env } = context;
  if (!checkAuth(request, env)) return unauthorized();

  try {
    const clients = await env.DB.prepare('SELECT * FROM accountant_clients ORDER BY name ASC').all();
    return new Response(JSON.stringify({ clients: clients?.results || [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to load clients' }), {
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
    const name = (body.name || '').trim();
    if (!name) return badRequest('Name is required');

    const result = await env.DB.prepare(
      `INSERT INTO accountant_clients (name, contact_name, email, phone, address, tax_id, country, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        name,
        (body.contactName || '').trim() || null,
        (body.email || '').trim() || null,
        (body.phone || '').trim() || null,
        (body.address || '').trim() || null,
        (body.taxId || '').trim() || null,
        (body.country || '').trim() || null,
        (body.notes || '').trim() || null
      )
      .run();

    return new Response(JSON.stringify({ ok: true, id: result.meta?.last_row_id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to add client' }), {
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
    const name = (body.name || '').trim();
    if (!name) return badRequest('Name is required');

    await env.DB.prepare(
      `UPDATE accountant_clients
       SET name = ?, contact_name = ?, email = ?, phone = ?, address = ?, tax_id = ?, country = ?, notes = ?
       WHERE id = ?`
    )
      .bind(
        name,
        (body.contactName || '').trim() || null,
        (body.email || '').trim() || null,
        (body.phone || '').trim() || null,
        (body.address || '').trim() || null,
        (body.taxId || '').trim() || null,
        (body.country || '').trim() || null,
        (body.notes || '').trim() || null,
        id
      )
      .run();

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to update client' }), {
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
    const inUse = await env.DB.prepare('SELECT COUNT(*) AS count FROM accountant_invoices WHERE client_id = ?')
      .bind(id)
      .first();
    if (Number(inUse?.count || 0) > 0) {
      return badRequest('This client has invoices on file - cannot delete. Remove or reassign those invoices first.');
    }
    await env.DB.prepare('DELETE FROM accountant_clients WHERE id = ?').bind(id).run();
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to delete client' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
