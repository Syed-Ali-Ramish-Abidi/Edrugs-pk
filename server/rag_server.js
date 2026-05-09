/**
 * eDrugs RAG Chatbot Server
 * * Uses ChromaDB Cloud for vector search + Groq for LLM inference.
 * FAQ/Navigation answers come from local JSON (no LLM call needed).
 * Auto-syncs new medicines from Supabase into ChromaDB.
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { CloudClient } = require('chromadb');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// 👉 SIRF YEH HISSA CHANGE KIYA HAI (Wide CORS)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

const PORT = process.env.RAG_PORT || 8000;

// ─── Config ────────────────────────────────────────────────────
const FAQ_FILE = path.join(__dirname, 'edrugs_RAG', 'faq_navigation.json');
const DATA_DIR = path.join(__dirname, 'edrugs_RAG', 'Data', 'medicine_txt_files');

const GROQ_API_KEY = process.env.RAG_GROQ_INF_API || '';
const CHROMA_API_KEY = process.env.CHROMA_API_KEY || '';
const CHROMA_TENANT = process.env.CHROMA_TENANT || '';
const CHROMA_DATABASE = process.env.CHROMA_DATABASE || '';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

// ─── Globals ───────────────────────────────────────────────────
let chromaCollection = null;
let faqData = null;
let lastSyncTime = null;

// ─── ChromaDB Cloud ────────────────────────────────────────────
async function initChroma() {
  if (!CHROMA_API_KEY) { console.log('⚠️  CHROMA_API_KEY not set — vector search disabled'); return; }
  try {
    const client = new CloudClient({ apiKey: CHROMA_API_KEY, tenant: CHROMA_TENANT, database: CHROMA_DATABASE });
    chromaCollection = await client.getOrCreateCollection({ name: 'medicines' });
    const count = await chromaCollection.count();
    console.log(`✅ ChromaDB Cloud connected (${count} documents)`);
  } catch (err) {
    console.error('❌ ChromaDB connection failed:', err.message);
  }
}

// ─── FAQ / Navigation ──────────────────────────────────────────
function loadFAQ() {
  try {
    if (fs.existsSync(FAQ_FILE)) {
      faqData = JSON.parse(fs.readFileSync(FAQ_FILE, 'utf-8'));
      console.log('✅ FAQ loaded');
    } else { faqData = { faq: [], navigation: {}, delivery: {}, platform_info: {} }; }
  } catch (e) { faqData = { faq: [], navigation: {}, delivery: {}, platform_info: {} }; }
}

function searchFAQ(query) {
  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/);
  if (!faqData?.faq) return null;
  let best = null, bestScore = 0;
  for (const item of faqData.faq) {
    let score = 0;
    for (const kw of (item.keywords || [])) { if (q.includes(kw.toLowerCase())) score += 3; }
    const qw = new Set(item.question.toLowerCase().split(/\s+/));
    for (const w of words) { if (qw.has(w)) score += 1; }
    if (score > bestScore && score >= 3) { bestScore = score; best = item; }
  }
  return best ? { answer: best.answer, type: 'faq' } : null;
}

function getNavigationInfo(query) {
  const q = query.toLowerCase().trim();
  if (!faqData) return null;
  const nav = faqData.navigation || {};
  const delivery = faqData.delivery || {};
  const platform = faqData.platform_info || {};

  if (['what is edrugs', 'about edrugs', 'about this', 'about platform'].some(p => q.includes(p))) {
    let r = `**${platform.name || 'eDrugs.pk'}** — ${platform.tagline || ''}\n\n${platform.description || ''}\n\n`;
    if (platform.features) { r += '**Key Features:**\n'; platform.features.forEach(f => r += `• ${f}\n`); }
    return { answer: r, type: 'platform' };
  }
  if (['how to', 'how do i', 'steps to', 'guide'].some(p => q.includes(p))) {
    for (const task of (nav.common_tasks || [])) {
      if (task.task.toLowerCase().split(/\s+/).some(w => q.includes(w))) {
        let r = `**How to ${task.task}:**\n\n`;
        task.steps.forEach((s, i) => r += `${i + 1}. ${s}\n`);
        return { answer: r, type: 'navigation' };
      }
    }
  }
  if (['page', 'navigate', 'section', 'where', 'find', 'menu', 'go to', 'pages available', 'what pages'].some(p => q.includes(p))) {
    const sections = nav.main_sections || [];
    if (sections.length) {
      let r = '**Available pages on eDrugs.pk:**\n\n';
      sections.forEach(s => { r += `📍 **${s.name}** (\`${s.path}\`) — ${s.description}\n   _${s.how_to_access}_\n\n`; });
      return { answer: r, type: 'navigation' };
    }
  }
  if (['category', 'categories', 'types', 'browse'].some(p => q.includes(p))) {
    const cats = nav.categories || [];
    if (cats.length) { let r = '**Categories:**\n\n'; cats.forEach(c => r += `• ${c}\n`); r += '\nVisit **/medicines** to browse.'; return { answer: r, type: 'navigation' }; }
  }
  if (['delivery', 'shipping', 'ship', 'deliver', 'cost', 'arrive'].some(p => q.includes(p))) {
    let r = `**Delivery Information:**\n\n${delivery.information || ''}\n\n`;
    (delivery.shipping_methods || []).forEach(m => { r += `🚚 **${m.type}**: ${m.time} — ${m.cost}\n`; });
    r += `\n⏰ **Hours:** ${delivery.delivery_hours || 'N/A'}`;
    if (delivery.note) r += `\n\n📦 ${delivery.note}`;
    return { answer: r, type: 'delivery' };
  }
  return null;
}

// ─── ChromaDB Vector Search ────────────────────────────────────
async function searchChroma(query, nResults = 5) {
  if (!chromaCollection) return [];
  try {
    const results = await chromaCollection.query({ queryTexts: [query], nResults });
    if (!results?.documents?.[0]?.length) return [];
    return results.documents[0].map((doc, i) => ({
      content: doc,
      name: results.metadatas?.[0]?.[i]?.name || 'Unknown',
      distance: results.distances?.[0]?.[i] || 0
    }));
  } catch (err) {
    console.error('ChromaDB query error:', err.message);
    return [];
  }
}

// ─── Groq LLM ──────────────────────────────────────────────────
async function generateWithGroq(query, context) {
  if (!GROQ_API_KEY) return '';
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are a helpful medicine assistant for eDrugs.pk, a Pakistani online pharmacy. Provide accurate, concise answers. Use bullet points when listing items. Keep responses under 200 words. Please provide response in Urdu if applicable.' },
          { role: 'user', content: `Based on this medicine data, answer the question.\n\nData:\n${context}\n\nQuestion: ${query}\n\nAnswer:` }
        ],
        temperature: 0.3, max_tokens: 400
      }),
      signal: AbortSignal.timeout(15000)
    });
    if (res.ok) {
      const data = await res.json();
      return data.choices?.[0]?.message?.content?.trim() || '';
    }
    console.warn('Groq status:', res.status);
  } catch (e) { console.warn('Groq failed:', e.message); }
  return '';
}

// ─── Supabase Sync → ChromaDB ──────────────────────────────────
function cleanFilename(n) { return n.replace(/[^\w\- ]/g, '_'); }
function formatMedText(med) {
  const s = v => (v && String(v).trim() && !['NaN', 'null', 'undefined'].includes(String(v).trim())) ? String(v).trim() : 'N/A';
  return `${s(med.name || med.drug_name)}\nComposition: ${s(med.strength)}\nManufacturer: ${s(med.manufacturer)}\nForm: ${s(med.form)}\nUse: ${s(med.indication)}\nDescription: ${s(med.description)}\nSide Effects: ${s(med.side_effects)}\nAvailability: ${s(med.available_in)}\nAge Restriction: ${s(med.age_restriction)}\nPrescription Required: ${s(med.prescription_required)}\nPrice: ${s(med.price)}`;
}

async function syncFromSupabase() {
  if (!SUPABASE_URL || !SUPABASE_KEY || !chromaCollection) return 0;
  try {
    console.log('🔄 Syncing from Supabase...');
    const res = await fetch(`${SUPABASE_URL}/rest/v1/medicines?select=*`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
      signal: AbortSignal.timeout(15000)
    });
    if (!res.ok) return 0;
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) return 0;

    const ids = [], docs = [], metas = [];
    for (const med of data) {
      const name = med.name || med.drug_name;
      if (!name) continue;
      ids.push(`supabase_${cleanFilename(name).replace(/\s+/g, '_').toLowerCase()}`);
      docs.push(formatMedText(med));
      metas.push({ name, source: 'supabase' });
    }

    // Batch upsert
    for (let i = 0; i < ids.length; i += 40) {
      await chromaCollection.upsert({
        ids: ids.slice(i, i + 40),
        documents: docs.slice(i, i + 40),
        metadatas: metas.slice(i, i + 40)
      });
    }
    lastSyncTime = new Date().toISOString();
    console.log(`✅ Synced ${ids.length} medicines from Supabase into ChromaDB`);
    return ids.length;
  } catch (e) { console.error('Sync error:', e.message); return 0; }
}

// ─── API Endpoints ─────────────────────────────────────────────
app.get('/health', async (req, res) => {
  const count = chromaCollection ? await chromaCollection.count().catch(() => 0) : 0;
  res.json({ status: 'ok', chroma_connected: !!chromaCollection, document_count: count, groq_configured: !!GROQ_API_KEY, last_sync: lastSyncTime });
});

app.post('/chat', async (req, res) => {
  const { query } = req.body;
  if (!query?.trim()) return res.status(400).json({ error: 'Query cannot be empty' });
  const q = query.trim();
  console.log(`📩 "${q}"`);
  try {
    // 1. Medicine search via ChromaDB (if query looks like a medicine name)
    const chromaResults = await searchChroma(q);
    const hasMedicineHit = chromaResults.length > 0 && chromaResults[0].distance < 1.2;

    if (hasMedicineHit) {
      const context = chromaResults.slice(0, 3).map(r => r.content).join('\n\n---\n\n');
      const sources = chromaResults.slice(0, 3).map(r => `- ${r.name}`);
      let answer = await generateWithGroq(q, context);
      if (!answer) { answer = "Here's what I found:\n\n"; chromaResults.slice(0, 3).forEach(r => { answer += r.content + '\n\n'; }); }
      console.log('  → Medicine (ChromaDB + Groq)');
      return res.json({ answer: answer.trim(), query_type: 'medicine', source_documents: sources });
    }

    // 2. Navigation / delivery / platform
    const navResult = getNavigationInfo(q);
    if (navResult) { console.log(`  → ${navResult.type}`); return res.json({ answer: navResult.answer, query_type: navResult.type, source_documents: [] }); }

    // 3. FAQ
    const faqResult = searchFAQ(q);
    if (faqResult) { console.log('  → FAQ'); return res.json({ answer: faqResult.answer, query_type: faqResult.type, source_documents: [] }); }

    // 4. Weak ChromaDB results
    if (chromaResults.length > 0) {
      const context = chromaResults.slice(0, 3).map(r => r.content).join('\n\n---\n\n');
      const sources = chromaResults.slice(0, 3).map(r => `- ${r.name}`);
      let answer = await generateWithGroq(q, context);
      if (!answer) { answer = "Here's what I found:\n\n"; chromaResults.slice(0, 3).forEach(r => { answer += r.content + '\n\n'; }); }
      console.log('  → Weak medicine match');
      return res.json({ answer: answer.trim(), query_type: 'medicine', source_documents: sources });
    }

    // 5. General Groq
    if (GROQ_API_KEY) {
      const a = await generateWithGroq(q, 'No specific medicine data found. User is on eDrugs.pk, a Pakistani online pharmacy.');
      if (a) return res.json({ answer: a, query_type: 'general', source_documents: [] });
    }

    // 6. Fallback
    return res.json({ answer: "I couldn't find that. Try:\n• A medicine name (e.g., 'Paracetamol')\n• Navigation (e.g., 'How do I checkout?')\n• Delivery (e.g., 'Delivery time?')\n\nBrowse all at **/medicines**.", query_type: 'general', source_documents: [] });

  } catch (err) { console.error('Chat error:', err); res.status(500).json({ error: err.message }); }
});

app.post('/update-medicines', async (req, res) => {
  try { const c = await syncFromSupabase(); res.json({ status: 'success', synced: c }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/webhook/new-medicine', async (req, res) => {
  try {
    const { record } = req.body;
    if (!record) return res.json({ status: 'no record' });
    const name = record.name || record.drug_name;
    if (!name || !chromaCollection) return res.json({ status: 'skipped' });
    const id = `supabase_${cleanFilename(name).replace(/\s+/g, '_').toLowerCase()}`;
    await chromaCollection.upsert({ ids: [id], documents: [formatMedText(record)], metadatas: [{ name, source: 'webhook' }] });
    console.log(`✅ Webhook: upserted "${name}"`);
    res.json({ status: 'success', message: `Medicine '${name}' added to ChromaDB` });
  } catch (e) { console.error('Webhook error:', e); res.status(500).json({ error: e.message }); }
});

// ─── Start ─────────────────────────────────────────────────────
async function start() {
  console.log('\n🚀 eDrugs RAG Server starting...');
  console.log(`   Groq:   ${GROQ_API_KEY ? '✅' : '❌'}`);
  console.log(`   Chroma: ${CHROMA_API_KEY ? '✅' : '❌'}`);
  console.log(`   Supa:   ${SUPABASE_URL ? '✅' : '❌'}`);

  loadFAQ();
  await initChroma();
  if (SUPABASE_URL && SUPABASE_KEY) await syncFromSupabase();

  app.listen(PORT, () => {
    console.log(`\n✅ RAG Server on http://localhost:${PORT}\n`);
  });

  // Periodic sync every 5 min
  if (SUPABASE_URL && SUPABASE_KEY && chromaCollection) {
    setInterval(() => syncFromSupabase(), 5 * 60 * 1000);
  }
}

start().catch(e => { console.error('❌', e); process.exit(1); });