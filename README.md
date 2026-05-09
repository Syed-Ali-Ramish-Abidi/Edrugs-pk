# eDrugs.pk — Online Medicine Platform

An e-commerce platform for purchasing medicines online in Pakistan, featuring an AI-powered RAG chatbot assistant.

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Frontend (React/Vite)                  │
│  client/src/                                             │
│  ├── Pages: Home, Medicines, Cart, Checkout, Dashboard   │
│  ├── ChatbotWidget.jsx → RAG chatbot UI                  │
│  └── Supabase client for auth & data                     │
└──────────────────┬───────────────────────────────────────┘
                   │  /api/rag/*
                   ▼
┌──────────────────────────────────────────────────────────┐
│              RAG Server (Node.js/Express)                 │
│  server/rag_server.js                                    │
│  ├── ChromaDB Cloud → vector search (medicine queries)   │
│  ├── Groq API → LLM answer generation                   │
│  ├── FAQ/Navigation JSON → instant answers               │
│  └── Supabase sync → auto-updates ChromaDB               │
└──────────────────┬──────────────┬────────────────────────┘
                   │              │
         ┌─────────▼──┐   ┌──────▼───────┐
         │ ChromaDB   │   │  Supabase    │
         │ Cloud      │   │  (Postgres)  │
         │ (vectors)  │   │  auth + data │
         └────────────┘   └──────────────┘
```

---

## Project Structure

```
Edrugs-pk/
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatbotWidget.jsx    # AI chatbot UI
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── MedicinesPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── ...
│   │   ├── context/              # Auth & cart context
│   │   ├── lib/supabase.js       # Supabase client
│   │   └── App.jsx               # Routes
│   ├── api/rag.js                # Vercel serverless function
│   ├── vercel.json               # Vercel config
│   └── .env.local                # Client environment vars
│
├── server/                    # Backend (Node.js)
│   ├── rag_server.js             # RAG chatbot server
│   ├── ingest_chroma.js          # Ingest medicines into ChromaDB
│   ├── edrugs_RAG/
│   │   ├── faq_navigation.json   # FAQ, navigation, delivery data
│   │   └── Data/                 # Medicine text files (synced from Supabase)
│   ├── package.json
│   └── .env                      # Server environment vars
│
├── package.json               # Root (runs both servers via concurrently)
└── README.md                  # This file
```

---

## Frontend

**Stack:** React 19, Vite, Tailwind CSS, Framer Motion, Lucide Icons

### Pages
| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with featured medicines and categories |
| `/medicines` | Catalog | Browse/search all medicines, filter by category |
| `/medicines/:id` | Detail | Medicine info, add to cart |
| `/cart` | Cart | View items, adjust quantities |
| `/checkout` | Checkout | Delivery address, payment, place order |
| `/dashboard` | Dashboard | Order history and tracking |
| `/profile` | Profile | Edit personal details |
| `/login` | Login | Sign in with email/password |
| `/signup` | Sign Up | Create account |
| `/admin` | Admin | Manage products and orders (admin only) |

### Key Components
- **ChatbotWidget** — Floating AI chatbot that connects to the RAG server. Shows connection status, suggestion chips, typing indicator, and query-type badges.
- **Navbar** — Category navigation, search bar, cart icon, user menu
- **ProductCard** — Medicine card with image, price, add-to-cart

---

## Backend — RAG Server

**Stack:** Node.js, Express, ChromaDB Cloud, Groq API

The RAG server (`server/rag_server.js`) runs on port 8000 during development and handles all chatbot queries.

### How It Works

1. **User sends a query** via the ChatbotWidget
2. **ChromaDB Cloud** performs semantic vector search across all indexed medicines
3. If a strong medicine match is found:
   - Context from top 3 results is passed to **Groq (LLaMA 3.1)** for natural language answer generation
4. If no medicine match:
   - Checks **navigation/delivery/platform info** from `faq_navigation.json`
   - Checks **FAQ** database for keyword matches
5. If nothing matches:
   - Falls back to Groq with general knowledge

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check — returns ChromaDB status and doc count |
| `POST` | `/chat` | Main chat endpoint — accepts `{ query: string }` |
| `POST` | `/update-medicines` | Trigger Supabase → ChromaDB sync |
| `POST` | `/webhook/new-medicine` | Webhook for Supabase inserts (auto-updates ChromaDB) |

### Auto-Sync

- On server startup, medicines are fetched from Supabase and upserted into ChromaDB Cloud
- Every 5 minutes, a periodic sync runs automatically
- The `/webhook/new-medicine` endpoint can be configured in Supabase Database Webhooks for real-time updates

---

## Supabase

**Used for:** Authentication, database (medicines, orders, users), real-time subscriptions

### Tables
- **medicines** — Drug catalog (name, manufacturer, price, indication, side effects, etc.)
- **orders** — User orders with status tracking
- **profiles** — User profile data

### Auth
- Email/password authentication via Supabase Auth
- Row Level Security (RLS) for data protection
- Admin role management for the admin dashboard

### Integration Points
1. **Frontend** — Supabase JS client for auth, fetching medicines, placing orders
2. **RAG Server** — REST API to fetch medicines for vector database sync
3. **Webhooks** — Supabase can call `/webhook/new-medicine` when new medicines are inserted

---

## RAG Pipeline

```
Medicine Data (Supabase DB)
        │
        ▼
  Sync to ChromaDB Cloud     ←── Runs on startup + every 5 min
  (vector embeddings)              + on webhook trigger
        │
        ▼
  User Query ──→ Vector Search (ChromaDB)
        │              │
        │         Top 3 results
        │              │
        ▼              ▼
   FAQ/Nav check    Groq LLM (LLaMA 3.1)
        │              │
        ▼              ▼
   Instant answer   Generated answer
```

### Components

| Component | Service | Purpose |
|-----------|---------|---------|
| Vector Store | ChromaDB Cloud | Stores medicine embeddings, handles semantic search |
| LLM | Groq (LLaMA 3.1 8B Instant) | Generates natural language answers from retrieved context |
| FAQ/Nav | Local JSON | Instant answers for navigation, delivery, platform questions |
| Data Source | Supabase | Source of truth for medicine data |

### When the RAG Pipeline Runs
- **Server startup** — Initial sync from Supabase → ChromaDB
- **Every 5 minutes** — Periodic background sync
- **On webhook** — When Supabase triggers `/webhook/new-medicine`
- **Manual trigger** — `POST /update-medicines`

---

## Environment Variables

### `client/.env.local`
```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
VITE_RAG_SERVER_URL=/api/rag
```

### `server/.env`
```
# Supabase
SUPABASE_URL=<your-supabase-url>
SUPABASE_KEY=<your-supabase-anon-key>

# RAG - Groq LLM
RAG_GROQ_INF_API=<your-groq-api-key>

# RAG - ChromaDB Cloud
CHROMA_API_KEY=<your-chroma-api-key>
CHROMA_TENANT=<your-chroma-tenant-id>
CHROMA_DATABASE=<your-chroma-database-name>
```

### Vercel Environment Variables
When deploying to Vercel, add these in the Vercel dashboard → Settings → Environment Variables:
- `RAG_GROQ_INF_API`
- `CHROMA_API_KEY`
- `CHROMA_TENANT`
- `CHROMA_DATABASE`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_RAG_SERVER_URL` = `/api/rag`

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd Edrugs-pk

# Install root dependencies (concurrently)
npm install

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies
cd server && npm install && cd ..
```

### Ingest Medicine Data

```bash
cd server && node ingest_chroma.js
```

This syncs medicines from Supabase and pushes them into ChromaDB Cloud.

### Run Development

```bash
npm run dev
```

This starts both servers simultaneously:
- **RAG Server** → http://localhost:8000
- **Vite Client** → http://localhost:5173

### Deploy to Vercel

```bash
cd client
vercel deploy
```

Add the environment variables in the Vercel dashboard. The serverless function at `api/rag.js` handles all chatbot requests in production.
