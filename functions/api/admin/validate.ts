// functions/api/admin/validate.ts

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const body = await request.json().catch(() => ({}));
    const { password } = body;

    const expectedPassword = env.ADMIN_PASSWORD || env.ADMIN_KEY || "mpintellect-admin";

    if (!password) {
      return new Response(
        JSON.stringify({ valid: false, error: "Password required" }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const isValid = password === expectedPassword || (env.ADMIN_KEY && password === env.ADMIN_KEY);

    return new Response(
      JSON.stringify({ valid: isValid }),
      { status: isValid ? 200 : 401, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ valid: false, error: error.message }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
