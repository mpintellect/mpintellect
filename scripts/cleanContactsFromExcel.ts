import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import XLSX from 'xlsx';

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// File paths
const inputFile = path.resolve(__dirname, '../data/contacts.xlsx');
const outputFile = path.resolve(__dirname, '../data/cleaned_contacts.json');

// Helpers
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase()) &&
  email.length <= 100;

const normalizeEmail = (raw: string) =>
  raw.trim().split(' ')[0].replace(/[^a-zA-Z0-9@._-]/g, '');

const workbook = XLSX.readFile(inputFile);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

const seenEmails = new Set<string>();
const cleaned: { Name: string; Email: string; Phone: string }[] = [];

for (const row of rawRows) {
  const name = row.NAME || row.Name || '';
  const emailRaw = row.EMAIL || row.Email || '';
  const phoneRaw = row.PHONE || row.Phone || '';

  const email = normalizeEmail(emailRaw);
  const phone = phoneRaw.toString().replace(/\D/g, '');

  if (!name || !email || !phone) continue;
  if (!isValidEmail(email)) continue;
  if (seenEmails.has(email)) continue;

  seenEmails.add(email);
  cleaned.push({ Name: name.trim(), Email: email.toLowerCase(), Phone: phone });
}

// Sort by phone
cleaned.sort((a, b) => Number(a.Phone) - Number(b.Phone));

// Output
fs.writeFileSync(outputFile, JSON.stringify(cleaned, null, 2));
console.log(`✅ Cleaned ${cleaned.length} contacts saved to ${outputFile}`);