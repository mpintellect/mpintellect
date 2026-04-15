// lib/send-email.ts
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendLicenseEmail(to: string, key: string, expiresAt: string, plan: string) {
  const html = `
    <h2>Your MPIntellect AI Assistant License</h2>
    <p>Plan: <b>${plan}</b></p>
    <p>License Key: <b>${key}</b></p>
    <p>Expires: ${new Date(expiresAt).toUTCString()}</p>
    <p>Use on up to 3 devices. Keep this key private.</p>
  `;
  await resend.emails.send({ from: 'MPIntellect <noreply@MPIntellect Intelligence.com>', to, subject: 'Your License Key', html });
}