import fs from 'fs';
import path from 'path';
import { sendEmail } from '../app/utils/emailSender';

const batchesDir = path.join(process.cwd(), 'data', 'batches');
const sentLogPath = path.join(batchesDir, 'sent-log.json');

let sentBatches: string[] = fs.existsSync(sentLogPath) ? JSON.parse(fs.readFileSync(sentLogPath, 'utf-8')) : [];

const allBatches = fs.readdirSync(batchesDir).filter(f => f.startsWith('batch-')).sort();
const nextBatchFile = allBatches.find(f => !sentBatches.includes(f));
if (!nextBatchFile) {
  console.log('✅ All batches sent');
  process.exit(0);
}

const contacts = JSON.parse(fs.readFileSync(path.join(batchesDir, nextBatchFile), 'utf-8'));

const subject = '😓 That 0.01 lot XAUUSD loss? Let’s not repeat it…';

const htmlTemplate = (email: string) => `
  <div style="background:#111;color:#fff;padding:20px;font-family:sans-serif;border-radius:8px;line-height:1.6;">
    <h2>Welcome Trader,</h2>

    <p style="margin-bottom:10px;font-size:15px;">
      We know trading isn’t easy. That <strong>0.01 lot XAUUSD trade</strong> you opened recently… it hurt.<br/>
      <em>Sound familiar?</em> It’s not just you.
    </p>

    <div style="margin:22px 0;padding:18px;border-left:4px solid #f87171;background:#1a1a1a;color:#fefefe;border-radius:6px">
      <p style="margin:0;font-size:15px;">
        Just a few days ago, you opened a <strong>0.01 lot trade on XAUUSD</strong>.<br/>
        The setup looked right. But then came the stop-loss. 💥  
      </p>
    </div>

    <p style="margin-top:12px;color:#a9acb2;font-size:15px;">
      More than <strong>67%</strong> of retail traders close a trade too early or too late — even when their analysis is solid.<br/>
      Emotions take over. Fear wins. Logic disappears.
    </p>

    <p style="margin-top:18px;font-size:16px;color:#ffffff;font-weight:600">
      That’s why we built the <span style="color:#00ff83">MZPrimer AI Assistant</span>.
    </p>

    <p style="margin-top:8px;color:#a9acb2;font-size:15px;">
      Simulate your trade setup — and preview how the market may unfold — <u>before risking another dollar</u>.
    </p>

    <div style="text-align:center;margin:22px 0">
      <a href="https://mzprimer.com/tools/ai-assistant?symbol=XAUUSD&simulate=1&utm_source=email&utm_medium=welcome&utm_campaign=loss_recovery"
         style="display:inline-block;padding:12px 20px;background:#00ff83;color:#111;font-weight:bold;text-decoration:none;border-radius:8px;">
        👉 Try the AI Simulation (Free)
      </a>
    </div>

    <p style="color:#a9acb2;font-style:italic;font-size:14px;margin-top:-10px">
      If you’ve lost trades before — you’re not failing. You’re learning. Let’s speed that up.
    </p>

    <div style="margin-top:28px;color:#888;font-size:13px;text-align:center;">
      You received this email from <strong>MZPrimer LTD</strong>. 
      <a href="https://mzprimer.com/unsubscribe?email=${encodeURIComponent(email)}" style="color:#aaa;text-decoration:underline">Unsubscribe</a>
    </div>
  </div>
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