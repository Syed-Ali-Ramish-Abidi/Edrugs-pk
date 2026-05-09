import React, { useEffect, useRef, useState, useCallback } from 'react'
import { MessageCircle, Send, X, Bot, Sparkles, ArrowRight, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

const RAG_URL = import.meta.env.VITE_RAG_SERVER_URL || 'http://localhost:8000'

// Quick suggestion chips the user can click
const SUGGESTION_CHIPS = [
  { label: '💊 Search medicines', query: 'How do I search for medicines?' },
  { label: '🗺️ Navigate pages', query: 'What pages are available on this website?' },
  { label: '🚚 Delivery info', query: 'What are the delivery options and costs?' },
  { label: '📦 Track order', query: 'How do I track my order?' },
  { label: '🏷️ Categories', query: 'What categories of medicines are available?' },
  { label: '🛒 How to buy', query: 'How do I buy a medicine?' },
]

// Map route to friendly page name for context
const ROUTE_NAMES = {
  '/': 'Home',
  '/medicines': 'Medicines Catalog',
  '/cart': 'Shopping Cart',
  '/checkout': 'Checkout',
  '/dashboard': 'Your Dashboard',
  '/admin': 'Admin Dashboard',
  '/login': 'Login',
  '/signup': 'Sign Up',
  '/profile': 'Your Profile',
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('checking') // 'checking' | 'connected' | 'offline'
  const [messages, setMessages] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(true)
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const location = useLocation()

  // Get current page name
  const currentPage = ROUTE_NAMES[location.pathname] ||
    (location.pathname.startsWith('/medicines/') ? 'Medicine Detail' : 'Page')

  // ─── Health Check ───────────────────────────────────────
  const checkConnection = useCallback(async () => {
    try {
      const res = await fetch(`${RAG_URL}/health`, { signal: AbortSignal.timeout(5000) })
      if (res.ok) {
        setConnectionStatus('connected')
        return true
      }
    } catch {
      // ignore
    }
    setConnectionStatus('offline')
    return false
  }, [])

  useEffect(() => {
    checkConnection()
    const interval = setInterval(checkConnection, 30000) // re-check every 30s
    return () => clearInterval(interval)
  }, [checkConnection])

  // Welcome message when first opened
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          from: 'ai',
          text: `Assalamualaikum! 👋 Welcome to **eDrugs.pk** Assistant.\n\nI can help you with:\n• 💊 Finding medicine information\n• 🗺️ Navigating the website\n• 🚚 Delivery details\n• 📋 FAQs & how-to guides\n\nYou're currently on the **${currentPage}** page. How can I help you?`,
          type: 'welcome',
          time: new Date(),
        },
      ])
    }
  }, [open])

  // Auto-scroll
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, isLoading])

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  // ─── Send Message ───────────────────────────────────────
  async function sendMessage(queryText) {
    const text = (queryText || input).trim()
    if (!text || isLoading) return

    const userMsg = { id: Date.now(), from: 'user', text, time: new Date() }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setShowSuggestions(false)
    setIsLoading(true)

    try {
      const res = await fetch(`${RAG_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
        signal: AbortSignal.timeout(30000),
      })

      if (!res.ok) throw new Error(`Server error ${res.status}`)

      const data = await res.json()
      setConnectionStatus('connected')

      const aiMsg = {
        id: Date.now() + 1,
        from: 'ai',
        text: data.answer,
        type: data.query_type,
        sources: data.source_documents,
        time: new Date(),
      }
      setMessages((m) => [...m, aiMsg])
    } catch (err) {
      console.error('Chat error:', err)

      // Offline fallback: try to give a basic local answer
      let fallbackText = "I'm having trouble connecting to the server right now. "
      if (connectionStatus === 'offline') {
        fallbackText += "The RAG server appears to be offline. Please make sure it's running.\n\n"
      }
      fallbackText += 'In the meantime, here are some helpful links:\n'
      fallbackText += '• **Home**: /\n'
      fallbackText += '• **Browse Medicines**: /medicines\n'
      fallbackText += '• **Your Cart**: /cart\n'
      fallbackText += '• **Login**: /login\n'
      fallbackText += '• **Sign Up**: /signup'

      setMessages((m) => [
        ...m,
        { id: Date.now() + 1, from: 'ai', text: fallbackText, type: 'error', time: new Date() },
      ])
      setConnectionStatus('offline')
    } finally {
      setIsLoading(false)
    }
  }

  function handleSubmit(e) {
    e?.preventDefault()
    sendMessage()
  }

  function handleChipClick(query) {
    sendMessage(query)
  }

  // ─── Simple markdown-ish renderer ───────────────────────
  function renderText(text) {
    if (!text) return null
    // Bold **text**
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
      }
      // Handle newlines
      return part.split('\n').map((line, j) => (
        <React.Fragment key={`${i}-${j}`}>
          {j > 0 && <br />}
          {line}
        </React.Fragment>
      ))
    })
  }

  // ─── Render ─────────────────────────────────────────────
  return (
    <div>
      {/* Floating Action Button */}
      <motion.button
        aria-label={open ? 'Close chat' : 'Open eDrugs Assistant'}
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.1, boxShadow: '0 20px 40px rgba(13, 148, 136, 0.45)' }}
        whileTap={{ scale: 0.93 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center rounded-2xl shadow-xl transition-all duration-200"
        style={{
          background: open
            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
            : 'linear-gradient(135deg, #0d9488, #0f766e)',
        }}
      >
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {open ? <X size={20} color="#fff" /> : <MessageCircle size={20} color="#fff" />}
        </motion.div>

        {/* Pulse ring when closed */}
        {!open && (
          <span className="absolute inset-0 rounded-2xl animate-ping opacity-20 bg-teal-400" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="fixed bottom-[88px] right-6 z-50 w-[92vw] max-w-[400px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
            style={{ height: 'min(580px, 75vh)' }}
          >
            {/* ─── Header ─────────────────────────── */}
            <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
              style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                    eDrugs Assistant
                    <Sparkles size={12} className="text-teal-200" />
                  </div>
                  <div className="text-[11px] text-teal-100 flex items-center gap-1">
                    {connectionStatus === 'connected' ? (
                      <><Wifi size={10} className="text-emerald-300" /> Online — AI powered</>
                    ) : connectionStatus === 'checking' ? (
                      <><RefreshCw size={10} className="animate-spin text-yellow-300" /> Connecting...</>
                    ) : (
                      <><WifiOff size={10} className="text-red-300" /> Offline</>
                    )}
                  </div>
                </div>
              </div>

              <motion.button
                onClick={() => setOpen(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={16} className="text-white" />
              </motion.button>
            </header>

            {/* ─── Messages ───────────────────────── */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
              style={{ background: 'linear-gradient(180deg, #f0fdfa 0%, #f8fafc 100%)' }}
            >
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                      m.from === 'user'
                        ? 'bg-teal-600 text-white rounded-br-md'
                        : m.type === 'error'
                        ? 'bg-amber-50 text-amber-900 border border-amber-200 rounded-bl-md'
                        : 'bg-white text-slate-700 border border-gray-100 rounded-bl-md'
                    }`}
                  >
                    {renderText(m.text)}

                    {/* Source documents */}
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-100 text-[11px] text-slate-400">
                        <span className="font-medium text-slate-500">Sources:</span>
                        {m.sources.map((s, i) => (
                          <div key={i} className="truncate">{s}</div>
                        ))}
                      </div>
                    )}

                    {/* Query type badge */}
                    {m.type && m.from === 'ai' && m.type !== 'welcome' && m.type !== 'error' && (
                      <div className="mt-1.5 flex items-center gap-1">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          m.type === 'medicine' ? 'bg-teal-50 text-teal-600' :
                          m.type === 'navigation' ? 'bg-blue-50 text-blue-600' :
                          m.type === 'delivery' ? 'bg-orange-50 text-orange-600' :
                          m.type === 'faq' ? 'bg-purple-50 text-purple-600' :
                          m.type === 'platform' ? 'bg-emerald-50 text-emerald-600' :
                          'bg-gray-50 text-gray-500'
                        }`}>
                          {m.type}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}

              {/* Suggestion chips */}
              {showSuggestions && messages.length <= 1 && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-1.5 pt-1"
                >
                  {SUGGESTION_CHIPS.map((chip) => (
                    <motion.button
                      key={chip.label}
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleChipClick(chip.query)}
                      className="px-2.5 py-1.5 rounded-xl text-[11px] font-medium bg-white border border-teal-100 text-teal-700 hover:bg-teal-50 hover:border-teal-200 transition-all shadow-sm flex items-center gap-1"
                    >
                      {chip.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* ─── Input Area ─────────────────────── */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    connectionStatus === 'offline'
                      ? 'Server offline — try reconnecting...'
                      : 'Ask about medicines, delivery, navigation...'
                  }
                  disabled={isLoading}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent disabled:opacity-50 transition-all placeholder:text-gray-400"
                />
                <motion.button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-xl text-white transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                  style={{
                    background: isLoading || !input.trim()
                      ? '#94a3b8'
                      : 'linear-gradient(135deg, #0d9488, #0f766e)',
                  }}
                >
                  {isLoading ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </motion.button>
              </div>

              {/* Current page context indicator */}
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-gray-400 px-1">
                <span className="flex items-center gap-1">
                  <ArrowRight size={9} />
                  You're on: <span className="text-teal-600 font-medium">{currentPage}</span>
                </span>
                {connectionStatus === 'offline' && (
                  <button
                    type="button"
                    onClick={checkConnection}
                    className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-0.5"
                  >
                    <RefreshCw size={9} /> Retry
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
