import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

// Login page with client-side validation and Framer Motion fade-in
export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    const e = {}
    if (!form.email) e.email = 'Email zaroori hai.'
    else if (!/^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(form.email)) e.email = 'Munasib email format dalo.'

    if (!form.password) e.password = 'Password zaroori hai.'
    else if (form.password.length < 8) e.password = 'Password kam az kam 8 characters hona chahiye.'

    return e
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setSubmitting(true)
    // Simulate API call - replace with real auth
    await new Promise((r) => setTimeout(r, 800))
    setSubmitting(false)
    // On success, navigate to home or profile
    navigate('/')
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md bg-white rounded-[10px] shadow p-6 md:p-8"
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <h1 className="text-2xl font-semibold text-slate-800 mb-2">Welcome back</h1>
          <p className="text-sm text-slate-600 mb-6">Login to your Edrugs.pk account</p>
        </motion.div>

        <form onSubmit={handleSubmit} noValidate>
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <label className="block text-sm text-slate-700">Email</label>
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

          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <label className="block text-sm text-slate-700 mt-3">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`w-full mt-2 mb-1 px-3 py-2 rounded-[10px] bg-gray-50 border ${errors.password ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-150`}
              placeholder="Enter your password"
              aria-invalid={!!errors.password}
            />
            {errors.password && <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm mb-2">{errors.password}</motion.div>}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="flex items-center justify-between mt-4">
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-teal-600 text-white rounded-[10px] hover:bg-teal-700 transition-colors duration-150"
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </motion.button>

            <motion.div whileHover={{ x: 4 }}>
              <Link to="/forgot-password" className="text-sm text-slate-600 hover:text-teal-600">Forgot Password?</Link>
            </motion.div>
          </motion.div>
        </form>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 text-sm text-slate-600">
          New to Edrugs.pk? <Link to="/signup" className="text-teal-600 hover:underline">Create an account</Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
