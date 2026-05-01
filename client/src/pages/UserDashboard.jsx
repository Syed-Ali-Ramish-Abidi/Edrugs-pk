import React from 'react'
import { motion } from 'framer-motion'

const SIDEBAR = [
  { key: 'orders', label: 'My Orders' },
  { key: 'prescriptions', label: 'Prescriptions' },
  { key: 'profile', label: 'Profile' },
]

const MOCK_ORDERS = [
  { id: 'ORD-1001', date: '2026-04-01', total: 1250, status: 'Delivered' },
  { id: 'ORD-1002', date: '2026-04-10', total: 450, status: 'Processing' },
  { id: 'ORD-1003', date: '2026-04-20', total: 980, status: 'Cancelled' },
]

// UserDashboard: simple sidebar + main area. Order history is a mock table.
export default function UserDashboard() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <aside className="lg:col-span-1">
        <div className="bg-white rounded-[10px] p-4 shadow">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">My Account</h3>
          <nav className="flex flex-col gap-2">
            {SIDEBAR.map((s) => (
              <button key={s.key} className="text-left px-3 py-2 rounded-[10px] hover:bg-gray-50 text-slate-700">{s.label}</button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="lg:col-span-3 space-y-4">
        <div className="bg-white rounded-[10px] p-4 shadow">
          <h2 className="text-xl font-semibold text-slate-800">Order History</h2>
          <p className="text-sm text-slate-600 mt-1">Recent orders placed on your account.</p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-600">
                  <th className="p-2">Order</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ORDERS.map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="p-3 font-medium text-slate-800">{o.id}</td>
                    <td className="p-3 text-slate-600">{o.date}</td>
                    <td className="p-3 text-slate-800">₨{o.total}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-[10px] text-sm ${o.status === 'Delivered' ? 'bg-green-50 text-green-700' : o.status === 'Processing' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </motion.div>
  )
}
