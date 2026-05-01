import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, X } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, removeItem, updateQty, subtotal } = useCart()
  const navigate = useNavigate()

  function inc(item) {
    updateQty(item.id, item.qty + 1)
  }
  function dec(item) {
    updateQty(item.id, Math.max(1, item.qty - 1))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-2xl font-semibold text-slate-800">Your Cart</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-[10px] p-6 shadow text-center">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <p className="text-slate-600">Your cart is empty.</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link to="/medicines" className="inline-block mt-4 px-4 py-2 bg-teal-600 text-white rounded-[10px] hover:bg-teal-700">Shop Medicines</Link>
              </motion.div>
            </motion.div>
          </div>
        ) : (
          items.map((it, idx) => (
            <motion.div
              key={it.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-[10px] p-4 shadow flex items-start gap-4"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-[10px] flex items-center justify-center">Img</div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-slate-800 font-medium">{it.name}</h3>
                    <div className="text-sm text-slate-600">₨{it.price} each</div>
                  </div>
                  <motion.button
                    onClick={() => removeItem(it.id)}
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-slate-500 hover:text-red-500 transition-colors"
                  >
                    <X />
                  </motion.button>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <motion.div className="flex items-center gap-2 bg-gray-50 rounded-[10px] px-2 py-1">
                    <motion.button
                      onClick={() => dec(it)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1"
                    >
                      <Minus size={14} />
                    </motion.button>
                    <motion.div className="w-8 text-center" key={it.qty}>
                      {it.qty}
                    </motion.div>
                    <motion.button
                      onClick={() => inc(it)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1"
                    >
                      <Plus size={14} />
                    </motion.button>
                  </motion.div>
                  <motion.div initial={{ scale: 1 }} animate={{ scale: 1 }} className="text-slate-800 font-semibold">₨{it.price * it.qty}</motion.div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <aside className="space-y-4">
        <div className="bg-white rounded-[10px] p-4 shadow">
          <h4 className="text-slate-800 font-medium">Order Summary</h4>
          <div className="mt-3 flex items-center justify-between text-slate-600"> <span>Subtotal</span> <span>₨{subtotal}</span> </div>
          <div className="mt-2 flex items-center justify-between text-slate-600"> <span>Shipping</span> <span>₨50</span> </div>
          <div className="mt-3 border-t pt-3 flex items-center justify-between font-semibold text-slate-800"> <span>Total</span> <span>₨{subtotal + 50}</span> </div>

          <button onClick={() => navigate('/checkout')} className="w-full mt-4 px-4 py-2 bg-teal-600 text-white rounded-[10px] hover:bg-teal-700">Proceed to Checkout</button>
        </div>
      </aside>
    </motion.div>
  )
}
