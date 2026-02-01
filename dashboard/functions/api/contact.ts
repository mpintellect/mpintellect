// functions/api/contact.ts

import { sendEmail } from "../../../landing/backend-lib/email";

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const body = await request.json().catch(() => ({}));
    const { name, email, message, hp } = body;

    // Honeypot for bots
    if (hp) return Response.json({ ok: true });

    if (!name || !email || !message) {
      return Response.json({ ok: false, error: "All fields required." }, { status: 400 });
    }

    const html = `
      <div style="font-family:sans-serif; color:#111">
        <h2>New Contact Form Message</h2>
        <p><b>Name:</b> ${escapeHtml(name)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        <p><b>Message:</b><br>${escapeHtml(message)}</p>
      </div>
    `;

    // Use our new fetch-based utility
    await sendEmail({
      to: env.EMAIL_TO || "contact@mzprimer.com",
      subject: `Contact Form: ${name}`,
      html: html,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`
    }, env);

    return Response.json({ ok: true });
  } catch (err: any) {
    console.error("Contact send error:", err);
    return Response.json({ ok: false, error: "Email service unavailable." }, { status: 500 });
  }
}