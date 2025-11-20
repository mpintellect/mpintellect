// app/lib/email.ts
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js";
import fs from "fs";
import path from "path";

/* -------------------------------------------
   📌 PUBLIC TYPE FOR EMAIL PARAMETERS
------------------------------------------- */
export interface OrderEmailDetails {
  to: string;                // recipient email
  orderId: string;           // Stripe session ID
  productName: string;       // "AI Bot Trading", "Setup Plan (20 setups)"
  amountPaid: number;        // numeric amount
  downloadToken?: string;    // ONLY for AI Bot purchases
  paymentDetails?: {
    wallet: string;
    amount: number;
    txId?: string;
    txid?: string;
    network: string;
  };
}

/* -------------------------------------------
   Helpers
------------------------------------------- */
function getBaseUrl() {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://www.mzprimer.com";

  return url.replace(/\/+$/, "");
}

/* -------------------------------------------
   SMTP TRANSPORTER (REUSABLE SINGLETON)
------------------------------------------- */
let _transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (_transporter) return _transporter;

  const { EMAIL_SERVER, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } = process.env;

  if (!EMAIL_SERVER || !EMAIL_USER || !EMAIL_PASSWORD) {
    throw new Error("Missing email SMTP credentials.");
  }

  const portNum = Number(EMAIL_PORT || 465);
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

/* -------------------------------------------
   📌 HTML TEMPLATE — AI BOT (WITH DOWNLOAD)
------------------------------------------- */
function buildHtmlBot(order: OrderEmailDetails, downloadLink: string) {
  const pay = order.paymentDetails;
  const txId = pay?.txId ?? pay?.txid ?? "";

  return `
  <div style="background:#0a0a0a;padding:24px;color:#f2f2f2;font-family:Arial;">
    <div style="max-width:650px;margin:0 auto;background:#111214;border:1px solid #2d2f33;border-radius:16px;padding:28px;">

      <div style="text-align:right;">
        <img src="https://mzprimer.com/logos/logoblack.webp" style="height:36px;" />
      </div>

      <h2 style="color:#f2f2f2;font-size:22px;font-weight:bold;margin-bottom:12px;">
        Your AI Trading Bot is Ready 🎉
      </h2>

      <p style="color:#c7c7c7;margin-bottom:18px;">
        Thank you for your purchase. Your bot is now available for download.
      </p>

      <div style="background:#0e0f11;padding:18px;border-radius:12px;border:1px solid #2d2f33;margin-bottom:16px;">
        <div style="margin-bottom:6px;"><b>Product:</b> ${order.productName}</div>
        <div style="margin-bottom:6px;"><b>Amount Paid:</b> $${order.amountPaid.toFixed(2)}</div>
        <div><b>Order ID:</b> ${order.orderId}</div>
      </div>

      ${
        pay
          ? `<div style="background:#0f1012;padding:18px;border-radius:12px;border:1px solid #2d2f33;margin-bottom:16px;">
               <div style="font-weight:bold;margin-bottom:6px;">Payment Details</div>
               <div><b>Network:</b> ${pay.network}</div>
               <div><b>Wallet:</b> ${pay.wallet}</div>
               <div><b>TXID:</b> ${txId}</div>
               <div><b>Paid:</b> $${pay.amount.toFixed(2)}</div>
             </div>`
          : ""
      }

      <div style="text-align:center;margin:22px 0;">
        <a href="${downloadLink}"
           style="background:#f5c84b;color:#111;padding:14px 24px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:15px;">
          Download Trading Bot
        </a>
        <p style="color:#a9acb2;font-size:12px;margin-top:8px;">
          Link is one-time and expires in 24 hours.
        </p>
      </div>

      <p style="margin-top:20px;color:#b8b8b8;font-size:14px;">
        A PDF installation guide is attached for you.
      </p>

      <div style="margin-top:30px;color:#aaa;border-top:1px solid #2d2f33;padding-top:16px;font-size:13px;">
        <strong style="color:#fff;">MZPrimer Team</strong><br/>
        AI Trading Tools & Smart Market Solutions<br/>
        <a href="${getBaseUrl()}" style="color:#f5c84b;">www.mzprimer.com</a>
      </div>

    </div>
  </div>`;
}

/* -------------------------------------------
   📌 TEXT TEMPLATE (BOT)
------------------------------------------- */
function buildTextBot(order: OrderEmailDetails, downloadLink: string) {
  const lines = [
    `Your AI Trading Bot is Ready`,
    ``,
    `Product: ${order.productName}`,
    `Amount Paid: $${order.amountPaid.toFixed(2)}`,
    `Order ID: ${order.orderId}`,
    ``,
    `Download: ${downloadLink}`,
    ``,
  ];

  if (order.paymentDetails) {
    const txId = order.paymentDetails.txId ?? order.paymentDetails.txid ?? "";
    lines.push(
      `Payment Details:`,
      `  Network: ${order.paymentDetails.network}`,
      `  Wallet: ${order.paymentDetails.wallet}`,
      `  Amount: ${order.paymentDetails.amount}`,
      `  TXID: ${txId}`,
      ``
    );
  }

  lines.push(`Support: contact@mzprimer.com`, `${getBaseUrl()}`);
  return lines.join("\n");
}

/* -------------------------------------------
   📌 HTML TEMPLATE — SETUP PLANS
------------------------------------------- */
function buildHtmlSetup(order: OrderEmailDetails) {
  return `
  <div style="background:#0a0a0a;padding:24px;color:#e9e9ea;font-family:Arial;">
    <div style="max-width:650px;margin:0 auto;background:#111214;border:1px solid #2d2f33;border-radius:16px;padding:28px;">

      <div style="text-align:right;">
        <img src="https://mzprimer.com/logos/logoblack.webp" style="height:36px;" />
      </div>

      <h2 style="color:#fff;font-size:22px;font-weight:bold;margin-bottom:14px;">
        Purchase Confirmed 🎉
      </h2>

      <p style="color:#c7c7c7;">
        Your setup plan has been successfully activated.
      </p>

      <div style="background:#0e0f11;padding:18px;border-radius:12px;border:1px solid #2d2f33;margin-top:14px;">
        <div><b>Plan:</b> ${order.productName}</div>
        <div><b>Amount Paid:</b> $${order.amountPaid.toFixed(2)}</div>
        <div><b>Order ID:</b> ${order.orderId}</div>
      </div>

      <p style="margin-top:20px;color:#b8b8b8;font-size:14px;">
        You can now access your setups in your dashboard.
      </p>

      <div style="text-align:center;margin-top:20px;">
        <a href="${getBaseUrl()}/client/dashboard"
           style="background:#22c55e;padding:14px 22px;border-radius:12px;font-weight:700;color:#0e1011;text-decoration:none;">
          Go to Dashboard
        </a>
      </div>

      <div style="margin-top:30px;color:#aaa;border-top:1px solid #2d2f33;padding-top:16px;font-size:13px;">
        <strong style="color:#fff;">MZPrimer Team</strong><br/>
        Advanced AI Trading Tools<br/>
        <a href="${getBaseUrl()}" style="color:#f5c84b;">www.mzprimer.com</a>
      </div>
    </div>
  </div>`;
}

/* -------------------------------------------
   📌 TEXT TEMPLATE — SETUP
------------------------------------------- */
function buildTextSetup(order: OrderEmailDetails) {
  return [
    `Purchase Confirmed`,
    ``,
    `Plan: ${order.productName}`,
    `Amount Paid: $${order.amountPaid.toFixed(2)}`,
    `Order ID: ${order.orderId}`,
    ``,
    `Dashboard: ${getBaseUrl()}/client/dashboard`,
    ``,
    `Support: contact@mzprimer.com`,
  ].join("\n");
}

/* -------------------------------------------
   📌 MAIN SEND FUNCTION
------------------------------------------- */
export async function sendOrderConfirmation(order: OrderEmailDetails): Promise<void> {
  if (!order.to) throw new Error("Missing recipient email (order.to)");

  const isBot = !!order.downloadToken;
  const baseUrl = getBaseUrl();

  const downloadLink =
    isBot && order.downloadToken
      ? `${baseUrl}/api/download?token=${encodeURIComponent(order.downloadToken)}`
      : null;

  const transporter = getTransporter();

  // Attach PDF guide ONLY for bot purchases
  let attachments: Array<{ filename: string; path: string; contentType: string }> = [];
  if (isBot) {
    const guideAbs = path.resolve(process.cwd(), "public", "docs", "MZPrimer_Bot_Guide.pdf");
    if (fs.existsSync(guideAbs)) {
      attachments.push({
        filename: "MZPrimer_Bot_Guide.pdf",
        path: guideAbs,
        contentType: "application/pdf",
      });
    }
  }

  const html = isBot
    ? buildHtmlBot(order, downloadLink!)
    : buildHtmlSetup(order);

  const text = isBot
    ? buildTextBot(order, downloadLink!)
    : buildTextSetup(order);

  await transporter.sendMail({
  from: `"MZPrimer LTD" <${process.env.EMAIL_USER || "no-reply@mzprimer.com"}>`,
  to: order.to,
  subject: `Your MZPrimer Order — ${order.productName}`,
  text,
  html,
  attachments,
});
}