import crypto from 'crypto';

const SECRET = process.env.LICENSE_SIGNING_SECRET!;

type LicensePayload = {
  email: string;
  plan: 'basic'|'pro';
  expiresAt: number;           // epoch ms
  maxDevices: number;          // anti-sharing cap
};

export function createLicense(payload: LicensePayload) {
  const json = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(json).digest('base64url');
  return `MZP-${json}.${sig}`;
}

export function verifyLicense(key: string): { ok: boolean; payload?: LicensePayload; error?: string } {
  try {
    if (!key.startsWith('MZP-')) return { ok:false, error:'Bad prefix' };
    const token = key.slice(4);
    const [json, sig] = token.split('.');
    const vsig = crypto.createHmac('sha256', SECRET).update(json).digest('base64url');
    if (sig !== vsig) return { ok:false, error:'Signature mismatch' };
    const payload = JSON.parse(Buffer.from(json, 'base64url').toString()) as LicensePayload;
    if (Date.now() > payload.expiresAt) return { ok:false, error:'Expired' };
    return { ok:true, payload };
  } catch (e:any) {
    return { ok:false, error:'Invalid license' };
  }
}