// scripts/sendTestDirect.ts
import nodemailer from 'nodemailer';

const EMAIL = 'contact@mzprimer.com';
const PASSWORD = process.env.EMAIL_PASSWORD || 'MZPrimer171717@'; // replace if testing

const testRecipient = 'abdrahman.mez@gmail.com'; // YOUR TEST EMAIL

const htmlContent = `
  <div style="background:#111;color:#fff;padding:20px;font-family:sans-serif;border-radius:8px;">
    <h2>Welcome Trader,</h2>
    <p>Discover the AI Trading Assistant from MZPrimer. Learn. Simulate. Avoid risky trades.</p>

    <div style="margin:22px 0;padding:18px;border-left:4px solid #f87171;background:#1a1a1a;color:#fefefe;border-radius:6px">
      <p style="margin:0;font-size:15px;line-height:1.6">
        Just a few days ago, you opened a <strong>0.01 lot trade on XAUUSD</strong>.<br/>
        The setup looked right. But then came the stop-loss. 💥  
        <br/><br/>
        <em>Sound familiar?</em> It’s not just you.
      </p>
    </div>

    <div style="margin-top:12px;color:#a9acb2;font-size:15px;line-height:1.6">
      More than <strong>67%</strong> of retail traders close a trade too early or too late — even when their analysis was correct.<br/>
      Emotions take over. Fear wins. Logic disappears.
    </div>

    <div style="margin-top:18px;font-size:16px;color:#ffffff;font-weight:600">
      That’s exactly why we built the <span style="color:#00ff83">MZPrimer AI Assistant</span>.
    </div>

    <div style="margin-top:8px;color:#a9acb2;font-size:15px;">
      It lets you simulate your trade setup — and see how the market might unfold — <u>before you risk another dollar</u>.
    </div>

    <div style="text-align:center;margin:22px 0">
      <a href="https://mzprimer.com/tools/ai-assistant?symbol=XAUUSD&simulate=1&utm_source=email&utm_medium=welcome&utm_campaign=loss_recovery"
        style="display:inline-block;padding:12px 20px;background:#00ff83;color:#111;font-weight:bold;text-decoration:none;border-radius:8px;">
        👉 Try the AI Simulation (Free)
      </a>
    </div>

    <p style="color:#a9acb2;font-style:italic;font-size:14px;margin-top:-10px">
      If you’ve lost trades before — you’re not failing. You’re learning. Let’s speed that up.
    </p>

    <p style="font-size:12px;color:#888;margin-top:40px;text-align:center">
      You received this email from MZPrimer LTD. <a href="https://mzprimer.com/unsubscribe" style="color:#888">Unsubscribe</a>
    </p>
  </div>
`;

async function sendTestEmail() {
  const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"MZPrimer LTD" <${EMAIL}>`,
      to: testRecipient,
      subject: '🚀 Recover Smartly – Trade Smarter with AI Tools (MZPrimer)',
      html: htmlContent,
    });

    console.log(`✅ Email sent to ${testRecipient}`);
  } catch (err) {
    console.error('❌ Failed to send email:', err);
  }
}

sendTestEmail();