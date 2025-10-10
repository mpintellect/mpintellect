import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

// --- 1. Define email sending logic inline ---
async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER!,
    port: parseInt(process.env.EMAIL_PORT || '465', 10),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASSWORD!,
    },
  });

  await transporter.sendMail({
    from: `"MZPrimer LTD" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
    // ✅ ADD PROPER EMAIL HEADERS
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Content-Transfer-Encoding': 'quoted-printable',
    },
    // ✅ ADD ENCODING OPTIONS
    encoding: 'UTF-8'
  });
}

// --- 2. Setup paths and read batch-1.json only ---

const batchesDir = path.join(process.cwd(), 'data', 'batches');
const sentLogPath = path.join(batchesDir, 'sent-log.json');

let sentBatches: string[] = fs.existsSync(sentLogPath) ? JSON.parse(fs.readFileSync(sentLogPath, 'utf-8')) : [];

const allBatches = fs.readdirSync(batchesDir).filter(f => f.startsWith('batch-')).sort();
const nextBatchFile = 'batch-1.json';
if (!nextBatchFile) {
  console.log('✅ All batches sent');
  process.exit(0);
}

const contacts = JSON.parse(fs.readFileSync(path.join(batchesDir, nextBatchFile), 'utf-8'));

// ✅ FIXED SUBJECT - Remove special characters
const subject = 'Smarter TP, SL, and Lot Size In Seconds';

const htmlTemplate = (email: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MZPrimer AI Assistant</title>
</head>
<body style="background:#0a0a0a;padding:24px;color:#e9e9ea;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
    <div style="max-width:640px;margin:0 auto;background:#111214;border:1px solid #2a2d31;border-radius:14px;padding:24px">
      <div style="text-align:right;margin-bottom:12px">
        <img src="https://mzprimer.com/logos/logoblack.webp" alt="MZPrimer" style="height:32px;width:auto;border:0" />
      </div>

      <h2 style="margin:0 0 8px 0;font-size:22px;font-weight:800;color:#e9e9ea">Preview Your Next Trade — Before You Risk It</h2>
      <p style="margin:0 0 14px 0;color:#a9acb2">
        Still setting TP, SL or lot size manually? There's a smarter way.
      </p>

      <div style="padding:14px 16px;border:1px solid #2a2d31;border-radius:12px;background:#0f1012;margin:18px 0;color:#ffffff">
        <p style="margin:0;font-size:15px">
          Meet the <strong>MZPrimer AI Chat Assistant</strong> — your instant trade setup guide.
        </p>
        <p style="margin:10px 0 0 0;font-size:14px;color:#a9acb2">
          Just ask: <code style="background:#1c1c1c;padding:2px 6px;border-radius:4px;color:#f5c84b">"I want to trade XAUUSD with $100"</code><br/>
          And get a full response:
        </p>
        <ul style="margin:10px 0 0 18px;font-size:14px;line-height:1.6;color:#d4d4d4">
          <li>📍 Suggested pending order (Buy/Sell Stop/Limit)</li>
          <li>🎯 TP & SL levels based on trend & risk</li>
          <li>📊 Risk in USD + estimated win chance</li>
          <li>📈 Live price and market conditions</li>
          <li>💬 Smart explanation of the logic</li>
        </ul>
      </div>

      <p style="font-size:15px;color:#a9acb2;margin-top:14px">
        It's not a signal. It's an <strong>interactive simulation</strong> of your own setup — based on live price action, volatility, and trend strength.
      </p>

      <div style="text-align:center;margin:24px 0 12px">
        <a href="https://mzprimer.com/?utm_source=email&utm_medium=ai-launch&utm_campaign=ai-simulation"
          style="display:inline-block;padding:12px 20px;background:#f5c84b;color:#111;font-weight:bold;text-decoration:none;border-radius:8px;">
          👉 Try Your Free Simulation Now
        </a>
      </div>
      <p style="color:#a9acb2;font-style:italic;font-size:14px;text-align:center;margin:12px 0 0">
        No signup required. No risk. Just smarter trades.
      </p>

      <div style="margin-top:28px;color:#888;font-size:13px;text-align:center;">
        You received this email from <strong>MZPrimer LTD</strong>. 
        <a href="https://mzprimer.com/unsubscribe?email=${encodeURIComponent(email)}" style="color:#aaa;text-decoration:underline">Unsubscribe</a>
      </div>
    </div>
</body>
</html>
`;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const sendBatch = async () => {
  for (const contact of contacts) {
    try {
      await sendEmail({
        to: contact.Email,
        subject,
        html: htmlTemplate(contact.Email),
      });
      console.log(`✅ Sent to ${contact.Email}`);
      await delay(3000);
    } catch (err) {
      console.error(`❌ Failed to send to ${contact.Email}`, err);
    }
  }

  sentBatches.push(nextBatchFile);
  fs.writeFileSync(sentLogPath, JSON.stringify(sentBatches, null, 2));
  console.log(`📦 Batch complete: ${nextBatchFile}`);
};

sendBatch();