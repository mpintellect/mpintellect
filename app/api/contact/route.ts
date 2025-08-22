// app/api/contact/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Build an SMTP transporter from env vars
function getTransporter() {
  const { EMAIL_SERVER, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } = process.env;

  if (!EMAIL_SERVER || !EMAIL_USER || !EMAIL_PASSWORD) {
    throw new Error("Missing EMAIL_SERVER / EMAIL_USER / EMAIL_PASSWORD");
  }

  const portNum = Number(EMAIL_PORT || 465);
  const secure = portNum === 465; // 465 = SSL, 587 = STARTTLS

  return nodemailer.createTransport({
    host: EMAIL_SERVER,
    port: portNum,
    secure,
    auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, message, hp } = body as {
      name?: string;
      email?: string;
      message?: string;
      hp?: string; // honeypot
    };

    // Honeypot: bots fill hidden field -> silently accept
    if (hp) return NextResponse.json({ ok: true });

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "All fields required." },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email." },
        { status: 400 }
      );
    }

    const to = process.env.EMAIL_TO || process.env.EMAIL_FROM || "contact@mzprimer.com";
    const transporter = getTransporter();

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;line-height:1.5;color:#111">
        <h2 style="margin:0 0 6px 0">New Contact Form Message</h2>
        <p><b>Name:</b> ${escapeHtml(name)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        <p style="white-space:pre-wrap"><b>Message:</b><br>${escapeHtml(message)}</p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"MZPrimer" <${process.env.EMAIL_USER || "no-reply@mzprimer.com"}>`,
      to,
      replyTo: email,
      subject: `Contact Form: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact send error:", err);
    return NextResponse.json({ ok: false, error: "Send failed." }, { status: 500 });
  }
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}