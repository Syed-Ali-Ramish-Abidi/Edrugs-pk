import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../config/supabaseClient'
import { useAuth } from '../context/AuthContext'

const SIDEBAR = [
  { key: 'orders', label: 'My Orders' },
  { key: 'prescriptions', label: 'Prescriptions' },
  { key: 'profile', label: 'Profile' },
]

// UserDashboard: simple sidebar + main area. Order history is dynamic.
export default function UserDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching user orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <aside className="lg:col-span-1">
        <div className="bg-white rounded-[10px] p-4 shadow">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">My Account</h3>
          <nav className="flex flex-col gap-2">
            {SIDEBAR.map((s) => (
              <button 
                key={s.key} 
                onClick={() => setActiveTab(s.key)}
                className={`text-left px-3 py-2 rounded-[10px] transition-colors font-medium ${
                  activeTab === s.key 
                    ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-600 pl-2' 
                    : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900 border-l-4 border-transparent'
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="lg:col-span-3 space-y-4">
        {activeTab === 'orders' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-white rounded-[10px] p-4 shadow min-h-[400px]"
          >
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
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-slate-500">
                      <div className="flex justify-center">
                        <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-500 font-medium">
                      You haven't placed any orders yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id} className="border-t hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-medium text-slate-800" title={o.id}>
                        ORD-{o.id.substring(0, 8).toUpperCase()}
                      </td>
                      <td className="p-3 text-slate-600">{new Date(o.created_at).toLocaleDateString()}</td>
                      <td className="p-3 text-slate-800 font-semibold">₨{o.total_amount?.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          o.status === 'Delivered' ? 'bg-green-50 text-green-700 border border-green-200' : 
                          o.status === 'Pending' || o.status === 'Processing' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 
                          'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {o.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          </motion.div>
        )}

        {activeTab === 'prescriptions' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-white rounded-[10px] p-6 shadow min-h-[400px]"
          >
            <h2 className="text-xl font-semibold text-slate-800">My Prescriptions</h2>
            <p className="text-slate-600 mt-2">Prescription management is coming soon in Phase 5.</p>
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-white rounded-[10px] p-6 shadow min-h-[400px]"
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Account Settings</h2>
            <div className="space-y-6 max-w-md">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <label className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">Full Name</label>
                <p className="text-base font-semibold text-slate-800">{user?.user_metadata?.full_name || 'N/A'}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <label className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">Email Address</label>
                <p className="text-base font-semibold text-slate-800">{user?.email || 'N/A'}</p>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </motion.div>
  )
}
