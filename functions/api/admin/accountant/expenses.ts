// functions/api/admin/accountant/expenses.ts
//
// General company expense ledger for app/accountant/expenses/page.tsx -
// deliberately separate from broker_local_expenses (functions/api/admin/
// broker/expenses.ts), which is specifically the Morocco cash balance's own
// outflows. Same admin gate as the rest of /api/admin/* (Bearer
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

export async function onRequestGet(context: any) {
  const { request, env } = context;
  if (!checkAuth(request, env)) return unauthorized();

  try {
    const expenses = await env.DB.prepare('SELECT * FROM accountant_expenses ORDER BY expense_date DESC, id DESC').all();
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
    const expenseDate = (body.expenseDate || '').trim();
    const amount = Number(body.amount);

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
    if (!Number.isFinite(amount) || amount <= 0) {
      return new Response(JSON.stringify({ error: 'Enter a valid amount' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const type = ['expense', 'revenue', 'bank_fee'].includes(body.type) ? body.type : 'expense';
    const fxRateToGbp = body.fxRateToGbp !== undefined && body.fxRateToGbp !== '' ? Number(body.fxRateToGbp) : null;

    const result = await env.DB.prepare(
      `INSERT INTO accountant_expenses (expense_date, description, category, vendor, currency, amount, type, fx_rate_to_gbp, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        expenseDate,
        description,
        (body.category || '').trim() || null,
        (body.vendor || '').trim() || null,
        (body.currency || 'USD').trim(),
        amount,
        type,
        Number.isFinite(fxRateToGbp) ? fxRateToGbp : null,
        (body.notes || '').trim() || null
      )
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
    await env.DB.prepare('DELETE FROM accountant_expenses WHERE id = ?').bind(id).run();
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
