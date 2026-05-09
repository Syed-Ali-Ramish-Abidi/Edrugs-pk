/**
 * Vercel Serverless RAG API
 * Handles /api/rag/* routes in production
 */

import { CloudClient } from 'chromadb';

// Config from Vercel environment variables
const GROQ_API_KEY = process.env.RAG_GROQ_INF_API || '';
const CHROMA_API_KEY = process.env.CHROMA_API_KEY || '';
const CHROMA_TENANT = process.env.CHROMA_TENANT || '';
const CHROMA_DATABASE = process.env.CHROMA_DATABASE || '';

// FAQ data (embedded for serverless — no filesystem access)
const FAQ_NAV_URL = 'https://raw.githubusercontent.com/Syed-Ali-Ramish-Abidi/Edrugs-pk/main/server/edrugs_RAG/faq_navigation.json';

let cachedFAQ = null;
let chromaCollection = null;

async function getChroma() {
  if (chromaCollection) return chromaCollection;
  if (!CHROMA_API_KEY) return null;
  const client = new CloudClient({ apiKey: CHROMA_API_KEY, tenant: CHROMA_TENANT, database: CHROMA_DATABASE });
  chromaCollection = await client.getOrCreateCollection({ name: 'medicines' });
  return chromaCollection;
}

async function getFAQ() {
  if (cachedFAQ) return cachedFAQ;
  try {
    // Try fetching from GitHub or use inline fallback
    const res = await fetch(FAQ_NAV_URL, { signal: AbortSignal.timeout(5000) });
    if (res.ok) { cachedFAQ = await res.json(); return cachedFAQ; }
  } catch (e) { /* fall through */ }
  cachedFAQ = { faq: [], navigation: {}, delivery: {}, platform_info: {} };
  return cachedFAQ;
}

function searchFAQ(q, faqData) {
  const words = q.toLowerCase().split(/\s+/);
  let best = null, bestScore = 0;
  for (const item of (faqData.faq || [])) {
    let score = 0;
    for (const kw of (item.keywords || [])) { if (q.toLowerCase().includes(kw.toLowerCase())) score += 3; }
    const qw = new Set(item.question.toLowerCase().split(/\s+/));
    for (const w of words) { if (qw.has(w)) score += 1; }
    if (score > bestScore && score >= 3) { bestScore = score; best = item; }
  }
  return best ? { answer: best.answer, type: 'faq' } : null;
}

function getNavInfo(q, faqData) {
  const nav = faqData.navigation || {};
  const delivery = faqData.delivery || {};
  const platform = faqData.platform_info || {};

  if (['what is edrugs', 'about edrugs', 'about this'].some(p => q.includes(p))) {
    let r = `**${platform.name || 'eDrugs.pk'}** — ${platform.tagline || ''}\n\n${platform.description || ''}\n\n`;
    if (platform.features) { r += '**Key Features:**\n'; platform.features.forEach(f => r += `• ${f}\n`); }
    return { answer: r, type: 'platform' };
  }
  if (['how to', 'how do i', 'steps to'].some(p => q.includes(p))) {
    for (const task of (nav.common_tasks || [])) {
      if (task.task.toLowerCase().split(/\s+/).some(w => q.includes(w))) {
        let r = `**How to ${task.task}:**\n\n`;
        task.steps.forEach((s, i) => r += `${i + 1}. ${s}\n`);
        return { answer: r, type: 'navigation' };
      }
    }
  }
  if (['page', 'navigate', 'where', 'find', 'pages'].some(p => q.includes(p))) {
    const sections = nav.main_sections || [];
    if (sections.length) {
      let r = '**Pages on eDrugs.pk:**\n\n';
      sections.forEach(s => { r += `📍 **${s.name}** (\`${s.path}\`) — ${s.description}\n\n`; });
      return { answer: r, type: 'navigation' };
    }
  }
  if (['category', 'categories', 'browse'].some(p => q.includes(p))) {
    const cats = nav.categories || [];
    if (cats.length) { let r = '**Categories:**\n'; cats.forEach(c => r += `• ${c}\n`); return { answer: r, type: 'navigation' }; }
  }
  if (['delivery', 'shipping', 'deliver'].some(p => q.includes(p))) {
    let r = `**Delivery:**\n\n${delivery.information || ''}\n\n`;
    (delivery.shipping_methods || []).forEach(m => { r += `🚚 **${m.type}**: ${m.time} — ${m.cost}\n`; });
    return { answer: r, type: 'delivery' };
  }
  return null;
}

async function generateWithGroq(query, context) {
  if (!GROQ_API_KEY) return '';
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are a medicine assistant for eDrugs.pk. Provide concise, accurate answers under 200 words.' },
          { role: 'user', content: `Data:\n${context}\n\nQuestion: ${query}\n\nAnswer:` }
        ],
        temperature: 0.3, max_tokens: 400
      })
    });
    if (res.ok) { const d = await res.json(); return d.choices?.[0]?.message?.content?.trim() || ''; }
  } catch (e) { /* ignore */ }
  return '';
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Parse route: /api/rag?path=health or /api/rag?path=chat
  const routePath = req.query.path || req.url.replace('/api/rag', '').replace(/^\//, '') || '';

  // Health
  if (routePath === 'health' || routePath === '/health') {
    try {
      const col = await getChroma();
      const count = col ? await col.count() : 0;
      return res.json({ status: 'ok', chroma_connected: !!col, document_count: count, groq_configured: !!GROQ_API_KEY });
    } catch (e) { return res.json({ status: 'ok', chroma_connected: false, document_count: 0 }); }
  }

  // Chat
  if ((routePath === 'chat' || routePath === '/chat') && req.method === 'POST') {
    const query = req.body?.query?.trim();
    if (!query) return res.status(400).json({ error: 'Query cannot be empty' });
    const q = query.toLowerCase();

    try {
      // ChromaDB search
      const col = await getChroma();
      let chromaResults = [];
      if (col) {
        try {
          const r = await col.query({ queryTexts: [query], nResults: 5 });
          if (r?.documents?.[0]) {
            chromaResults = r.documents[0].map((doc, i) => ({
              content: doc, name: r.metadatas?.[0]?.[i]?.name || 'Unknown', distance: r.distances?.[0]?.[i] || 0
            }));
          }
        } catch (e) { /* ignore */ }
      }

      const hasMedHit = chromaResults.length > 0 && chromaResults[0].distance < 1.2;
      if (hasMedHit) {
        const ctx = chromaResults.slice(0, 3).map(r => r.content).join('\n---\n');
        const src = chromaResults.slice(0, 3).map(r => `- ${r.name}`);
        let answer = await generateWithGroq(query, ctx);
        if (!answer) { answer = chromaResults.slice(0, 3).map(r => r.content).join('\n\n'); }
        return res.json({ answer, query_type: 'medicine', source_documents: src });
      }

      // Nav / FAQ
      const faq = await getFAQ();
      const navR = getNavInfo(q, faq);
      if (navR) return res.json({ answer: navR.answer, query_type: navR.type, source_documents: [] });
      const faqR = searchFAQ(q, faq);
      if (faqR) return res.json({ answer: faqR.answer, query_type: faqR.type, source_documents: [] });

      // Weak chroma
      if (chromaResults.length > 0) {
        const ctx = chromaResults.slice(0, 3).map(r => r.content).join('\n---\n');
        let answer = await generateWithGroq(query, ctx);
        if (!answer) { answer = chromaResults.slice(0, 3).map(r => r.content).join('\n\n'); }
        return res.json({ answer, query_type: 'medicine', source_documents: chromaResults.slice(0, 3).map(r => `- ${r.name}`) });
      }

      // General
      if (GROQ_API_KEY) {
        const a = await generateWithGroq(query, 'User is on eDrugs.pk. No specific data found.');
        if (a) return res.json({ answer: a, query_type: 'general', source_documents: [] });
      }

      return res.json({ answer: "Try searching for a medicine name, or ask about navigation/delivery.", query_type: 'general', source_documents: [] });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  return res.status(404).json({ error: 'Not found' });
}
