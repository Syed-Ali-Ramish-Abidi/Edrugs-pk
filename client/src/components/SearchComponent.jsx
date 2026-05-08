import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../config/supabaseClient'

export default function SearchComponent() {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  // Fetch live suggestions from Supabase with debouncing
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (input.trim().length === 0) {
        setSuggestions([])
        return
      }
      try {
        const { data, error } = await supabase
          .from('medicines')
          .select('id, name')
          .ilike('name', `%${input.trim()}%`)
          .limit(6)
        if (error) throw error
        setSuggestions(data || [])
      } catch (err) {
        console.error('Error fetching suggestions:', err)
        setSuggestions([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [input])

  function handleInputChange(e) {
    setInput(e.target.value)
    setOpen(e.target.value.trim().length > 0)
    setHighlighted(-1)
  }

  function handleKeyDown(e) {
    if (!open || suggestions.length === 0) {
      if (e.key === 'Escape') setOpen(false)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((h) => (h < suggestions.length - 1 ? h + 1 : h))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((h) => (h > 0 ? h - 1 : -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlighted >= 0) selectItem(suggestions[highlighted])
      else if (input.trim().length > 0) {
        setOpen(false)
        navigate(`/medicines?search=${encodeURIComponent(input.trim())}`)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  function selectItem(item) {
    setInput('')
    setOpen(false)
    navigate(`/medicines?search=${encodeURIComponent(item.name)}`)
  }

  function handleBlur() {
    setTimeout(() => setOpen(false), 150)
  }

  return (
    <div className="relative w-full">
      <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) navigate(`/medicines?search=${encodeURIComponent(input.trim())}`) }} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          ref={inputRef}
          aria-label="Search medicines"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={open}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => input.trim().length > 0 && setOpen(true)}
          onBlur={handleBlur}
          className="w-full pl-11 pr-10 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          placeholder="Search medicines, health products..."
        />
        {input && (
          <button
            type="button"
            onClick={() => {
              setInput('')
              setOpen(false)
              inputRef.current?.focus()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </form>

      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.div
            id="search-suggestions"
            role="listbox"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-[100] overflow-hidden"
          >
            <ul className="max-h-64 overflow-y-auto py-1">
              {suggestions.map((item, idx) => (
                <li key={item.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={highlighted === idx}
                    onClick={() => selectItem(item)}
                    onMouseEnter={() => setHighlighted(idx)}
                    className={`w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm ${
                      highlighted === idx ? 'bg-teal-50 text-teal-700' : 'text-gray-700'
                    } hover:bg-teal-50 transition-colors`}
                  >
                    <Search size={14} className="text-gray-400 shrink-0" />
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {open && input.trim().length > 0 && suggestions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-sm text-gray-500 z-[100]"
        >
          No medicines found matching "{input}"
        </motion.div>
      )}
    </div>
  )
}
