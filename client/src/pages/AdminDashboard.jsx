import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, ShoppingCart, DollarSign } from 'lucide-react'

const MOCK_STATS = { users: 1240, orders: 893, revenue: 128500 }

const MOCK_USERS = [
  { id: 1, name: 'Aisha Khan', role: 'Customer', active: true },
  { id: 2, name: 'Bilal Ahmed', role: 'Customer', active: false },
  { id: 3, name: 'Dr. Sara', role: 'Pharmacist', active: true },
]

// AdminDashboard: stats cards + user management table with activate/deactivate toggles
export default function AdminDashboard() {
  const [users, setUsers] = useState(MOCK_USERS)

  function toggleActive(id) {
    setUsers((u) => u.map((x) => (x.id === id ? { ...x, active: !x.active } : x)))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-[10px] p-4 shadow flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-[10px]"><Users /></div>
          <div>
            <div className="text-sm text-slate-600">Total Users</div>
            <div className="text-2xl font-semibold text-slate-800">{MOCK_STATS.users}</div>
          </div>
        </div>

        <div className="bg-white rounded-[10px] p-4 shadow flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-[10px]"><ShoppingCart /></div>
          <div>
            <div className="text-sm text-slate-600">Total Orders</div>
            <div className="text-2xl font-semibold text-slate-800">{MOCK_STATS.orders}</div>
          </div>
        </div>

        <div className="bg-white rounded-[10px] p-4 shadow flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-[10px]"><DollarSign /></div>
          <div>
            <div className="text-sm text-slate-600">Revenue</div>
            <div className="text-2xl font-semibold text-slate-800">₨{MOCK_STATS.revenue.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white rounded-[10px] p-4 shadow">
        <h2 className="text-xl font-semibold text-slate-800">User Management</h2>
        <p className="text-sm text-slate-600 mt-1">View and manage user accounts.</p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="p-2">Name</th>
                <th className="p-2">Role</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3 font-medium text-slate-800">{u.name}</td>
                  <td className="p-3 text-slate-600">{u.role}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-[10px] text-sm ${u.active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {u.active ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="p-3">
                    <button onClick={() => toggleActive(u.id)} className={`px-3 py-1 rounded-[10px] ${u.active ? 'bg-gray-100 text-slate-700' : 'bg-teal-600 text-white'}`}>
                      {u.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
