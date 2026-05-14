import React, { useState, useEffect } from 'react'
import { supabase } from '../config/supabaseClient'
import { useCart } from '../context/CartContext'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  ShieldCheck, Truck, CreditCard, Headphones, ArrowRight,
  ShoppingCart, Star
} from 'lucide-react'
import BlogSection from '../components/BlogSection'

/* ─── Feature bar items ─── */
const FEATURES = [
  { title: 'Free Delivery', desc: 'On orders over Rs. 2000', icon: Truck, color: 'text-teal-600', bg: 'bg-teal-50' },
  { title: 'Genuine Products', desc: '100% authentic medicines', icon: ShieldCheck, color: 'text-teal-600', bg: 'bg-teal-50' },
  { title: '24/7 Support', desc: 'Always here to help', icon: Headphones, color: 'text-teal-600', bg: 'bg-teal-50' },
  { title: 'Secure Payment', desc: 'Multiple payment options', icon: CreditCard, color: 'text-teal-600', bg: 'bg-teal-50' },
]

/* ─── Featured Products ─── */
// Replaced with dynamic fetch from Supabase

/* ─── Pill SVG illustration for product cards ─── */
function PillIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="50" rx="20" ry="5" fill="#e2e8f0" opacity="0.5" />
      <g transform="translate(20, 8) rotate(-30, 20, 30)">
        {/* Capsule body */}
        <rect x="12" y="10" width="16" height="40" rx="8" fill="#fbbf24" />
        <rect x="12" y="10" width="16" height="20" rx="8" fill="#f8fafc" />
        {/* Highlight */}
        <rect x="16" y="14" width="3" height="10" rx="1.5" fill="#ffffff" opacity="0.6" />
      </g>
      {/* Small accent dot */}
      <circle cx="50" cy="20" r="5" fill="#f43f5e" opacity="0.8" />
    </svg>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Home() {
  const navigate = useNavigate()
  const [addedMap, setAddedMap] = useState({})
  const [featuredMedicines, setFeaturedMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState('');

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase.from('medicines').select('*').limit(8);
      if (error) throw error;
      setFeaturedMedicines(data || []);
    } catch (err) {
      console.error("Error fetching featured products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const { addToCart } = useCart();

  function handleAddToCart(medicine) {
    addToCart(medicine);
    toast.success("Added to cart successfully!");
    setAddedMap((s) => ({ ...s, [medicine.id]: true }))
    setTimeout(() => setAddedMap((s) => ({ ...s, [medicine.id]: false })), 1200)
  }

  return (
    <div>
      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative bg-gradient-to-r from-teal-700 via-teal-700 to-teal-600 overflow-hidden">
        {/* Background decorative shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-600/30 rounded-full blur-3xl" />
          <div className="absolute right-20 bottom-0 w-[300px] h-[300px] bg-teal-500/20 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-6 border border-white/20">
                <ShieldCheck size={16} />
                <span>Licensed & Verified Pharmacy</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-white leading-tight tracking-tight">
                Your Health,<br />
                Delivered to Your Door
              </h1>

              <p className="mt-5 text-lg text-white/80 max-w-lg leading-relaxed">
                Order genuine medicines, supplements & healthcare essentials with fast delivery across Pakistan.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-lg">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && localSearch.trim()) {
                        navigate(`/medicines?search=${encodeURIComponent(localSearch.trim())}`)
                      }
                    }}
                    placeholder="Search medicines..."
                    className="w-full px-5 py-3 rounded-full bg-white/95 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
                  />
                </div>

                {/* Shop Now Button */}
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/medicines"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-teal-600 text-white font-semibold rounded-full hover:bg-teal-700 transition-colors shadow-lg whitespace-nowrap"
                  >
                    Shop Now <ArrowRight size={18} />
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Hero illustration - medicine bottles */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:flex justify-center items-center"
            >
              <div className="relative">
                {/* Main bottle */}
                <svg width="280" height="260" viewBox="0 0 280 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Large bottle */}
                  <rect x="90" y="40" width="80" height="160" rx="12" fill="rgba(255,255,255,0.15)" />
                  <rect x="90" y="40" width="80" height="50" rx="12" fill="rgba(255,255,255,0.25)" />
                  <rect x="105" y="20" width="50" height="25" rx="6" fill="rgba(255,255,255,0.3)" />
                  {/* Label */}
                  <rect x="100" y="110" width="60" height="30" rx="4" fill="rgba(255,255,255,0.2)" />
                  <rect x="110" y="118" width="40" height="3" rx="1.5" fill="rgba(255,255,255,0.4)" />
                  <rect x="115" y="125" width="30" height="3" rx="1.5" fill="rgba(255,255,255,0.3)" />

                  {/* Small bottle left */}
                  <rect x="30" y="100" width="50" height="100" rx="10" fill="rgba(255,255,255,0.1)" />
                  <rect x="30" y="100" width="50" height="35" rx="10" fill="rgba(255,255,255,0.18)" />
                  <rect x="40" y="85" width="30" height="18" rx="5" fill="rgba(255,255,255,0.2)" />

                  {/* Small bottle right */}
                  <rect x="190" y="80" width="55" height="120" rx="10" fill="rgba(255,255,255,0.12)" />
                  <rect x="190" y="80" width="55" height="40" rx="10" fill="rgba(255,255,255,0.2)" />
                  <rect x="202" y="65" width="32" height="18" rx="5" fill="rgba(255,255,255,0.22)" />

                  {/* Plus symbols */}
                  <g fill="rgba(255,255,255,0.3)">
                    <rect x="20" y="60" width="16" height="3" rx="1.5" />
                    <rect x="26.5" y="53.5" width="3" height="16" rx="1.5" />
                    <rect x="240" y="130" width="16" height="3" rx="1.5" />
                    <rect x="246.5" y="123.5" width="3" height="16" rx="1.5" />
                  </g>

                  {/* Floating pills */}
                  <g transform="translate(210, 40) rotate(30)">
                    <rect width="12" height="28" rx="6" fill="rgba(255,255,255,0.25)" />
                    <rect width="12" height="14" rx="6" fill="rgba(255,255,255,0.35)" />
                  </g>
                  <g transform="translate(50, 220) rotate(-20)">
                    <rect width="10" height="24" rx="5" fill="rgba(255,255,255,0.2)" />
                    <rect width="10" height="12" rx="5" fill="rgba(255,255,255,0.3)" />
                  </g>
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES BAR ═══════════════ */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-10 h-10 ${f.bg} ${f.color} rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-800">{f.title}</div>
                    <div className="text-xs text-gray-500">{f.desc}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURED PRODUCTS ═══════════════ */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="mt-1 text-gray-500">Top-selling medicines & health products</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Link
                to="/medicines"
                className="px-5 py-2 border border-teal-600 text-teal-700 text-sm font-medium rounded-full hover:bg-teal-50 transition-colors"
              >
                View All
              </Link>
            </motion.div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {loading ? (
              <div className="col-span-full py-10 flex justify-center">
                <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : featuredMedicines.map((medicine) => (
              <motion.div
                key={medicine.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group flex flex-col"
              >
                {/* Image area */}
                <div className="relative bg-gray-50 h-44 flex items-center justify-center p-4 group-hover:bg-gray-100/80 transition-colors">
                  {medicine.image_url ? (
                    <img src={medicine.image_url} alt={medicine.name} className="h-full object-contain mix-blend-multiply" />
                  ) : (
                    <PillIllustration />
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium text-gray-700">4.8</span>
                  </div>

                  {/* Name & Description */}
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1" title={medicine.name}>{medicine.name}</h3>
                  <p className="text-xs text-teal-600 mt-0.5 line-clamp-1">{medicine.category}</p>

                  {/* Price & Cart */}
                  <div className="flex items-center justify-between mt-auto pt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-teal-700">Rs. {medicine.price?.toLocaleString()}</span>
                    </div>

                    <motion.button
                      onClick={() => handleAddToCart(medicine)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                        addedMap[medicine.id]
                          ? 'bg-emerald-500 text-white'
                          : 'bg-teal-600 text-white hover:bg-teal-700'
                      }`}
                      title="Add to cart"
                    >
                      {addedMap[medicine.id] ? (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </motion.svg>
                      ) : (
                        <ShoppingCart size={18} />
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ BLOG SECTION ═══════════════ */}
      <BlogSection />
    </div>
  )
}
