/**
 * Ingest medicines into ChromaDB Cloud
 * 
 * Reads medicine text files from edrugs_RAG/Data/medicine_txt_files/
 * and upserts them into ChromaDB Cloud collection.
 * Also syncs from Supabase if configured.
 * 
 * Usage: node ingest_chroma.js
 */

const { CloudClient } = require('chromadb');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const DATA_DIR = path.join(__dirname, 'edrugs_RAG', 'Data', 'medicine_txt_files');

const CHROMA_API_KEY = process.env.CHROMA_API_KEY || '';
const CHROMA_TENANT = process.env.CHROMA_TENANT || '';
const CHROMA_DATABASE = process.env.CHROMA_DATABASE || '';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

function cleanFilename(name) {
  return name.replace(/[^\w\- ]/g, '_');
}

function formatMedicineText(med) {
  const safe = (v) => (v && String(v).trim() && !['NaN', 'null', 'undefined'].includes(String(v).trim())) ? String(v).trim() : 'N/A';
  const name = safe(med.name || med.drug_name);
  return `${name}\nComposition: ${safe(med.strength)}\nManufacturer: ${safe(med.manufacturer)}\nForm: ${safe(med.form)}\nUse: ${safe(med.indication)}\nDescription: ${safe(med.description)}\nSide Effects: ${safe(med.side_effects)}\nAvailability: ${safe(med.available_in)}\nAge Restriction: ${safe(med.age_restriction)}\nPrescription Required: ${safe(med.prescription_required)}\nPrice: ${safe(med.price)}`;
}

async function syncSupabaseToFiles() {
  if (!SUPABASE_URL || !SUPABASE_KEY) return 0;
  console.log('🔄 Syncing from Supabase...');
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/medicines?select=*`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    if (!res.ok) { console.warn('Supabase fetch failed:', res.status); return 0; }
    const data = await res.json();
    if (!Array.isArray(data)) return 0;
    fs.mkdirSync(DATA_DIR, { recursive: true });
    let count = 0;
    for (const med of data) {
      const name = med.name || med.drug_name;
      if (!name) continue;
      fs.writeFileSync(path.join(DATA_DIR, `${cleanFilename(name)}.txt`), formatMedicineText(med), 'utf-8');
      count++;
    }
    console.log(`✅ Synced ${count} from Supabase`);
    return count;
  } catch (e) { console.error('Supabase sync error:', e.message); return 0; }
}

async function ingest() {
  console.log('\n🚀 ChromaDB Cloud Ingestion\n');

  if (!CHROMA_API_KEY || !CHROMA_TENANT || !CHROMA_DATABASE) {
    console.error('❌ Missing CHROMA_API_KEY, CHROMA_TENANT, or CHROMA_DATABASE in .env');
    process.exit(1);
  }

  // 1. Sync from Supabase first
  await syncSupabaseToFiles();

  // 2. Read all medicine text files
  if (!fs.existsSync(DATA_DIR)) {
    console.error('❌ No medicine data directory:', DATA_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.txt'));
  console.log(`📁 Found ${files.length} medicine files`);

  // 3. Connect to ChromaDB Cloud
  const client = new CloudClient({
    apiKey: CHROMA_API_KEY,
    tenant: CHROMA_TENANT,
    database: CHROMA_DATABASE
  });

  // Delete and recreate collection for clean state
  try { await client.deleteCollection('medicines'); } catch (e) { /* ok if not exists */ }
  const collection = await client.getOrCreateCollection({ name: 'medicines' });
  console.log('✅ ChromaDB collection ready');

  // 4. Batch upsert (max 40 per batch for ChromaDB Cloud)
  const BATCH_SIZE = 40;
  let total = 0;

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const ids = [];
    const documents = [];
    const metadatas = [];

    for (const file of batch) {
      const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8').trim();
      const name = path.basename(file, '.txt');
      ids.push(name.replace(/\s+/g, '_').toLowerCase());
      documents.push(content);
      metadatas.push({ name, source: file });
    }

    await collection.add({ ids, documents, metadatas });
    total += batch.length;
    console.log(`  📥 Ingested ${total}/${files.length}`);
  }

  const count = await collection.count();
  console.log(`\n✅ Done! ${count} documents in ChromaDB Cloud\n`);
}

ingest().catch(err => { console.error('❌ Ingestion failed:', err); process.exit(1); });
