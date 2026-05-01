import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

// Signup page with client-side validation and Framer Motion fade-in
export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Full name zaroori hai.'

    if (!form.email) e.email = 'Email zaroori hai.'
    else if (!/^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(form.email)) e.email = 'Munasib email format dalo.'

    if (!form.password) e.password = 'Password zaroori hai.'
    else if (form.password.length < 8) e.password = 'Password kam az kam 8 characters hona chahiye.'

    if (form.confirm !== form.password) e.confirm = 'Passwords match nahi kar rahe.'

    return e
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setSubmitting(true)
    // Simulate API call - replace with real signup
    await new Promise((r) => setTimeout(r, 900))
    setSubmitting(false)
    // After signup, redirect to welcome or login
    navigate('/')
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-lg bg-white rounded-[10px] shadow p-6 md:p-8"
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <h1 className="text-2xl font-semibold text-slate-800 mb-2">Create your account</h1>
          <p className="text-sm text-slate-600 mb-6">Join Edrugs.pk for quick, reliable medicine delivery.</p>
        </motion.div>

        <form onSubmit={handleSubmit} noValidate>
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <label className="block text-sm text-slate-700">Full Name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className={`w-full mt-2 mb-1 px-3 py-2 rounded-[10px] bg-gray-50 border ${errors.fullName ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-150`}
              placeholder="Your full name"
              aria-invalid={!!errors.fullName}
            />
            {errors.fullName && <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm mb-2">{errors.fullName}</motion.div>}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <label className="block text-sm text-slate-700 mt-3">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full mt-2 mb-1 px-3 py-2 rounded-[10px] bg-gray-50 border ${errors.email ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-150`}
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
            />
            {errors.email && <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm mb-2">{errors.email}</motion.div>}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-sm text-slate-700">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`w-full mt-2 mb-1 px-3 py-2 rounded-[10px] bg-gray-50 border ${errors.password ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-150`}
                placeholder="Create a password"
                aria-invalid={!!errors.password}
              />
              {errors.password && <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm mb-2">{errors.password}</motion.div>}
            </div>

            <div>
              <label className="block text-sm text-slate-700">Confirm Password</label>
              <input
                type="password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className={`w-full mt-2 mb-1 px-3 py-2 rounded-[10px] bg-gray-50 border ${errors.confirm ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-150`}
                placeholder="Repeat password"
                aria-invalid={!!errors.confirm}
              />
              {errors.confirm && <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm mb-2">{errors.confirm}</motion.div>}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center justify-between mt-4">
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-teal-600 text-white rounded-[10px] hover:bg-teal-700 transition-colors duration-150"
            >
              {submitting ? 'Creating...' : 'Create Account'}
            </motion.button>
          </motion.div>
        </form>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-6 text-sm text-slate-600">
          Already have an account? <Link to="/login" className="text-teal-600 hover:underline">Sign in</Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
