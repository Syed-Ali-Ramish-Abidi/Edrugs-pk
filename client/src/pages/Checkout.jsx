import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'

export default function Checkout() {
  const { items, subtotal, hasPrescriptionItem, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', address: '', city: '', postal: '', phone: '' })
  const [payment, setPayment] = useState('cod')
  const [errors, setErrors] = useState({})
  const [prescriptionFile, setPrescriptionFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name required.'
    if (!form.address.trim()) e.address = 'Address required.'
    if (!form.city.trim()) e.city = 'City required.'
    if (!form.postal.trim()) e.postal = 'Postal code required.'
    if (!form.phone.trim()) e.phone = 'Phone number required.'
    if (hasPrescriptionItem && !prescriptionFile) e.prescription = 'Upload prescription for prescription medicines.'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length > 0) return

    setSubmitting(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 900))
    setSubmitting(false)
    clearCart()
    navigate('/')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <main className="lg:col-span-2">
        <h1 className="text-2xl font-semibold text-slate-800 mb-4">Checkout</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-[10px] p-6 shadow space-y-4">
          <div>
            <label className="block text-sm text-slate-700">Full Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`w-full mt-2 px-3 py-2 rounded-[10px] bg-gray-50 border ${errors.name ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-teal-500`} />
            {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
          </div>

          <div>
            <label className="block text-sm text-slate-700">Address</label>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={`w-full mt-2 px-3 py-2 rounded-[10px] bg-gray-50 border ${errors.address ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-teal-500`} />
            {errors.address && <div className="text-red-500 text-sm">{errors.address}</div>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-slate-700">City</label>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={`w-full mt-2 px-3 py-2 rounded-[10px] bg-gray-50 border ${errors.city ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-teal-500`} />
              {errors.city && <div className="text-red-500 text-sm">{errors.city}</div>}
            </div>
            <div>
              <label className="block text-sm text-slate-700">Postal Code</label>
              <input value={form.postal} onChange={(e) => setForm({ ...form, postal: e.target.value })} className={`w-full mt-2 px-3 py-2 rounded-[10px] bg-gray-50 border ${errors.postal ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-teal-500`} />
              {errors.postal && <div className="text-red-500 text-sm">{errors.postal}</div>}
            </div>
            <div>
              <label className="block text-sm text-slate-700">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={`w-full mt-2 px-3 py-2 rounded-[10px] bg-gray-50 border ${errors.phone ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-teal-500`} />
              {errors.phone && <div className="text-red-500 text-sm">{errors.phone}</div>}
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-700">Payment Method</label>
            <div className="mt-2 flex gap-3">
              <label className={`px-3 py-2 rounded-[10px] border ${payment === 'cod' ? 'border-teal-600 bg-teal-50' : 'border-gray-200'} cursor-pointer`}>
                <input type="radio" name="payment" checked={payment === 'cod'} onChange={() => setPayment('cod')} className="hidden" /> Cash on Delivery
              </label>
              <label className={`px-3 py-2 rounded-[10px] border ${payment === 'card' ? 'border-teal-600 bg-teal-50' : 'border-gray-200'} cursor-pointer`}>
                <input type="radio" name="payment" checked={payment === 'card'} onChange={() => setPayment('card')} className="hidden" /> Card
              </label>
            </div>
          </div>

          {hasPrescriptionItem && (
            <div>
              <label className="block text-sm text-slate-700">Prescription Upload</label>
              <input type="file" accept="image/*" onChange={(e) => setPrescriptionFile(e.target.files?.[0] || null)} className="mt-2" />
              {errors.prescription && <div className="text-red-500 text-sm">{errors.prescription}</div>}
              {prescriptionFile && (
                <div className="mt-2">
                  <img src={URL.createObjectURL(prescriptionFile)} alt="preview" className="w-40 h-40 object-cover rounded-[10px] border" />
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-50 rounded-[10px] border border-gray-200">Back</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-teal-600 text-white rounded-[10px] hover:bg-teal-700">{submitting ? 'Placing Order...' : 'Place Order'}</button>
          </div>
        </form>
      </main>

      <aside className="space-y-4">
        <div className="bg-white rounded-[10px] p-4 shadow">
          <h4 className="font-medium text-slate-800">Order Summary</h4>
          <div className="mt-2 text-sm text-slate-600">
            {items.map((it) => (
              <div key={it.id} className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium text-slate-800">{it.name}</div>
                  <div className="text-slate-600 text-sm">Qty: {it.qty}</div>
                </div>
                <div className="font-semibold">₨{it.price * it.qty}</div>
              </div>
            ))}
          </div>

          <div className="mt-3 border-t pt-3 text-slate-800 font-semibold flex items-center justify-between"> <span>Total</span> <span>₨{subtotal + 50}</span> </div>
        </div>
      </aside>
    </motion.div>
  )
}
