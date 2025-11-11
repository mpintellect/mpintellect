import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import XLSX from 'xlsx';

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Config
const inputFile = path.resolve(__dirname, '../data/contacts.xlsx');
const outputDir = path.resolve(__dirname, '../data/batchesIB');
const batchSize = 200;

// Helper: validate email
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase()) &&
  email.length <= 100;

// Helper: normalize email
const normalizeEmail = (raw: string) =>
  raw.trim().split(' ')[0].replace(/[^a-zA-Z0-9@._-]/g, '').toLowerCase();

// Read Excel
const workbook = XLSX.readFile(inputFile);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

// Clean emails
const seen = new Set<string>();
const cleaned: { Email: string }[] = [];

for (const row of rawRows) {
  const rawEmail = row.EMAIL || row.Email || Object.values(row)[0]; // fallback
  const email = normalizeEmail(rawEmail || '');

  if (!isValidEmail(email)) continue;
  if (seen.has(email)) continue;

  seen.add(email);
  cleaned.push({ Email: email });
}

// Create output directory
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// Split into batches
let batchNum = 1;
for (let i = 0; i < cleaned.length; i += batchSize) {
  const batch = cleaned.slice(i, i + batchSize);
  const filename = path.join(outputDir, `batch-${batchNum}.json`);
  fs.writeFileSync(filename, JSON.stringify(batch, null, 2));
  console.log(`✅ Saved ${batch.length} emails to ${filename}`);
  batchNum++;
}

console.log(`🎉 Done. Total cleaned: ${cleaned.length}`);