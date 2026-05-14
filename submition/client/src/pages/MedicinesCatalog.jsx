import React, { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Filter, ChevronDown, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../config/supabaseClient'
import { useCart } from '../context/CartContext'
import { PRODUCT_CATEGORIES } from '../constants/categories'


// Local small pill SVG fallback used when a product has no image
function PillIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="50" rx="20" ry="5" fill="#e2e8f0" opacity="0.5" />
      <g transform="translate(20, 8) rotate(-30, 20, 30)">
        <rect x="12" y="10" width="16" height="40" rx="8" fill="#fbbf24" />
        <rect x="12" y="10" width="16" height="20" rx="8" fill="#f8fafc" />
        <rect x="16" y="14" width="3" height="10" rx="1.5" fill="#ffffff" opacity="0.6" />
      </g>
      <circle cx="50" cy="20" r="5" fill="#f43f5e" opacity="0.8" />
    </svg>
  )
}

export default function MedicinesCatalog() {
  const { addToCart } = useCart()
  const [searchParams] = useSearchParams()

  // Data & filters
  const [medicines, setMedicines] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMainCategory, setSelectedMainCategory] = useState('')
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState('')

  const [loading, setLoading] = useState(true)

  // Apply URL query parameters on mount
  useEffect(() => {
    const mainFromURL = searchParams.get('main')
    const subFromURL = searchParams.get('sub')
    const searchFromURL = searchParams.get('search')

    if (mainFromURL) {
      setSelectedMainCategory(mainFromURL)
      if (subFromURL) {
        setSelectedSubCategory(subFromURL)
      }
      setExpandedCategory(mainFromURL)
    }

    if (searchFromURL) setSearchTerm(searchFromURL)
  }, [])

  // Fetch medicines from Supabase
  const fetchMedicines = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('medicines').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setMedicines(data || [])
    } catch (err) {
      console.error('Error fetching medicines:', err)
      setMedicines([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedicines()
  }, [])

  const filteredMedicines = useMemo(() => {
    const s = (searchTerm || '').trim().toLowerCase()
    return medicines.filter((m) => {
      const mainCategory = m.main_category || m.category || ''
      const subCategory = m.sub_category || ''
      const searchBlob = [m.name, m.category, m.main_category, m.sub_category, m.item_type]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      if (s && !searchBlob.includes(s)) return false
      if (selectedSubCategory) {
        if (mainCategory !== selectedMainCategory) return false
        if (subCategory !== selectedSubCategory) return false
      } else if (selectedMainCategory) {
        if (mainCategory !== selectedMainCategory) return false
      }
      if (minPrice && Number(m.price) < Number(minPrice)) return false
      if (maxPrice && Number(m.price) > Number(maxPrice)) return false
      return true
    })
  }, [medicines, searchTerm, selectedMainCategory, selectedSubCategory, minPrice, maxPrice])

  const handleSelectMainCategory = (mainCategory) => {
    setSelectedMainCategory(mainCategory)
    setSelectedSubCategory('')
    setExpandedCategory(mainCategory)
  }

  const handleSelectSubCategory = (mainCategory, subCategory) => {
    setSelectedMainCategory(mainCategory)
    setSelectedSubCategory(subCategory)
    setExpandedCategory(mainCategory)
  }

  const clearCategoryFilter = () => {
    setSelectedMainCategory('')
    setSelectedSubCategory('')
    setExpandedCategory('')
  }

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
            <div className="mb-3">
              <label className="block text-sm text-slate-700 mb-2">Search</label>
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search medicines..." className="w-full px-3 py-2 rounded-[10px] bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm text-slate-700">Categories</label>
                <button onClick={clearCategoryFilter} className="text-xs font-medium text-teal-600 hover:text-teal-700">All Categories</button>
              </div>
              <div className="space-y-2">
                {Object.keys(PRODUCT_CATEGORIES).map((mainCategory) => {
                  const isExpanded = expandedCategory === mainCategory
                  const subCategories = Object.keys(PRODUCT_CATEGORIES[mainCategory]?.subcategories || {})

                  return (
                    <div key={mainCategory} className="rounded-[10px] border border-gray-200 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setExpandedCategory(isExpanded ? '' : mainCategory)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm font-medium transition-colors ${selectedMainCategory === mainCategory ? 'bg-teal-50 text-teal-700' : 'bg-gray-50 text-slate-700 hover:bg-gray-100'}`}
                      >
                        <span onClick={(e) => { e.stopPropagation(); handleSelectMainCategory(mainCategory) }}>{mainCategory}</span>
                        {isExpanded ? <ChevronDown size={16} className="shrink-0" /> : <ChevronRight size={16} className="shrink-0" />}
                      </button>

                      {isExpanded && (
                        <div className="bg-white">
                          <button
                            type="button"
                            onClick={() => handleSelectMainCategory(mainCategory)}
                            className="w-full px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hover:bg-gray-50 border-b border-gray-100"
                          >
                            View all in {mainCategory}
                          </button>
                          <div className="py-1">
                            {subCategories.map((subCategory) => {
                              const itemTypes = PRODUCT_CATEGORIES[mainCategory]?.subcategories?.[subCategory] || []
                              return (
                                <div key={subCategory} className="px-2 py-1">
                                  <button
                                    type="button"
                                    onClick={() => handleSelectSubCategory(mainCategory, subCategory)}
                                    className={`w-full rounded-[8px] px-3 py-2 text-left text-sm transition-colors ${selectedSubCategory === subCategory && selectedMainCategory === mainCategory ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-gray-50'}`}
                                  >
                                    <div className="flex items-center justify-between gap-3">
                                      <span>{subCategory}</span>
                                      <span className="text-xs text-gray-400">{itemTypes.length} types</span>
                                    </div>
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
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
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm text-slate-700">Categories</label>
                  <button type="button" onClick={clearCategoryFilter} className="text-xs font-medium text-teal-600 hover:text-teal-700">All Categories</button>
                </div>
                <div className="space-y-2">
                  {Object.keys(PRODUCT_CATEGORIES).map((mainCategory) => {
                    const isExpanded = expandedCategory === mainCategory
                    const subCategories = Object.keys(PRODUCT_CATEGORIES[mainCategory]?.subcategories || {})

                    return (
                      <div key={mainCategory} className="rounded-[10px] border border-gray-200 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setExpandedCategory(isExpanded ? '' : mainCategory)}
                          className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm font-medium transition-colors ${selectedMainCategory === mainCategory ? 'bg-teal-50 text-teal-700' : 'bg-white text-slate-700 hover:bg-gray-50'}`}
                        >
                          <span onClick={(e) => { e.stopPropagation(); handleSelectMainCategory(mainCategory) }}>{mainCategory}</span>
                          {isExpanded ? <ChevronDown size={16} className="shrink-0" /> : <ChevronRight size={16} className="shrink-0" />}
                        </button>

                        {isExpanded && (
                          <div className="bg-white border-t border-gray-100">
                            <button
                              type="button"
                              onClick={() => handleSelectMainCategory(mainCategory)}
                              className="w-full px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hover:bg-gray-50"
                            >
                              View all in {mainCategory}
                            </button>
                            {subCategories.map((subCategory) => (
                              <button
                                key={subCategory}
                                type="button"
                                onClick={() => handleSelectSubCategory(mainCategory, subCategory)}
                                className={`w-full px-4 py-2 text-left text-sm transition-colors ${selectedSubCategory === subCategory && selectedMainCategory === mainCategory ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-gray-50'}`}
                              >
                                {subCategory}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
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
            {loading ? (
              <div className="col-span-full text-center p-8 text-gray-500">Loading medicines...</div>
            ) : filteredMedicines.length === 0 ? (
              <div className="col-span-full text-center p-8 text-gray-500">No medicines found.</div>
            ) : (
              filteredMedicines.map((p) => (
                <motion.article
                  key={p.id}
                  whileHover={{ y: -8, boxShadow: '0 25px 30px -5rgba(0, 0, 0, 0.15)' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="bg-white rounded-[10px] p-4 shadow-sm flex flex-col"
                >
                  <div className="w-full h-36 bg-gray-100 rounded-[10px] mb-4 flex items-center justify-center overflow-hidden">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="max-h-36 object-contain" />
                    ) : (
                      <PillIllustration />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-slate-800 font-medium">{p.name}</h4>
                    <div className="text-slate-600 mt-2">{p.category}</div>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="text-slate-800 font-semibold">Rs. {Number(p.price || 0).toLocaleString()}</div>
                    <motion.button
                      onClick={() => { addToCart(p); toast.success('Added to cart!') }}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-3 py-2 bg-teal-600 text-white rounded-[10px] hover:bg-teal-700 transition-colors duration-150 inline-flex items-center gap-2"
                    >
                      <Plus size={14} /> Add
                    </motion.button>
                  </div>
                </motion.article>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
