// app/api/contact/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getTransporter() {
  const { EMAIL_SERVER, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } = process.env;
  if (!EMAIL_SERVER || !EMAIL_USER || !EMAIL_PASSWORD) {
    throw new Error("Missing EMAIL_SERVER/EMAIL_USER/EMAIL_PASSWORD");
  }
  const portNum = Number(EMAIL_PORT || 465);
  const secure = portNum === 465;
  return nodemailer.createTransport({
    host: EMAIL_SERVER,
    port: portNum,
    secure,
    auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD },
  } as SMTPTransport.Options);
}

export async function POST(req: Request) {
  try {
    const { name, email, message, hp } = await req.json();

    // Simple validations
    if (hp) return NextResponse.json({ ok: true }); // honeypot => silently ignore
    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "All fields required." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
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
      from: process.env.EMAIL_FROM || `"MZPrimer" <${process.env.EMAIL_USER}>`,
      to,
      replyTo: email, // so you can reply directly
      subject: `Contact Form: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Contact send error:", err);
    return NextResponse.json({ ok: false, error: "Send failed." }, { status: 500 });
  }
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}