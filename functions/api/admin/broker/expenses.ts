// functions/api/admin/broker/expenses.ts
//
// Manual local-balance outflows - office expenses, transfers, marketing
// spend, etc. - that never show up in Investizo's own deposit/withdrawal
// lists. Entered by hand from app/admin/broker/page.tsx, subtracted from
// the "local balance" overview there, and exported to the Google Sheet
// ledger as a third row type alongside deposits/withdrawals
// (functions/api/admin/broker/export-sheet.ts).
//
// Admin-gated the same way as the rest of /api/admin/* (Bearer
// <ADMIN_PASSWORD|ADMIN_KEY>, fails closed).

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

export async function onRequestGet(context: any) {
  const { request, env } = context;
  if (!checkAuth(request, env)) return unauthorized();

  try {
    const expenses = await env.DB.prepare('SELECT * FROM broker_local_expenses ORDER BY expense_date DESC').all();
    return new Response(JSON.stringify({ expenses: expenses?.results || [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to load expenses' }), {
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
    const description = (body.description || '').trim();
    const category = (body.category || '').trim() || null;
    const expenseDate = (body.expenseDate || '').trim(); // "YYYY-MM-DDTHH:MM" from <input type="datetime-local">
    const amountMad = body.amountMad === '' || body.amountMad === undefined ? null : Number(body.amountMad);
    const amountUsd = body.amountUsd === '' || body.amountUsd === undefined ? null : Number(body.amountUsd);

    if (!description) {
      return new Response(JSON.stringify({ error: 'Description is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (!expenseDate) {
      return new Response(JSON.stringify({ error: 'Date is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if ((amountMad === null || Number.isNaN(amountMad)) && (amountUsd === null || Number.isNaN(amountUsd))) {
      return new Response(JSON.stringify({ error: 'Enter an amount in MAD or USD' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Normalize "YYYY-MM-DDTHH:MM" (datetime-local's format) -> "YYYY-MM-DD HH:MM"
    const normalizedDate = expenseDate.replace('T', ' ');

    const result = await env.DB.prepare(
      `INSERT INTO broker_local_expenses (expense_date, description, category, amount_mad, amount_usd)
       VALUES (?, ?, ?, ?, ?)`
    )
      .bind(normalizedDate, description, category, amountMad, amountUsd)
      .run();

    return new Response(JSON.stringify({ ok: true, id: result.meta?.last_row_id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to add expense' }), {
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
  if (!id) {
    return new Response(JSON.stringify({ error: 'id is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await env.DB.prepare('DELETE FROM broker_local_expenses WHERE id = ?').bind(id).run();
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to delete expense' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
