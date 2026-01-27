// app/lib/email.ts
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

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
   SMTP TRANSPORTER (Cloudflare Edge compatible)
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
  const guideUrl = "https://mzprimer.com/docs/MZPrimer_Bot_Guide.pdf";

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
        <strong>Installation Guide:</strong> 
        <a href="${guideUrl}" style="color:#f5c84b;">Download PDF Guide</a>
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
  const guideUrl = "https://mzprimer.com/docs/MZPrimer_Bot_Guide.pdf";
  const lines = [
    `Your AI Trading Bot is Ready`,
    ``,
    `Product: ${order.productName}`,
    `Amount Paid: $${order.amountPaid.toFixed(2)}`,
    `Order ID: ${order.orderId}`,
    ``,
    `Download: ${downloadLink}`,
    ``,
    `Installation Guide: ${guideUrl}`,
    ``,
  ];

  if (order.paymentDetails) {
    const txId = order.paymentDetails.txId ?? order.paymentDetails.txid ?? "";
    lines.push(
      `Payment Details:`,
      `  Network: ${order.paymentDetails.network}`,
      `  Wallet: ${order.paymentDetails.wallet}`,
      `  Amount: $${order.paymentDetails.amount.toFixed(2)}`,
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
   📌 HTML TEMPLATE — ASSISTANT SUBSCRIPTION
------------------------------------------- */
function buildHtmlAssistant(order: OrderEmailDetails, licenseKey: string, assistantUrl: string) {
  return `
  <div style="background:#0a0a0a;padding:24px;color:#f2f2f2;font-family:Arial;">
    <div style="max-width:650px;margin:0 auto;background:#111214;border:1px solid #2d2f33;border-radius:16px;padding:28px;">

      <div style="text-align:right;">
        <img src="https://mzprimer.com/logos/logoblack.webp" style="height:36px;" />
      </div>

      <h2 style="color:#f2f2f2;font-size:22px;font-weight:bold;margin-bottom:12px;">
        Your AI Assistant Subscription is Active! 🎉
      </h2>

      <p style="color:#c7c7c7;margin-bottom:18px;">
        Thank you for subscribing to MZPrimer AI Assistant. Your license has been activated.
      </p>

      <div style="background:#0e0f11;padding:18px;border-radius:12px;border:1px solid #2d2f33;margin-bottom:16px;">
        <div style="margin-bottom:6px;"><b>Product:</b> ${order.productName}</div>
        <div style="margin-bottom:6px;"><b>Amount Paid:</b> $${order.amountPaid.toFixed(2)}</div>
        <div style="margin-bottom:6px;"><b>Order ID:</b> ${order.orderId}</div>
        <div><b>License Key:</b> <code style="background:#1a1a1a;padding:4px 8px;border-radius:4px;">${licenseKey}</code></div>
      </div>

      <div style="text-align:center;margin:22px 0;">
        <a href="${assistantUrl}"
           style="background:#3b82f6;color:#fff;padding:14px 24px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:15px;">
          Launch AI Assistant
        </a>
        <p style="color:#a9acb2;font-size:12px;margin-top:8px;">
          Your subscription will automatically renew.
        </p>
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
   📌 TEXT TEMPLATE — ASSISTANT
------------------------------------------- */
function buildTextAssistant(order: OrderEmailDetails, licenseKey: string, assistantUrl: string) {
  const lines = [
    `Your AI Assistant Subscription is Active!`,
    ``,
    `Product: ${order.productName}`,
    `Amount Paid: $${order.amountPaid.toFixed(2)}`,
    `Order ID: ${order.orderId}`,
    `License Key: ${licenseKey}`,
    ``,
    `Launch Assistant: ${assistantUrl}`,
    ``,
  ];

  lines.push(`Support: contact@mzprimer.com`, `${getBaseUrl()}`);
  return lines.join("\n");
}

/* -------------------------------------------
   📌 MAIN SEND FUNCTION (Cloudflare Edge compatible)
------------------------------------------- */
export async function sendOrderConfirmation(order: OrderEmailDetails & { 
  licenseKey?: string; 
  assistantUrl?: string;
  downloadToken?: string;
}): Promise<void> {
  if (!order.to) throw new Error("Missing recipient email (order.to)");

  const isBot = !!order.downloadToken;
  const isAssistant = !!order.licenseKey;
  const baseUrl = getBaseUrl();

  const transporter = getTransporter();

  // ✅ NO FILE ATTACHMENTS on Cloudflare Edge
  // Instead, we include download links in the email
  const attachments: any[] = [];

  let html: string;
  let text: string;
  let subject: string;

  if (isAssistant && order.licenseKey && order.assistantUrl) {
    // AI Assistant subscription
    html = buildHtmlAssistant(order, order.licenseKey, order.assistantUrl);
    text = buildTextAssistant(order, order.licenseKey, order.assistantUrl);
    subject = `Your MZPrimer AI Assistant Subscription — ${order.productName}`;
  } else if (isBot && order.downloadToken) {
    // AI Bot purchase
    const downloadLink = `${baseUrl}/api/download?token=${encodeURIComponent(order.downloadToken)}`;
    html = buildHtmlBot(order, downloadLink);
    text = buildTextBot(order, downloadLink);
    subject = `Your MZPrimer AI Bot Download — ${order.productName}`;
  } else {
    // Setup plan
    html = buildHtmlSetup(order);
    text = buildTextSetup(order);
    subject = `Your MZPrimer Setup Plan — ${order.productName}`;
  }

  await transporter.sendMail({
    from: `"MZPrimer LTD" <${process.env.EMAIL_USER || "no-reply@mzprimer.com"}>`,
    to: order.to,
    subject,
    text,
    html,
    attachments,
  });
}