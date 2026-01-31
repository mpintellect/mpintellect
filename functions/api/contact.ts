// functions/api/contact.ts (Move from app/api/contact/route.ts)

import nodemailer from "nodemailer";

/**
 * HELPER: Build an SMTP transporter
 * Now accepts 'env' as an argument
 */
function getTransporter(env: any) {
  const { EMAIL_SERVER, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } = env;

  if (!EMAIL_SERVER || !EMAIL_USER || !EMAIL_PASSWORD) {
    throw new Error("Missing EMAIL_SERVER / EMAIL_USER / EMAIL_PASSWORD in Dashboard");
  }

  const portNum = Number(EMAIL_PORT || 465);
  const secure = portNum === 465; 

  return nodemailer.createTransport({
    host: EMAIL_SERVER,
    port: portNum,
    secure,
    auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD },
  });
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Cloudflare Handler: onRequestPost
 */
export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const body = await request.json().catch(() => ({}));
    const { name, email, message, hp } = body as {
      name?: string;
      email?: string;
      message?: string;
      hp?: string; 
    };

    // Honeypot check
    if (hp) return Response.json({ ok: true });

    // Validation
    if (!name || !email || !message) {
      return Response.json({ ok: false, error: "All fields required." }, { status: 400 });
    }

    const to = env.EMAIL_TO || env.EMAIL_FROM || "contact@mzprimer.com";
    const transporter = getTransporter(env);

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;line-height:1.5;color:#111">
        <h2 style="margin:0 0 6px 0">New Contact Form Message</h2>
        <p><b>Name:</b> ${escapeHtml(name)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        <p style="white-space:pre-wrap"><b>Message:</b><br>${escapeHtml(message)}</p>
      </div>
    `;

    await transporter.sendMail({
      from: env.EMAIL_FROM || `"MZPrimer" <${env.EMAIL_USER || "no-reply@mzprimer.com"}>`,
      to,
      replyTo: email,
      subject: `Contact Form: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html,
    });

    return Response.json({ ok: true });
  } catch (err: any) {
    console.error("Contact send error:", err);
    return Response.json({ ok: false, error: err.message || "Send failed." }, { status: 500 });
  }
}