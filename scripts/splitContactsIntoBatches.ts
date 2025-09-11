// scripts/splitContactsIntoBatches.ts
import fs from 'fs';
import path from 'path';

const cleanedFilePath = path.join(process.cwd(), 'data', 'cleaned_contacts.json');
const outputDir = path.join(process.cwd(), 'data', 'batches');
const BATCH_SIZE = 200;

async function splitContacts() {
  // Read cleaned contacts
  const data = fs.readFileSync(cleanedFilePath, 'utf-8');
  const contacts = JSON.parse(data);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Split into batches
  const totalBatches = Math.ceil(contacts.length / BATCH_SIZE);

  for (let i = 0; i < totalBatches; i++) {
    const start = i * BATCH_SIZE;
    const end = start + BATCH_SIZE;
    const batch = contacts.slice(start, end);

    const batchPath = path.join(outputDir, `batch-${i + 1}.json`);
    fs.writeFileSync(batchPath, JSON.stringify(batch, null, 2), 'utf-8');
    console.log(`Batch ${i + 1} saved: ${batchPath}`);
  }

  console.log(`✅ Done. Total batches: ${totalBatches}`);
}

splitContacts();