import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const MOCK_PRODUCT = {
  id: 101,
  name: 'Azithromycin 250mg',
  price: 850,
  description: 'Azithromycin is used to treat a wide variety of bacterial infections. Always follow your physician\'s directions.',
  requiresPrescription: true,
  inStock: true,
}

export default function MedicineDetail() {
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  function inc() {
    setQty((q) => Math.min(10, q + 1))
  }
  function dec() {
    setQty((q) => Math.max(1, q - 1))
  }

  function handleAdd() {
    if (!MOCK_PRODUCT.inStock) return
    setAdded(true)
    setTimeout(() => setAdded(false), 800)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="bg-white rounded-[10px] p-4 md:p-8 shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="w-full flex items-center justify-center">
          <div className="w-full max-w-md h-64 bg-gray-100 rounded-[10px] flex items-center justify-center">Image Placeholder</div>
        </motion.div>

        {/* Details */}
        <div className="flex flex-col">
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-2xl font-semibold text-slate-800">{MOCK_PRODUCT.name}</motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex items-center gap-3 mt-2">
            {MOCK_PRODUCT.requiresPrescription && <span className="text-sm text-red-500 font-medium">Requires Prescription</span>}
            <span className={`text-sm ${MOCK_PRODUCT.inStock ? 'text-green-600' : 'text-red-500'}`}>{MOCK_PRODUCT.inStock ? 'In Stock' : 'Out of Stock'}</span>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-slate-800 font-semibold text-xl mt-4">₨{MOCK_PRODUCT.price}</motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="text-slate-600 mt-4">{MOCK_PRODUCT.description}</motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 flex items-center gap-4">
            <motion.div className="flex items-center gap-2 bg-gray-50 rounded-[10px] px-3 py-2">
              <motion.button
                onClick={dec}
                aria-label="Decrease"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                className="p-1"
              >
                <Minus size={16} />
              </motion.button>
              <motion.div className="w-10 text-center font-medium" key={qty}>
                {qty}
              </motion.div>
              <motion.button
                onClick={inc}
                aria-label="Increase"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                className="p-1"
              >
                <Plus size={16} />
              </motion.button>
            </motion.div>

            <motion.button
              onClick={handleAdd}
              disabled={!MOCK_PRODUCT.inStock}
              whileHover={MOCK_PRODUCT.inStock ? { scale: 1.05, boxShadow: '0 10px 20px rgba(13, 148, 136, 0.3)' } : {}}
              whileTap={MOCK_PRODUCT.inStock ? { scale: 0.95 } : {}}
              className="px-4 py-2 bg-teal-600 text-white rounded-[10px] hover:bg-teal-700 transition-colors duration-150 flex items-center gap-2"
            >
              Add to Cart
            </motion.button>

            <motion.div animate={added ? { scale: [1, 1.12, 1] } : { scale: 1 }} className="text-sm text-slate-600">
              {added ? 'Added to cart' : ''}
            </motion.div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  )
}
