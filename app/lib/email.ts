import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

/** Public type you can import elsewhere */
export interface OrderEmailDetails {
  to: string;                 // recipient email
  orderId: string;
  productName: string;
  downloadToken: string;      // one-time token
  amountPaid: number;
  paymentDetails?: {
    wallet: string;
    amount: number;
    // Support either key casing; callers can send txId or txid
    txId?: string;
    txid?: string;
    network: string;
  };
}

/** Resolve site base URL (for download link) */
function getBaseUrl() {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000";
  return url.replace(/\/+$/, ""); // strip trailing slash
}

/** Singleton transporter */
let _transporter: nodemailer.Transporter | null = null;
function getTransporter() {
  if (_transporter) return _transporter;

  const { EMAIL_SERVER, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } = process.env;
  if (!EMAIL_SERVER || !EMAIL_USER || !EMAIL_PASSWORD) {
    throw new Error(
      "Email transport missing envs. Required: EMAIL_SERVER, EMAIL_USER, EMAIL_PASSWORD (EMAIL_PORT optional)."
    );
  }

  const portNum = Number(EMAIL_PORT || 465);
  const secure = portNum === 465; // 465=SSL, 587=STARTTLS

  _transporter = nodemailer.createTransport({
    host: EMAIL_SERVER,
    port: portNum,
    secure,
    auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD },
    logger: true,   // keep while debugging
    debug: true     // keep while debugging
  } as SMTPTransport.Options);

  return _transporter;
}

/** HTML email (inline styles for client compatibility) */
function buildHtml(order: OrderEmailDetails, downloadLink: string) {
  const pay = order.paymentDetails;
  const txId = pay?.txId ?? pay?.txid ?? ""; // <- unify here
  const payBlock = pay
    ? `
      <div style="margin-top:12px;padding:12px;border:1px solid #2a2d31;border-radius:12px;background:#0f1114;color:#e9e9ea">
        <div style="font-weight:700;margin-bottom:6px">Payment Details</div>
        <div><b>Network:</b> ${pay.network}</div>
        <div><b>Wallet:</b> ${pay.wallet}</div>
        <div><b>Amount:</b> $${pay.amount.toFixed(2)}</div>
        <div><b>TXID:</b> ${txId}</div>
      </div>`
    : "";

  return `
  <div style="background:#0a0a0a;padding:24px;color:#e9e9ea;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial">
  <div style="max-width:640px;margin:0 auto;background:#111214;border:1px solid #2a2d31;border-radius:14px;padding:24px;position:relative">
    
    <!-- ✅ Logo smaller, top-right -->
    <div style="text-align:right; margin-bottom:12px;">
      <img src="https://i.postimg.cc/rwN7Fk5Z/mzlogotransap.png" 
           alt="MZPrimer Logo"
           style="height:32px;width:auto;"/>
    </div>

      <h2 style="margin:0 0 8px 0;font-size:22px;font-weight:800;color:#e9e9ea">Thank you for your order!</h2>
      <p style="margin:0 0 14px 0;color:#a9acb2">Here are your purchase details:</p>

      <div style="padding:12px;border:1px solid #2a2d31;border-radius:12px;background:#0f1012">
        <div style="margin-bottom:6px"><b>Product:</b> ${order.productName}</div>
        <div style="margin-bottom:6px"><b>Amount Paid:</b> $${order.amountPaid.toFixed(2)}</div>
        <div><b>Order ID:</b> ${order.orderId}</div>
      </div>

      ${payBlock}

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
        If you have any questions, reply to this email or contact
        <a href="mailto:contact@mzprimer.com" style="color:#f5c84b;text-decoration:none">contact@mzprimer.com</a>.
      </p>

      <div style="margin-top:32px;padding-top:16px;border-top:1px solid #333;
                  color:#aaa;font-size:13px;line-height:1.6">
        <strong style="color:#fff">MZPrimer Team</strong><br/>
        <span style="color:#bbb">AI Trading Solutions · Education · Market Analysis</span><br/>
        <a href="https://mzprimer.com" style="color:#f5c84b;text-decoration:none">www.mzprimer.com</a><br/>
        <a href="mailto:contact@mzprimer.com" style="color:#f5c84b;text-decoration:none">contact@mzprimer.com</a>
      </div>
    </div>
  </div>`;
}

/** Plain-text fallback */
function buildText(order: OrderEmailDetails, downloadLink: string) {
  const lines = [
    `Thank you for your order!`,
    ``,
    `Product: ${order.productName}`,
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

  lines.push(
    ``,
    `Download your trading bot (one-time, expires in 24h):`,
    `${downloadLink}`,
    ``,
    `We've attached a PDF guide with installation instructions.`,
    ``,
    `Support: contact@mzprimer.com`,
    `--`,
    `MZPrimer Team`,
    `https://mzprimer.com`
  );

  return lines.join("\n");
}

/** Public API */
export async function sendOrderConfirmation(order: OrderEmailDetails): Promise<void> {
  if (!order?.to) throw new Error("Missing recipient email (order.to)");

  const baseUrl = getBaseUrl();
  const downloadLink = `${baseUrl}/api/download?token=${encodeURIComponent(order.downloadToken)}`;

  const tx = getTransporter();

  // Helpful logs while testing
  console.log("📧 Preparing order email", {
    to: order.to,
    orderId: order.orderId,
    product: order.productName,
    downloadLink,
  });

  try {
    const info = await tx.sendMail({
      from: process.env.EMAIL_FROM || `"MZPrimer" <${process.env.EMAIL_USER || "no-reply@mzprimer.com"}>`,
      to: order.to,
      subject: `Your MZPrimer Order #${order.orderId} — ${order.productName}`,
      text: buildText(order, downloadLink),
      html: buildHtml(order, downloadLink),
      replyTo: process.env.EMAIL_FROM || undefined,
      attachments: [
        {
          filename: "MZPrimer_Bot_Guide.pdf",
          path: "./public/docs/MZPrimer_Bot_Guide.pdf",
          contentType: "application/pdf",
        },
      ],
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Email send failed:", err);
    throw err;
  }
}