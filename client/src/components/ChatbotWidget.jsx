import React, { useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// ChatbotWidget: floating action button that opens an animated chat window.
// Uses rounded-[10px] for all interactive elements (per design system).
export default function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, from: 'ai', text: 'Assalamualaikum! How can I help you today?' },
    { id: 2, from: 'user', text: 'Do you have Paracetamol 500mg?' },
    { id: 3, from: 'ai', text: 'Yes, Paracetamol 500mg is available. Would you like me to add it to your cart?' },
  ])

  const listRef = useRef(null)

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [open, messages])

  function sendMessage(e) {
    e?.preventDefault()
    if (!input.trim()) return
    const id = Date.now()
    const userMsg = { id, from: 'user', text: input.trim() }
    setMessages((m) => [...m, userMsg])
    setInput('')

    // mock AI reply
    setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now() + 1, from: 'ai', text: 'Thanks — I\'ll check that for you. One moment please.' }])
    }, 700)
  }

  return (
    <div>
      {/* FAB */}
      <motion.button
        aria-label={open ? 'Close chat' : 'Open chat'}
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.1, boxShadow: '0 20px 30px rgba(13, 148, 136, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-teal-600 text-white flex items-center justify-center rounded-[10px] shadow-lg hover:bg-teal-700 transition-colors duration-150"
      >
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <MessageCircle size={20} />
        </motion.div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed bottom-20 right-6 z-50 w-[92vw] max-w-sm md:max-w-md bg-white rounded-[10px] shadow-2xl flex flex-col overflow-hidden"
          >
            <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <div className="text-sm font-semibold text-slate-800">Edrugs AI Assistant</div>
                <div className="text-xs text-slate-500">We're here to help — 24/7</div>
              </motion.div>
              <motion.button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-[10px] hover:bg-gray-50"
              >
                <X size={16} />
              </motion.button>
            </header>

            <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50" style={{ minHeight: 200 }}>
              {messages.map((m, idx) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`max-w-full flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`${m.from === 'user' ? 'bg-teal-600 text-white' : 'bg-white text-slate-800 border border-gray-200'} px-3 py-2 rounded-[10px] shadow-sm`}
                  >
                    <div className="text-sm">{m.text}</div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            <form onSubmit={sendMessage} className="p-3 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 rounded-[10px] bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-2 bg-teal-600 text-white rounded-[10px] hover:bg-teal-700 transition-colors duration-150 inline-flex items-center gap-2"
                >
                  <Send size={14} />
                  <span className="text-sm">Send</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
