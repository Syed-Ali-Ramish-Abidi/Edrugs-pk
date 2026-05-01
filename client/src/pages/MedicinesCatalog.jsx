import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Filter } from 'lucide-react'

const CATEGORIES = [
  'Medicine',
  'Baby & Mother Care',
  'Nutritions & Supplements',
  'Foods & Beverages',
  'Devices & Support',
  'Personal Care',
  'OTC And Health Need',
]

const MOCK = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: `Medicine ${i + 1}`,
  category: CATEGORIES[i % CATEGORIES.length],
  price: (50 + i * 30),
  requiresPrescription: i % 4 === 0,
  inStock: i % 5 !== 0,
}))

export default function MedicinesCatalog() {
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    return MOCK.filter((m) => {
      if (category && m.category !== category) return false
      if (minPrice && m.price < Number(minPrice)) return false
      if (maxPrice && m.price > Number(maxPrice)) return false
      return true
    })
  }, [category, minPrice, maxPrice])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Medicines</h1>
        <button onClick={() => setMobileFiltersOpen(true)} className="md:hidden flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-[10px]">
          <Filter size={16} /> <span className="text-sm text-slate-700">Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar for md+ */}
        <aside className="hidden md:block md:col-span-1">
          <div className="bg-white p-4 rounded-[10px] shadow-sm">
            <h3 className="text-slate-800 font-medium mb-3">Filters</h3>

            <div className="mb-4">
              <label className="block text-sm text-slate-700 mb-2">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-[10px] bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">Price Range</label>
              <div className="flex gap-2">
                <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min" className="w-1/2 px-3 py-2 rounded-[10px] bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max" className="w-1/2 px-3 py-2 rounded-[10px] bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>
          </div>
        </aside>

        {/* Products grid */}
        <div className="md:col-span-3">
          {/* Mobile filters panel */}
          {mobileFiltersOpen && (
            <div className="bg-white p-4 rounded-[10px] shadow mb-4 md:hidden">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-slate-800 font-medium">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-slate-600">Close</button>
              </div>

              <div className="mb-3">
                <label className="block text-sm text-slate-700 mb-2">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-[10px] bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="">All Categories</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min" className="w-1/2 px-3 py-2 rounded-[10px] bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max" className="w-1/2 px-3 py-2 rounded-[10px] bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <motion.article
                key={p.id}
                whileHover={{ y: -8, boxShadow: '0 25px 30px -5rgba(0, 0, 0, 0.15)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="bg-white rounded-[10px] p-4 shadow-sm flex flex-col cursor-pointer"
              >
                <div className="w-full h-36 bg-gray-100 rounded-[10px] mb-4 flex items-center justify-center">Image</div>
                <div className="flex-1">
                  <h4 className="text-slate-800 font-medium">{p.name}</h4>
                  <div className="text-slate-600 mt-2">{p.category}</div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="text-slate-800 font-semibold">₨{p.price}</div>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-3 py-2 bg-teal-600 text-white rounded-[10px] hover:bg-teal-700 transition-colors duration-150 inline-flex items-center gap-2">
                    <Plus size={14} /> Add
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
