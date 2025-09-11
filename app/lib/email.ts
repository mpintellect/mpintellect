// app/lib/email.ts
import nodemailer from "nodemailer";
// ❌ old: import SMTPTransport from "nodemailer/lib/smtp-transport";
import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js"; // <-- ESM-safe, type-only
import fs from "fs";
import path from "path";

/** Public type you can import elsewhere */
export interface OrderEmailDetails {
  to: string;                 // recipient email
  orderId: string;
  productName: string;
  amountPaid: number;

  // Either bot OR subscription:
  downloadToken?: string;     // one-time token (bots only)
  licenseKey?: string;        // license (subscriptions only)

  // Optional extra context for subs
  assistantUrl?: string;      // e.g. https://mzprimer.com/tools/ai-assistant?activate=1

  paymentDetails?: {
    wallet: string;
    amount: number;
    txId?: string;            // support both casings
    txid?: string;
    network: string;
  };
}

/* ----------------- helpers ----------------- */

function getBaseUrl() {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://www.mzprimer.com";
  return url.replace(/\/+$/, "");
}

/** Reusable SMTP transporter (singleton) */
let _transporter: nodemailer.Transporter | null = null;
function getTransporter() {
  if (_transporter) return _transporter;

  const { EMAIL_SERVER, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } = process.env;
  if (!EMAIL_SERVER || !EMAIL_USER || !EMAIL_PASSWORD) {
    throw new Error(
      "Email env missing: EMAIL_SERVER, EMAIL_USER, EMAIL_PASSWORD (EMAIL_PORT optional)."
    );
  }

  const portNum = Number(EMAIL_PORT || 465); // 465 SSL, 587 STARTTLS
  const secure = portNum === 465;

  _transporter = nodemailer.createTransport({
    host: EMAIL_SERVER,
    port: portNum,
    secure,
    auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD },
    logger: true,
    debug: true,
  } as SMTPTransport.Options);

  return _transporter;
}

/* ---------------- BOT TEMPLATE (with download) ---------------- */

function buildHtmlBot(order: OrderEmailDetails, downloadLink: string) {
  const pay = order.paymentDetails;
  const txId = pay?.txId ?? pay?.txid ?? "";

  return `
  <div style="background:#0a0a0a;padding:24px;color:#e9e9ea;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial">
    <div style="max-width:640px;margin:0 auto;background:#111214;border:1px solid #2a2d31;border-radius:14px;padding:24px">
      <div style="text-align:right;margin-bottom:12px">
        <img src="https://i.postimg.cc/4yNW4Ts2/mzlogotransap.png" alt="MZPrimer" style="height:32px;width:auto;border:0" />
      </div>

      <h2 style="margin:0 0 8px 0;font-size:22px;font-weight:800;color:#e9e9ea">Thank you for your order!</h2>
      <p style="margin:0 0 14px 0;color:#a9acb2">Your trading bot is ready.</p>

      <div style="padding:12px;border:1px solid #2a2d31;border-radius:12px;background:#0f1012">
        <div style="margin-bottom:6px"><b>Product:</b> ${order.productName}</div>
        <div style="margin-bottom:6px"><b>Amount Paid:</b> $${order.amountPaid.toFixed(2)}</div>
        <div><b>Order ID:</b> ${order.orderId}</div>
      </div>

      ${
        pay
          ? `<div style="margin-top:12px;padding:12px;border:1px solid #2a2d31;border-radius:12px;background:#0f1114;color:#e9e9ea">
               <div style="font-weight:700;margin-bottom:6px">Payment Details</div>
               <div><b>Network:</b> ${pay.network}</div>
               <div><b>Wallet:</b> ${pay.wallet}</div>
               <div><b>Amount:</b> $${pay.amount.toFixed(2)}</div>
               <div><b>TXID:</b> ${txId}</div>
             </div>`
          : ""
      }

      <div style="text-align:center;margin:18px 0 10px">
        <a href="${downloadLink}"
           style="display:inline-block;background:#f5c84b;color:#111;padding:12px 18px;border-radius:12px;text-decoration:none;font-weight:800">
          Download Your Trading Bot
        </a>
        <div style="color:#a9acb2;margin-top:8px;font-size:12px">
          Link is one-time and expires in 24 hours.
        </div>
      </div>

      <p style="margin-top:20px;color:#a9acb2">
        We also attached a PDF guide with installation and usage instructions.
        Questions? <a href="mailto:contact@mzprimer.com" style="color:#f5c84b;text-decoration:none">contact@mzprimer.com</a>.
      </p>

      <div style="margin-top:32px;padding-top:16px;border-top:1px solid #333;color:#aaa;font-size:13px;line-height:1.6">
        <strong style="color:#fff">MZPrimer Team</strong><br/>
        <span style="color:#bbb">AI Trading Solutions · Education · Market Analysis</span><br/>
        <a href="https://mzprimer.com" style="color:#f5c84b;text-decoration:none">www.mzprimer.com</a>
      </div>
    </div>
  </div>`;
}

function buildTextBot(order: OrderEmailDetails, downloadLink: string) {
  const lines = [
    `Thank you for your order!`,
    ``,
    `Product: ${order.productName}`,
    `Amount Paid: $${order.amountPaid.toFixed(2)}`,
    `Order ID: ${order.orderId}`,
    ``,
    `Download your trading bot (one-time, expires in 24h):`,
    downloadLink,
  ];
  if (order.paymentDetails) {
    const txId = order.paymentDetails.txId ?? order.paymentDetails.txid ?? "";
    lines.push(
      ``,
      `Payment Details:`,
      `  Network: ${order.paymentDetails.network}`,
      `  Wallet: ${order.paymentDetails.wallet}`,
      `  Amount: $${order.paymentDetails.amount.toFixed(2)}`,
      `  TXID: ${txId}`
    );
  }
  lines.push(``, `Support: contact@mzprimer.com`, `https://mzprimer.com`);
  return lines.join("\n");
}

/* -------- SUBSCRIPTION TEMPLATE (with license + link) -------- */

function buildHtmlSubscription(order: OrderEmailDetails) {
  const pay = order.paymentDetails;
  const txId = pay?.txId ?? pay?.txid ?? "";
  const openUrl = order.assistantUrl || `${getBaseUrl()}/tools/ai-assistant?activate=1`;

  return `
  <div style="background:#0a0a0a;padding:24px;color:#e9e9ea;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial">
    <div style="max-width:640px;margin:0 auto;background:#111214;border:1px solid #2a2d31;border-radius:14px;padding:24px">
      <div style="text-align:right;margin-bottom:12px">
        <img src="https://i.postimg.cc/4yNW4Ts2/mzlogotransap.png" alt="MZPrimer" style="height:32px;width:auto;border:0" />
      </div>

      <h2 style="margin:0 0 8px 0;font-size:22px;font-weight:800;color:#e9e9ea">Subscription activated 🎉</h2>
      <p style="margin:0 0 14px 0;color:#a9acb2">Your AI Assistant subscription is now active.</p>

      <div style="padding:12px;border:1px solid #2a2d31;border-radius:12px;background:#0f1012">
        <div style="margin-bottom:6px"><b>Plan:</b> ${order.productName}</div>
        <div style="margin-bottom:6px"><b>Amount Paid:</b> $${order.amountPaid.toFixed(2)}</div>
        <div><b>Order ID:</b> ${order.orderId}</div>
      </div>

      ${
        pay
          ? `<div style="margin-top:12px;padding:12px;border:1px solid #2a2d31;border-radius:12px;background:#0f1114;color:#e9e9ea">
               <div style="font-weight:700;margin-bottom:6px">Payment Details</div>
               <div><b>Network:</b> ${pay.network}</div>
               <div><b>Wallet:</b> ${pay.wallet}</div>
               <div><b>Amount:</b> $${pay.amount.toFixed(2)}</div>
               <div><b>TXID:</b> ${txId}</div>
             </div>`
          : ""
      }

      ${
        order.licenseKey
          ? `<div style="margin-top:12px;padding:12px;border:1px dashed #3b3f46;border-radius:12px;background:#0f1012;color:#e9e9ea">
               <div style="font-weight:700;margin-bottom:6px">Your License Key</div>
               <div style="font-family:ui-monospace,Menlo,Consolas,monospace;background:#0b0c0e;padding:10px;border-radius:8px">
                 ${order.licenseKey}
               </div>
               <div style="margin-top:6px;color:#a9acb2;font-size:12px">
                 Keep this key safe. It may be required for activation.
               </div>
             </div>`
          : ""
      }

      <div style="text-align:center;margin:18px 0 10px">
        <a href="${openUrl}"
           style="display:inline-block;background:#22c55e;color:#0b0f12;padding:12px 18px;border-radius:12px;text-decoration:none;font-weight:800">
          Open AI Assistant
        </a>
      </div>

      <p style="margin-top:20px;color:#a9acb2">
        Need help? Reply to this email or contact
        <a href="mailto:contact@mzprimer.com" style="color:#f5c84b;text-decoration:none">contact@mzprimer.com</a>.
      </p>

      <div style="margin-top:32px;padding-top:16px;border-top:1px solid #333;color:#aaa;font-size:13px;line-height:1.6">
        <strong style="color:#fff">MZPrimer Team</strong><br/>
        <span style="color:#bbb">AI Trading Solutions · Education · Market Analysis</span><br/>
        <a href="https://mzprimer.com" style="color:#f5c84b;text-decoration:none">www.mzprimer.com</a>
      </div>
    </div>
  </div>`;
}

function buildTextSubscription(order: OrderEmailDetails) {
  const lines = [
    `Subscription activated`,
    ``,
    `Plan: ${order.productName}`,
    `Amount Paid: $${order.amountPaid.toFixed(2)}`,
    `Order ID: ${order.orderId}`,
  ];
  if (order.paymentDetails) {
    const txId = order.paymentDetails.txId ?? order.paymentDetails.txid ?? "";
    lines.push(
      ``,
      `Payment Details:`,
      `  Network: ${order.paymentDetails.network}`,
      `  Wallet: ${order.paymentDetails.wallet}`,
      `  Amount: $${order.paymentDetails.amount.toFixed(2)}`,
      `  TXID: ${txId}`
    );
  }
  const openUrl = order.assistantUrl || `${getBaseUrl()}/tools/ai-assistant?activate=1`;
  if (order.licenseKey) lines.push(``, `License Key: ${order.licenseKey}`);
  lines.push(``, `Open AI Assistant: ${openUrl}`, ``, `Support: contact@mzprimer.com`, `https://mzprimer.com`);
  return lines.join("\n");
}

/* ------------------- public API ------------------- */

export async function sendOrderConfirmation(order: OrderEmailDetails): Promise<void> {
  if (!order?.to) throw new Error("Missing recipient email (order.to)");

  const baseUrl = getBaseUrl();
  const isSubscription = !!order.licenseKey;

  // Build download link only for bot purchases - use the raw token
  const downloadLink =
    !isSubscription && order.downloadToken
      ? `${baseUrl}/api/download?token=${encodeURIComponent(order.downloadToken)}`
      : null;

  // Build attachments safely (bot only, PDF optional)
  let attachments: Array<{ filename: string; path: string; contentType: string }> = [];
  if (!isSubscription) {
    const guideAbs = path.resolve(process.cwd(), "public", "docs", "MZPrimer_Bot_Guide.pdf");
    if (fs.existsSync(guideAbs)) {
      attachments = [
        {
          filename: "MZPrimer_Bot_Guide.pdf",
          path: guideAbs,
          contentType: "application/pdf",
        },
      ];
    } else {
      console.warn("[email] Bot guide PDF not found at:", guideAbs);
    }
  }

  const tx = getTransporter();

  console.log("📧 Sending order email", {
    to: order.to,
    orderId: order.orderId,
    product: order.productName,
    mode: isSubscription ? "subscription" : "bot",
    hasDownloadToken: !!order.downloadToken,
    downloadLink: downloadLink || "NONE"
  });

  // Use the actual download link for bots, fallback to "#" only for subscriptions
  const html = isSubscription
    ? buildHtmlSubscription(order)
    : buildHtmlBot(order, downloadLink || "#download-error");

  const text = isSubscription
    ? buildTextSubscription(order)
    : buildTextBot(order, downloadLink || "Download link not available");

  await tx.sendMail({
    from:
      process.env.EMAIL_FROM ||
      `"MZPrimer" <${process.env.EMAIL_USER || "no-reply@mzprimer.com"}>`,
    to: order.to,
    subject: `Your MZPrimer Order #${order.orderId} — ${order.productName}`,
    text,
    html,
    replyTo: process.env.EMAIL_FROM || undefined,
    attachments,
  });
}