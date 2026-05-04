import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Pill, ShoppingBag, 
  Users2, Package, CircleDollarSign,
  ShieldAlert, ShieldCheck, Power, PowerOff, AlertTriangle,
  Search, Filter, Plus, ChevronLeft, ChevronRight, UserCheck, UserX,
  Edit2, Trash2, X, Image as ImageIcon,
  Eye, Clock, Truck, CheckCircle, Printer, MapPin, Mail, Phone
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// --- MOCK DATA ---
const initialMockUsers = [
  { id: 1, name: 'Ali Ramish', email: 'i230651@isb.nu.edu.pk', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Sarah Ahmed', email: 'sarah.ahmed@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Dr. Usman Tariq', email: 'usman.tariq@hospital.com', role: 'Admin', status: 'Inactive' },
  { id: 4, name: 'Ayesha Khan', email: 'ayesha.k@example.pk', role: 'User', status: 'Active' },
  { id: 5, name: 'Zainab Qasim', email: 'zainabq99@gmail.com', role: 'User', status: 'Inactive' },
];

const initialMockMedicines = [
  { id: 1, name: 'Panadol Extra 500mg', category: 'Pain Relief', price: 150, stock: 120, type: 'OTC', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=50&h=50&fit=crop' },
  { id: 2, name: 'CaC-1000 Plus', category: 'Supplements', price: 280, stock: 45, type: 'OTC', image: 'https://images.unsplash.com/photo-1550572017-edb70267852c?w=50&h=50&fit=crop' },
  { id: 3, name: 'Augmentin 625mg', category: 'Antibiotics', price: 450, stock: 5, type: 'Rx Required', image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=50&h=50&fit=crop' },
  { id: 4, name: 'Centrum Silver', category: 'Supplements', price: 2500, stock: 8, type: 'OTC', image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=50&h=50&fit=crop' },
  { id: 5, name: 'Betnovate N Cream', category: 'Derma', price: 120, stock: 0, type: 'Rx Required', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=50&h=50&fit=crop' },
];

const initialMockOrders = [
  { 
    id: '#ORD-8001', date: 'Oct 24, 2026', customer: 'Ali Ramish', email: 'i230651@isb.nu.edu.pk', phone: '+92 300 1234567',
    address: '1548 Staar Hostel, ISLAMABAD', itemsCount: 3, total: 2450, status: 'Pending',
    items: [
      { name: 'Panadol Extra 500mg', qty: 2, price: 150 },
      { name: 'Surbex Z', qty: 1, price: 2150 }
    ]
  },
  { 
    id: '#ORD-8002', date: 'Oct 24, 2026', customer: 'Sana Khan', email: 'sana.k@example.com', phone: '+92 321 7654321',
    address: 'House 42, Street 5, DHA Phase 2, Lahore', itemsCount: 1, total: 1250, status: 'Processing',
    items: [
      { name: 'CaC-1000 Plus', qty: 1, price: 1250 }
    ]
  },
  { 
    id: '#ORD-8003', date: 'Oct 23, 2026', customer: 'Waqas Ahmed', email: 'waqas.ahmed@example.pk', phone: '+92 333 9876543',
    address: 'Apt 12B, Creek Vistas, Karachi', itemsCount: 5, total: 8900, status: 'Shipped',
    items: [
      { name: 'Centrum Silver', qty: 2, price: 2500 },
      { name: 'Ensure Plus Vanilla', qty: 1, price: 3900 }
    ]
  },
  { 
    id: '#ORD-8004', date: 'Oct 22, 2026', customer: 'Fatima Bilal', email: 'fatima.b@gmail.com', phone: '+92 300 1112223',
    address: 'Sector F-8/4, Islamabad', itemsCount: 2, total: 550, status: 'Delivered',
    items: [
      { name: 'Augmentin 625mg', qty: 1, price: 450 },
      { name: 'Bandages', qty: 1, price: 100 }
    ]
  },
  { 
    id: '#ORD-8005', date: 'Oct 21, 2026', customer: 'Dr. Tariq', email: 'tariq.doc@hospital.com', phone: '+92 345 5556667',
    address: 'General Hospital Staff Quarters, Rawalpindi', itemsCount: 12, total: 12400, status: 'Cancelled',
    items: [
      { name: 'Surgical Masks Box', qty: 10, price: 1000 },
      { name: 'Sanitizer 500ml', qty: 2, price: 1200 }
    ]
  },
];

const GLOBAL_STATS = [
  { title: 'Total Users', value: '1,248', icon: Users2, color: 'text-blue-600', bg: 'bg-blue-50' },
  { title: 'Active Orders', value: '45', icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50' },
  { title: 'Total Revenue', value: 'Rs. 450K', icon: CircleDollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { title: 'Medicines in Stock', value: '3,812', icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
];

const USER_STATS = [
  { title: 'Total Users', value: '1,248', icon: Users2, color: 'text-blue-600', bg: 'bg-blue-50' },
  { title: 'Active Admins', value: '12', icon: UserCheck, color: 'text-teal-600', bg: 'bg-teal-50' },
  { title: 'Blocked Accounts', value: '34', icon: UserX, color: 'text-red-600', bg: 'bg-red-50' },
];

const INVENTORY_STATS = [
  { title: 'Total Medicines', value: '3,812', icon: Pill, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { title: 'Low Stock Alerts', value: '14', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
  { title: 'Out of Stock', value: '3', icon: Package, color: 'text-red-600', bg: 'bg-red-50' },
  { title: 'Total Categories', value: '18', icon: LayoutDashboard, color: 'text-blue-600', bg: 'bg-blue-50' },
];

const ORDER_STATS = [
  { title: 'Total Orders', value: '4,521', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
  { title: 'Pending Processing', value: '18', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  { title: 'Shipped', value: '45', icon: Truck, color: 'text-teal-600', bg: 'bg-teal-50' },
  { title: 'Delivered', value: '3,892', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
];

const SIDEBAR_LINKS = [
  { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
  { id: 'users', label: 'Manage Users', icon: Users },
  { id: 'inventory', label: 'Medicines Inventory', icon: Pill },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
];

// Analytics Mock Data
const revenueData = [
  { name: 'Mon', revenue: 42000 },
  { name: 'Tue', revenue: 38000 },
  { name: 'Wed', revenue: 55000 },
  { name: 'Thu', revenue: 48000 },
  { name: 'Fri', revenue: 62000 },
  { name: 'Sat', revenue: 85000 },
  { name: 'Sun', revenue: 70000 },
];

const categoryData = [
  { name: 'Medicine', value: 55 },
  { name: 'Supplements', value: 25 },
  { name: 'Personal Care', value: 15 },
  { name: 'Devices', value: 5 },
];

const RECENT_ORDERS = [
  { id: '#ORD-7023', customer: 'Ahsan Ali', amount: 'Rs. 4,500', status: 'Delivered' },
  { id: '#ORD-7024', customer: 'Sana Khan', amount: 'Rs. 1,250', status: 'Shipped' },
  { id: '#ORD-7025', customer: 'Waqas Ahmed', amount: 'Rs. 8,900', status: 'Pending' },
  { id: '#ORD-7026', customer: 'Fatima Bilal', amount: 'Rs. 550', status: 'Pending' },
  { id: '#ORD-7027', customer: 'Dr. Tariq', amount: 'Rs. 12,400', status: 'Shipped' },
];

const LOW_STOCK = [
  { id: 1, name: 'Panadol Extra 500mg', left: 2 },
  { id: 2, name: 'Augmentin 625mg', left: 5 },
  { id: 3, name: 'Surbex Z', left: 1 },
  { id: 4, name: 'Ensure Plus Vanilla', left: 4 },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders'); // Set to orders by default to test the new UI
  
  const [users, setUsers] = useState(initialMockUsers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [orders, setOrders] = useState(initialMockOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Toggle Role Function
  const toggleRole = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, role: u.role === 'Admin' ? 'User' : 'Admin' };
      }
      return u;
    }));
  };

  // Toggle Status Function
  const toggleStatus = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' };
      }
      return u;
    }));
  };

  // Quick Order Status Update
  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-[calc(100vh-64px)]">
      
      {/* Sidebar - Desktop & Mobile */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 shrink-0 overflow-x-auto md:overflow-y-auto hide-scrollbar z-10">
        <div className="p-5 hidden md:block">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Admin Panel</h2>
          <p className="text-xs text-teal-600 font-medium mt-1 uppercase tracking-wider">RBAC Management</p>
        </div>
        <nav className="flex md:flex-col gap-2 p-3 md:p-4 min-w-max md:min-w-0">
          {SIDEBAR_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-[10px] text-sm font-medium transition-colors ${
                  isActive 
                  ? 'bg-teal-50 text-teal-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-teal-600' : 'text-gray-400'} />
                {link.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span>Home</span>
              <span>/</span>
              <span className="text-teal-600 font-medium">Admin Dashboard</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {SIDEBAR_LINKS.find(l => l.id === activeTab)?.label || 'System Overview'}
            </h1>
          </div>

          {/* Conditional Stats Overview */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              {GLOBAL_STATS.map((stat, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-5 rounded-[10px] shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                    <p className="text-xl font-bold text-gray-800 mt-0.5">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
              {USER_STATS.map((stat, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-5 rounded-[10px] shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                    <p className="text-xl font-bold text-gray-800 mt-0.5">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              {INVENTORY_STATS.map((stat, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-5 rounded-[10px] shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                    <p className="text-xl font-bold text-gray-800 mt-0.5">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              {ORDER_STATS.map((stat, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-5 rounded-[10px] shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                    <p className="text-xl font-bold text-gray-800 mt-0.5">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* ---------------- DASHBOARD ANALYTICS OVERVIEW ---------------- */}
          {activeTab === 'dashboard' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Main Column (Charts & Tables) */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                
                {/* Revenue Trend Chart */}
                <div className="bg-white p-6 rounded-[10px] shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800 mb-6">Revenue Trend (Last 7 Days)</h2>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dx={-10} tickFormatter={(value) => `Rs.${value/1000}k`} />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={3} dot={{ r: 4, fill: '#0d9488', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-[10px] shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
                    <button onClick={() => setActiveTab('orders')} className="text-sm font-medium text-teal-600 hover:text-teal-700">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                          <th className="px-6 py-4 font-semibold">Order ID</th>
                          <th className="px-6 py-4 font-semibold">Customer</th>
                          <th className="px-6 py-4 font-semibold">Amount</th>
                          <th className="px-6 py-4 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {RECENT_ORDERS.map((order, i) => (
                          <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">{order.id}</td>
                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{order.customer}</td>
                            <td className="px-6 py-4 font-medium text-gray-600 whitespace-nowrap">{order.amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                order.status === 'Delivered' ? 'bg-green-50 text-green-700 border border-green-200/50' :
                                order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border border-blue-200/50' :
                                'bg-amber-50 text-amber-700 border border-amber-200/50'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Side Column */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                
                {/* Low Stock Alerts */}
                <div className="bg-white rounded-[10px] shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <AlertTriangle size={20} className="text-amber-500" />
                      Low Stock Alerts
                    </h2>
                  </div>
                  <div className="p-2">
                    {LOW_STOCK.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-[10px] transition-colors">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                          <p className="text-xs text-red-500 font-bold mt-0.5">{item.left} units left</p>
                        </div>
                        <button className="text-xs font-medium text-teal-600 hover:text-teal-700 bg-teal-50 px-3 py-1.5 rounded-full hover:bg-teal-100 transition-colors border border-transparent">
                          Restock
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Selling Category Doughnut */}
                <div className="bg-white p-6 rounded-[10px] shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800 mb-2">Sales by Category</h2>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#0d9488', '#0ea5e9', '#8b5cf6', '#f59e0b'][index % 4]} />
                          ))}
                        </Pie>
                        <RechartsTooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ---------------- USER MANAGEMENT ---------------- */}
          {activeTab === 'users' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-[10px] shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Header & Add Button */}
              <div className="p-6 border-b border-gray-100 bg-white space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">User Management</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage platform access and roles.</p>
                </div>
                <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-[10px] text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm">
                  <Plus size={18} />
                  Add New User
                </button>
              </div>

              {/* Table Toolbar */}
              <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search users by name or email..." 
                    className="w-full pl-10 pr-4 py-2.5 rounded-[10px] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition-shadow"
                  />
                </div>
                {/* Filter */}
                <div className="relative w-full md:w-48">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter size={16} className="text-gray-400" />
                  </div>
                  <select className="w-full pl-10 pr-8 py-2.5 rounded-[10px] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white appearance-none cursor-pointer transition-shadow">
                    <option value="All">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">User Details</th>
                      <th className="px-6 py-4 font-semibold">Role</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-teal-50/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-gray-800">{user.name}</div>
                          <div className="text-gray-500 text-xs mt-0.5">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'Admin' 
                            ? 'bg-teal-50 text-teal-700 border border-teal-200/50' 
                            : 'bg-gray-100 text-gray-600 border border-gray-200/50'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            user.status === 'Active' 
                            ? 'bg-green-50 text-green-700 border border-green-200/50' 
                            : 'bg-red-50 text-red-700 border border-red-200/50'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => toggleRole(user.id)}
                              className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-[10px] hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 transition-colors flex items-center gap-1.5 shadow-sm"
                              title="Toggle Role"
                            >
                              {user.role === 'Admin' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                              Toggle Role
                            </button>
                            <button 
                              onClick={() => toggleStatus(user.id)}
                              className={`px-3 py-1.5 text-xs font-medium border rounded-[10px] transition-colors flex items-center gap-1.5 shadow-sm ${
                                user.status === 'Active'
                                ? 'text-red-600 bg-white border-red-200 hover:bg-red-50'
                                : 'text-green-600 bg-white border-green-200 hover:bg-green-50'
                              }`}
                              title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                            >
                              {user.status === 'Active' ? <PowerOff size={14} /> : <Power size={14} />}
                              {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-5 border-t border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium text-gray-800">1</span> to <span className="font-medium text-gray-800">5</span> of <span className="font-medium text-gray-800">1,248</span> entries
                </p>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-[10px] text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed">
                    <ChevronLeft size={16} />
                    Prev
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-[10px] bg-teal-50 text-teal-700 font-medium text-sm border border-teal-200">
                    1
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-[10px] text-gray-600 hover:bg-gray-50 text-sm transition-colors">
                    2
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-[10px] text-gray-600 hover:bg-gray-50 text-sm transition-colors">
                    ...
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-[10px] text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

            </motion.div>
          )}

          {/* ---------------- MEDICINES INVENTORY ---------------- */}
          {activeTab === 'inventory' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-[10px] shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Header & Add Button */}
              <div className="p-6 border-b border-gray-100 bg-white space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Medicines Inventory</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your catalog, stock levels, and pricing.</p>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-[10px] text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm"
                >
                  <Plus size={18} />
                  Add New Medicine
                </button>
              </div>

              {/* Table Toolbar */}
              <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search medicines by name or SKU..." 
                    className="w-full pl-10 pr-4 py-2.5 rounded-[10px] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition-shadow"
                  />
                </div>
                {/* Filter */}
                <div className="relative w-full md:w-48">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter size={16} className="text-gray-400" />
                  </div>
                  <select className="w-full pl-10 pr-8 py-2.5 rounded-[10px] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white appearance-none cursor-pointer transition-shadow">
                    <option value="All">All Categories</option>
                    <option value="Derma">Derma</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Pain Relief">Pain Relief</option>
                    <option value="Rx Only">Rx Only</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Product</th>
                      <th className="px-6 py-4 font-semibold">Category</th>
                      <th className="px-6 py-4 font-semibold">Price</th>
                      <th className="px-6 py-4 font-semibold">Stock Level</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {initialMockMedicines.map((med) => (
                      <tr key={med.id} className="hover:bg-teal-50/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-[8px] border border-gray-200 overflow-hidden bg-white shrink-0">
                              <img src={med.image} alt={med.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-semibold text-gray-800">{med.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {med.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                          Rs. {med.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`font-semibold ${med.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                            {med.stock} units
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            med.type === 'Rx Required' 
                            ? 'bg-purple-50 text-purple-700 border border-purple-200/50' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                          }`}>
                            {med.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="w-8 h-8 flex items-center justify-center text-gray-400 bg-white border border-gray-200 rounded-[8px] hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 transition-colors shadow-sm" title="Edit">
                              <Edit2 size={14} />
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center text-gray-400 bg-white border border-gray-200 rounded-[8px] hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm" title="Delete">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-5 border-t border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium text-gray-800">1</span> to <span className="font-medium text-gray-800">5</span> of <span className="font-medium text-gray-800">3,812</span> entries
                </p>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-[10px] text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed">
                    <ChevronLeft size={16} />
                    Prev
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-[10px] bg-teal-50 text-teal-700 font-medium text-sm border border-teal-200">
                    1
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-[10px] text-gray-600 hover:bg-gray-50 text-sm transition-colors">
                    2
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-[10px] text-gray-600 hover:bg-gray-50 text-sm transition-colors">
                    ...
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-[10px] text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

            </motion.div>
          )}

          {/* ---------------- ORDERS MANAGEMENT ---------------- */}
          {activeTab === 'orders' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-[10px] shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 bg-white">
                <h2 className="text-lg font-bold text-gray-800">Order Management</h2>
                <p className="text-sm text-gray-500 mt-1">Track, update, and manage customer orders.</p>
              </div>

              {/* Table Toolbar */}
              <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search by Order ID or Customer Name..." 
                    className="w-full pl-10 pr-4 py-2.5 rounded-[10px] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition-shadow"
                  />
                </div>
                {/* Filter */}
                <div className="relative w-full md:w-48">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter size={16} className="text-gray-400" />
                  </div>
                  <select className="w-full pl-10 pr-8 py-2.5 rounded-[10px] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white appearance-none cursor-pointer transition-shadow">
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Order ID</th>
                      <th className="px-6 py-4 font-semibold">Customer</th>
                      <th className="px-6 py-4 font-semibold">Items</th>
                      <th className="px-6 py-4 font-semibold">Total Amount</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-teal-50/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-gray-800">{order.id}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{order.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {order.itemsCount} items
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                          Rs. {order.total.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200/50' :
                            order.status === 'Processing' ? 'bg-blue-50 text-blue-700 border border-blue-200/50' :
                            order.status === 'Shipped' ? 'bg-teal-50 text-teal-700 border border-teal-200/50' :
                            order.status === 'Delivered' ? 'bg-green-50 text-green-700 border border-green-200/50' :
                            'bg-red-50 text-red-700 border border-red-200/50'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <select 
                              value={order.status}
                              onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                              className="px-2 py-1.5 border border-gray-200 rounded-[8px] text-xs font-medium text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            <button 
                              onClick={() => { setSelectedOrder(order); setIsOrderModalOpen(true); }}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 bg-white border border-gray-200 rounded-[8px] hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 transition-colors shadow-sm" 
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-5 border-t border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium text-gray-800">1</span> to <span className="font-medium text-gray-800">5</span> of <span className="font-medium text-gray-800">4,521</span> entries
                </p>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-[10px] text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed">
                    <ChevronLeft size={16} />
                    Prev
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-[10px] bg-teal-50 text-teal-700 font-medium text-sm border border-teal-200">
                    1
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-[10px] text-gray-600 hover:bg-gray-50 text-sm transition-colors">
                    2
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-[10px] text-gray-600 hover:bg-gray-50 text-sm transition-colors">
                    ...
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-[10px] text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

            </motion.div>
          )}

        </div>
      </main>

      {/* Add Medicine Modal Overlay */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-[10px] shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Add New Medicine</h2>
                <button 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full transition-colors focus:outline-none"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Medicine Name*</label>
                  <input type="text" placeholder="E.g. Panadol Extra 500mg" className="w-full px-4 py-2.5 rounded-[10px] bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (Rs.)*</label>
                    <input type="number" placeholder="0.00" className="w-full px-4 py-2.5 rounded-[10px] bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Initial Stock*</label>
                    <input type="number" placeholder="100" className="w-full px-4 py-2.5 rounded-[10px] bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category*</label>
                  <select className="w-full px-4 py-2.5 rounded-[10px] bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer transition-shadow">
                    <option value="">Select Category</option>
                    <option value="Pain Relief">Pain Relief</option>
                    <option value="Supplements">Supplements</option>
                    <option value="Antibiotics">Antibiotics</option>
                    <option value="Derma">Derma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Image URL</label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-[8px] flex items-center justify-center shrink-0 text-gray-400">
                      <ImageIcon size={20} />
                    </div>
                    <input type="text" placeholder="https://..." className="w-full px-4 py-2.5 rounded-[10px] bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow" />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-purple-50/50 border border-purple-100 rounded-[10px] hover:border-purple-200 transition-colors cursor-pointer">
                  <input type="checkbox" id="rx-required" className="w-4 h-4 text-purple-600 rounded border-purple-300 focus:ring-purple-500 cursor-pointer" />
                  <label htmlFor="rx-required" className="text-sm font-medium text-purple-900 cursor-pointer select-none">
                    Requires Prescription (Rx)
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="px-5 py-2.5 rounded-[10px] text-gray-600 font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-6 py-2.5 bg-teal-600 text-white rounded-[10px] font-medium hover:bg-teal-700 transition-colors shadow-sm">
                  Save Medicine
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Details Modal Overlay */}
      <AnimatePresence>
        {isOrderModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-[10px] shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-gray-800">Order {selectedOrder.id}</h2>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    selectedOrder.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200/50' :
                    selectedOrder.status === 'Processing' ? 'bg-blue-50 text-blue-700 border border-blue-200/50' :
                    selectedOrder.status === 'Shipped' ? 'bg-teal-50 text-teal-700 border border-teal-200/50' :
                    selectedOrder.status === 'Delivered' ? 'bg-green-50 text-green-700 border border-green-200/50' :
                    'bg-red-50 text-red-700 border border-red-200/50'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <button 
                  onClick={() => setIsOrderModalOpen(false)} 
                  className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full transition-colors focus:outline-none"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                
                {/* Customer Info */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Customer Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-[10px] border border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Name</p>
                      <p className="text-sm font-semibold text-gray-800">{selectedOrder.customer}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Contact</p>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-2"><Mail size={14} className="text-gray-400"/> {selectedOrder.email}</span>
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-2"><Phone size={14} className="text-gray-400"/> {selectedOrder.phone}</span>
                      </div>
                    </div>
                    <div className="sm:col-span-2 mt-2">
                      <p className="text-xs text-gray-500 mb-1">Shipping Address</p>
                      <p className="text-sm font-medium text-gray-700 flex items-start gap-2"><MapPin size={14} className="text-gray-400 shrink-0 mt-0.5"/> {selectedOrder.address}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Order Summary</h3>
                  <div className="border border-gray-200 rounded-[10px] overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500">
                        <tr>
                          <th className="px-4 py-3">Product Name</th>
                          <th className="px-4 py-3 text-center">Qty</th>
                          <th className="px-4 py-3 text-right">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {selectedOrder.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-3 text-gray-800 font-medium">{item.name}</td>
                            <td className="px-4 py-3 text-gray-600 text-center">{item.qty}x</td>
                            <td className="px-4 py-3 text-gray-800 font-medium text-right">Rs. {item.price.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50 border-t border-gray-200">
                        <tr>
                          <td colSpan="2" className="px-4 py-3 text-right text-sm font-bold text-gray-600 uppercase tracking-wider">Total Amount:</td>
                          <td className="px-4 py-3 text-right text-base font-bold text-teal-700">Rs. {selectedOrder.total.toLocaleString()}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button 
                  onClick={() => setIsOrderModalOpen(false)} 
                  className="px-5 py-2.5 rounded-[10px] text-gray-600 font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-[10px] font-medium hover:bg-teal-700 transition-colors shadow-sm">
                  <Printer size={18} />
                  Print Invoice
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
