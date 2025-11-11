// Fix __dirname in ESM environments
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Imports
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

// Config
const inputExcelFile = path.join(__dirname, '../data/contacts-emails.xlsx');
const outputDir = path.join(__dirname, '../data/email-batches');
const batchSize = 20;

// Make sure output folder exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Helpers
const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());

const normalizeEmail = (raw: any): string =>
  String(raw || '')
    .trim()
    .split(' ')[0]
    .replace(/[^a-zA-Z0-9@._-]/g, '')
    .toLowerCase();

// Step 1: Read Excel
const workbook = XLSX.readFile(inputExcelFile);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows: any[] = XLSX.utils.sheet_to_json(sheet);

// Step 2: Clean emails
const seen = new Set<string>();
const cleanedEmails: { Email: string }[] = [];

for (const row of rows) {
  const emailRaw = row.EMAIL || row.Email || row.email || '';
  const email = normalizeEmail(emailRaw);

  if (!email || !isValidEmail(email)) continue;
  if (seen.has(email)) continue;

  seen.add(email);
  cleanedEmails.push({ Email: email });
}

// Step 3: Split into batches of 20
const totalBatches = Math.ceil(cleanedEmails.length / batchSize);

for (let i = 0; i < totalBatches; i++) {
  const batch = cleanedEmails.slice(i * batchSize, (i + 1) * batchSize);
  const filename = `EMbatch-${i + 1}.json`;
  const filePath = path.join(outputDir, filename);

  fs.writeFileSync(filePath, JSON.stringify(batch, null, 2), 'utf-8');
  console.log(`✅ Created ${filename} (${batch.length} emails)`);
}

console.log(`📦 Done. Total cleaned: ${cleanedEmails.length}. Batches: ${totalBatches}`);