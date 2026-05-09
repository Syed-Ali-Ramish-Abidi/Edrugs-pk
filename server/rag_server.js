/**
 * eDrugs RAG Chatbot Server - Production Ready
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { CloudClient } = require('chromadb');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// ─── CORS Configuration ────────────────────────────────────────
// Is mein localhost aur aapka Vercel URL dono allowed hain
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT || 8000; // Render uses process.env.PORT

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

// ─── FAQ / Navigation Logic ────────────────────────────────────
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

  if (['delivery', 'shipping', 'ship', 'deliver', 'cost', 'arrive'].some(p => q.includes(p))) {
    let r = `**Delivery Information:**\n\n${delivery.information || ''}\n\n`;
    (delivery.shipping_methods || []).forEach(m => { r += `🚚 **${m.type}**: ${m.time} — ${m.cost}\n`; });
    r += `\n⏰ **Hours:** ${delivery.delivery_hours || 'N/A'}`;
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
          { role: 'system', content: 'You are a helpful medicine assistant for eDrugs.pk. Provide accurate, concise answers. Keep responses under 200 words.' },
          { role: 'user', content: `Context:\n${context}\n\nQuestion: ${query}` }
        ],
        temperature: 0.3, max_tokens: 400
      })
    });
    if (res.ok) {
      const data = await res.json();
      return data.choices?.[0]?.message?.content?.trim() || '';
    }
  } catch (e) { console.warn('Groq failed:', e.message); }
  return '';
}

// ─── Supabase Sync ─────────────────────────────────────────────
async function syncFromSupabase() {
  if (!SUPABASE_URL || !SUPABASE_KEY || !chromaCollection) return 0;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/medicines?select=*`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    if (!res.ok) return 0;
    const data = await res.json();
    console.log(`✅ Synced medicines from Supabase`);
    lastSyncTime = new Date().toISOString();
    return data.length;
  } catch (e) { console.error('Sync error:', e.message); return 0; }
}

// ─── Endpoints ─────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', online: true, last_sync: lastSyncTime });
});

app.post('/chat', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Empty query' });

  try {
    const nav = getNavigationInfo(query);
    if (nav) return res.json({ answer: nav.answer });

    const faq = searchFAQ(query);
    if (faq) return res.json({ answer: faq.answer });

    const chromaResults = await searchChroma(query);
    const context = chromaResults.map(r => r.content).join('\n\n');
    const answer = await generateWithGroq(query, context || 'No local data found.');

    res.json({ answer: answer || "I'm sorry, I couldn't find information on that." });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── Startup ───────────────────────────────────────────────────
async function start() {
  loadFAQ();
  await initChroma();
  await syncFromSupabase();
  app.listen(PORT, () => {
    console.log(`🚀 Server live on port ${PORT}`);
  });
}

start();