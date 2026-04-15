// functions/api/contact.ts
import { sendEmail } from "../../backend-lib/email";

const HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: HEADERS });
}

export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const { name, email, message, hp } = await request.json();

    // 1. Bot Protection: If honeypot is filled, stop here.
    if (hp) return new Response(JSON.stringify({ ok: true }), { status: 200, headers: HEADERS });

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ ok: false, error: "Required fields missing" }), { status: 400, headers: HEADERS });
    }

    // 2. TARGET EMAIL: This is where YOU receive the client's message
    const MY_INBOX = "contact@mpintellect.com"; 

    // 3. Create text version for email clients that don't support HTML
    const textVersion = `
MPIntellect INTELLIGENCE - CONTACT FORM SUBMISSION
================================================
Client Name: ${name}
Client Email: ${email}
Submission Time: ${new Date().toLocaleString()}

MESSAGE:
------------------------------------------------
${message}
------------------------------------------------

This is an automated notification from your contact form.
    `;

    // 4. SEND TO YOUR INBOX (Institutional Layout)
    await sendEmail({
      to: MY_INBOX,
      subject: `New Client Inquiry: ${name}`,
      html: `
        <div style="background:#000; color:#fff; padding:40px; font-family:sans-serif; border:1px solid #D4AF37;">
          <div style="border-bottom:1px solid #1a1a1a; padding-bottom:20px; margin-bottom:20px;">
            <p style="color:#D4AF37; font-size:10px; font-weight:bold; text-transform:uppercase; letter-spacing:3px;">Intelligence Inbound</p>
            <h1 style="margin:0; font-size:24px;">New Contact Form Submission</h1>
          </div>
          
          <div style="background:#0a0a0a; padding:20px; border:1px solid #111;">
            <p style="margin:10px 0;"><b>Client Name:</b> ${name}</p>
            <p style="margin:10px 0;"><b>Client Email:</b> <a href="mailto:${email}" style="color:#D4AF37;">${email}</a></p>
            <p style="margin:20px 0 10px 0; color:#555; text-transform:uppercase; font-size:10px; font-weight:bold;">Message Protocol:</p>
            <div style="background:#000; padding:15px; border-left:2px solid #D4AF37; color:#ddd; line-height:1.6; white-space:pre-wrap;">
              ${message}
            </div>
          </div>

          <p style="margin-top:30px; font-size:10px; color:#333; text-align:center; text-transform:uppercase; letter-spacing:2px;">
            MPIntellect Internal Routing • Secure Transmission
          </p>
        </div>
      `,
      text: textVersion,
    }, env);

    // 5. SEND AUTO-REPLY TO CLIENT
    const clientTextVersion = `
Dear ${name},

Thank you for reaching out to MPIntellect Intelligence.

We have received your inquiry and our team will review it shortly. 
You can expect a response within 24 hours during business days.

Your message:
"${message}"

For urgent matters, please contact us directly at contact@mpintellect.com.

Best regards,
The MPIntellect Team
    `;

    await sendEmail({
      to: email,
      subject: "We've Received Your Inquiry - MPIntellect Intelligence",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="dark">
          <meta name="supported-color-schemes" content="dark">
        </head>
        <body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background: #000000;">
          
          <div style="background: radial-gradient(125% 125% at 50% 10%, #0a0c0e, #000000); padding: 48px 24px;">
            
            <!-- MAIN CARD -->
            <div style="max-width: 560px; margin: 0 auto; background: #0c0c0c; border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);">
              
              <!-- GOLD ACCENT BAR -->
              <div style="height: 4px; background: linear-gradient(90deg, #d4af37, #f9e076, #b49450); border-radius: 24px 24px 0 0;"></div>
              
              <!-- CONTENT -->
              <div style="padding: 40px 32px;">
                
                <!-- STATUS BADGE -->
                <div style="display: inline-block; background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 100px; padding: 8px 20px; margin-bottom: 24px;">
                  <span style="color: #d4af37; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">
                    ✓ INQUIRY RECEIVED
                  </span>
                </div>
                
                <!-- HEADLINE -->
                <h1 style="margin: 0 0 16px; font-size: 32px; font-weight: 700; color: #ffffff;">
                  Thank You for Contacting Us
                </h1>
                
                <!-- GREETING -->
                <p style="margin: 0 0 8px; font-size: 16px; color: #e5e7eb;">
                  Dear <span style="color: #d4af37; font-weight: 600;">${name}</span>,
                </p>
                
                <!-- MESSAGE -->
                <p style="margin: 0 0 24px; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
                  We have received your inquiry and our team will review it shortly. 
                  You can expect a response within <strong style="color: #d4af37;">24 hours</strong> during business days.
                </p>

                <!-- YOUR MESSAGE CARD -->
                <div style="background: #080808; border-radius: 16px; padding: 24px; border: 1px solid #1e1e1e; margin-bottom: 24px;">
                  <p style="margin: 0 0 12px 0; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                    Your Message:
                  </p>
                  <div style="background: #000000; padding: 16px; border-left: 2px solid #d4af37; color: #ffffff; font-style: italic;">
                    "${message}"
                  </div>
                </div>

                <!-- QUICK LINKS -->
                <div style="margin-bottom: 24px;">
                  <p style="color: #9ca3af; font-size: 14px; margin-bottom: 12px;">While you wait:</p>
                  <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    <a href="https://mpintellect.com/AIChat" style="background: rgba(212, 175, 55, 0.1); color: #d4af37; text-decoration: none; padding: 8px 16px; border-radius: 100px; font-size: 13px; border: 1px solid rgba(212, 175, 55, 0.2);">
                      Explore AI Tools →
                    </a>
                    <a href="https://mpintellect.com/markets" style="background: rgba(212, 175, 55, 0.1); color: #d4af37; text-decoration: none; padding: 8px 16px; border-radius: 100px; font-size: 13px; border: 1px solid rgba(212, 175, 55, 0.2);">
                      Market Analysis →
                    </a>
                  </div>
                </div>
                
                <!-- SECURITY NOTE -->
                <div style="padding: 16px; background: rgba(212, 175, 55, 0.02); border-radius: 12px; border: 1px solid rgba(212, 175, 55, 0.1);">
                  <p style="margin: 0; color: #9ca3af; font-size: 13px; text-align: center;">
                    <span style="color: #d4af37;">🔒</span> This is an automated confirmation. Please do not reply to this email.
                  </p>
                </div>
                
              </div>
              
              <!-- FOOTER -->
              <div style="padding: 24px 32px; background: #050505; border-top: 1px solid #1a1a1a; border-radius: 0 0 24px 24px; text-align: center;">
                <p style="margin: 0; color: #4b5563; font-size: 12px;">
                  © ${new Date().getFullYear()} MPIntellect Intelligence LTD
                </p>
                <p style="margin: 8px 0 0; color: #d4af37; font-size: 8px; text-transform: uppercase; letter-spacing: 2px;">
                  INSTITUTIONAL GRADE • SECURE COMMUNICATION
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: clientTextVersion,
    }, env);

    console.log(`✅ Contact form submission from ${email} processed successfully. Auto-reply sent.`);
    
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: HEADERS });

  } catch (error: any) {
    console.error("💥 Contact API Failure:", error.message);
    return new Response(JSON.stringify({ ok: false, error: "Transmission failed" }), { status: 500, headers: HEADERS });
  }
}