import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../config/supabaseClient';
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
import { PRODUCT_CATEGORIES } from '../constants/categories';

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

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Refactored States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const [editingId, setEditingId] = useState(null);

  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userSelectedRole, setUserSelectedRole] = useState('All');
  const [usersCurrentPage, setUsersCurrentPage] = useState(1);

  // Overview stats state
  const [totalUsersCount, setTotalUsersCount] = useState(0);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMedicines(data || []);
    } catch (err) {
      console.error("Error fetching medicines:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchAllOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAllOrders(data || []);
    } catch (err) {
      console.error("Error fetching all orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  // --- Overview Logic: fetch total users count and other derived helpers ---
  const fetchOverviewStats = async () => {
    try {
      const { count, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      if (!userError) setTotalUsersCount(count || 0);
    } catch (err) {
      console.error("Error fetching overview stats:", err);
    }
  };

  useEffect(() => {
    fetchMedicines();
    fetchUsers();
    fetchAllOrders();
    fetchOverviewStats();
  }, []);

  // Derived States for Search, Filter, Pagination
  const uniqueCategories = ['All Categories', ...new Set(medicines.map(m => m.category).filter(Boolean))];

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (med.category && med.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All Categories' || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);
  const currentMedicines = filteredMedicines.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Derived Stats
  const totalMedicinesCount = medicines.length;
  const outOfStockCount = medicines.filter(m => m.stock === 0).length;
  const lowStockCount = medicines.filter(m => m.stock > 0 && m.stock <= (m.low_stock_threshold ?? 10)).length;
  const totalCategoriesCount = new Set(medicines.map(m => m.category).filter(Boolean)).size;

  const dynamicInventoryStats = [
    { title: 'Total Medicines', value: totalMedicinesCount.toLocaleString(), icon: Pill, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Low Stock Alerts', value: lowStockCount.toLocaleString(), icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Out of Stock', value: outOfStockCount.toLocaleString(), icon: Package, color: 'text-red-600', bg: 'bg-red-50' },
    { title: 'Total Categories', value: totalCategoriesCount.toLocaleString(), icon: LayoutDashboard, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  // Users Derived States
  const filteredUsers = users.filter(u => {
    const searchLower = userSearchTerm.toLowerCase();
    const matchesSearch = !searchLower || 
                          (u.full_name || '').toLowerCase().includes(searchLower) || 
                          (u.email || '').toLowerCase().includes(searchLower);
    const matchesRole = userSelectedRole === 'All' || 
                        (userSelectedRole === 'Admin' && u.role === 'admin') || 
                        (userSelectedRole === 'User' && u.role === 'user');
    return matchesSearch && matchesRole;
  });

  const usersTotalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice((usersCurrentPage - 1) * itemsPerPage, usersCurrentPage * itemsPerPage);

  // totalUsersCount is fetched via Supabase and stored in state
  const activeAdminsCount = users.filter(u => u.role?.toLowerCase() === 'admin').length;
  const blockedUsersCount = users.filter(u => u.status === 'Inactive').length;

  const dynamicUserStats = [
    { title: 'Total Users', value: totalUsersCount.toLocaleString(), icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Active Admins', value: activeAdminsCount.toLocaleString(), icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Blocked Accounts', value: blockedUsersCount.toLocaleString(), icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50' }
  ];

  // New Medicine State
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    main_category: '',
    sub_category: '',
    item_type: '',
    image_url: '',
    is_rx: false,
    low_stock_threshold: 10
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [allOrders, setAllOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const [ordersSearchTerm, setOrdersSearchTerm] = useState('');
  const [ordersStatusFilter, setOrdersStatusFilter] = useState('All');
  const [ordersCurrentPage, setOrdersCurrentPage] = useState(1);

  const selectedMainCategory = newMedicine.main_category;
  const selectedSubCategory = newMedicine.sub_category;
  const availableSubCategories = selectedMainCategory ? Object.keys(PRODUCT_CATEGORIES[selectedMainCategory]?.subcategories || {}) : [];
  const availableItemTypes = selectedMainCategory && selectedSubCategory
    ? PRODUCT_CATEGORIES[selectedMainCategory]?.subcategories?.[selectedSubCategory] || []
    : [];

  // Derived Orders States
  const filteredOrders = allOrders.filter(o => {
    const searchLower = ordersSearchTerm.toLowerCase();
    const matchesSearch = !searchLower || 
      o.id.toLowerCase().includes(searchLower) || 
      (o.profiles?.full_name || '').toLowerCase().includes(searchLower) ||
      (o.profiles?.email || '').toLowerCase().includes(searchLower);
    
    const matchesStatus = ordersStatusFilter === 'All' || o.status === ordersStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const ordersTotalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((ordersCurrentPage - 1) * itemsPerPage, ordersCurrentPage * itemsPerPage);

  const totalOrdersCount = allOrders.length;
  const pendingOrdersCount = allOrders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
  const shippedOrdersCount = allOrders.filter(o => o.status === 'Shipped').length;
  const deliveredOrdersCount = allOrders.filter(o => o.status === 'Delivered').length;

  const dynamicOrderStats = [
    { title: 'Total Orders', value: totalOrdersCount.toLocaleString(), icon: ShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Pending & Processing', value: pendingOrdersCount.toLocaleString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Shipped', value: shippedOrdersCount.toLocaleString(), icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Delivered', value: deliveredOrdersCount.toLocaleString(), icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' }
  ];

  // --- Derived Overview Analytics ---
  const activeOrdersCount = allOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  const totalRevenue = allOrders
    .filter(o => o.status === 'Delivered')
    .reduce((sum, order) => sum + (Number(order.total_amount || order.total) || 0), 0);

  const totalStock = medicines.reduce((sum, med) => sum + (Number(med.stock) || 0), 0);

  const lowStockItems = medicines
    .filter(med => Number(med.stock) < 10)
    .sort((a, b) => (Number(a.stock) || 0) - (Number(b.stock) || 0))
    .slice(0, 4);

  const recentOrders = allOrders.slice(0, 5);

  const getRevenueTrend = () => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return days.map(day => {
      const dayTotal = allOrders
        .filter(o => (o.status === 'Delivered') && o.created_at && o.created_at.startsWith(day))
        .reduce((sum, o) => sum + (Number(o.total_amount || o.total) || 0), 0);
      // label the day as short weekday
      const label = new Date(day).toLocaleDateString(undefined, { weekday: 'short' });
      return { day: label, amount: dayTotal };
    });
  };

  const chartData = getRevenueTrend().map(d => ({ name: d.day, revenue: d.amount }));

  const overviewStats = [
    { title: 'Total Users', value: totalUsersCount.toLocaleString(), icon: Users2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Active Orders', value: activeOrdersCount.toLocaleString(), icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, icon: CircleDollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Medicines in Stock', value: totalStock.toLocaleString(), icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      if (error) throw error;
      toast.success(`Order ${orderId.substring(0,8)} status updated to ${newStatus}`);
      await fetchAllOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error("Failed to update order status.");
    }
  };

  // Toggle Role Function
  const handleToggleRole = async (userId, currentRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${currentRole?.toLowerCase() === 'admin' ? 'user' : 'admin'}?`)) return;
    try {
      const newRole = currentRole?.toLowerCase() === 'admin' ? 'user' : 'admin';
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
      if (error) throw error;
      await fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle role.");
    }
  };

  // Toggle Status Function
  const handleToggleStatus = async (userId, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus === 'Active' ? 'deactivate' : 'activate'} this user?`)) return;
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      const { error } = await supabase.from('profiles').update({ status: newStatus }).eq('id', userId);
      if (error) throw error;
      await fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle status.");
    }
  };

  // Quick Order Status Update
  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  // Delete Medicine
  const handleDeleteMedicine = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) return;
    try {
      const { error } = await supabase.from('medicines').delete().eq('id', id);
      if (error) throw error;
      setMedicines(medicines.filter(m => m.id !== id));
      
      // If deleting the last item on a page, handle pagination logic correctly
      const newFiltered = filteredMedicines.filter(m => m.id !== id);
      if (currentMedicines.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error("Error deleting medicine:", err);
      toast.error("Failed to delete medicine.");
    }
  };

  // Open Edit Modal
  const handleEditMedicine = (med) => {
    setEditingId(med.id);
    setNewMedicine({
      name: med.name,
      price: med.price,
      stock: med.stock,
      category: med.category,
      main_category: med.main_category || '',
      sub_category: med.sub_category || '',
      item_type: med.item_type || '',
      image_url: med.image_url || '',
      is_rx: med.is_rx,
      low_stock_threshold: med.low_stock_threshold ?? 10
    });
    setIsAddModalOpen(true);
  };

  // Add or Update Medicine to Supabase
  const handleSaveMedicine = async () => {
    if (!newMedicine.name || !newMedicine.price || !newMedicine.stock || !newMedicine.main_category || !newMedicine.sub_category) {
      toast.error("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: newMedicine.name,
        price: parseFloat(newMedicine.price),
        stock: Number(newMedicine.stock),
        category: newMedicine.main_category,
        main_category: newMedicine.main_category,
        sub_category: newMedicine.sub_category,
        item_type: newMedicine.item_type || null,
        image_url: newMedicine.image_url ? String(newMedicine.image_url).trim() : null,
        is_rx: Boolean(newMedicine.is_rx),
        low_stock_threshold: Number(newMedicine.low_stock_threshold || 10)
      };

      console.log("Saving payload:", payload);

      if (editingId) {
        const { error } = await supabase.from('medicines').update(payload).eq('id', editingId);
        if (error) {
          console.error("Supabase Detailed Error:", error.message);
          console.error("Error Hint:", error.hint);
          console.error("Error Details:", error.details);
          throw error;
        }
      } else {
        const { error } = await supabase.from('medicines').insert([payload]);
        if (error) {
          console.error("Supabase Detailed Error:", error.message);
          console.error("Error Hint:", error.hint);
          console.error("Error Details:", error.details);
          throw error;
        }
      }

      // Success
      setNewMedicine({ name: '', price: '', stock: '', category: '', main_category: '', sub_category: '', item_type: '', image_url: '', is_rx: false, low_stock_threshold: 10 });
      setEditingId(null);
      setIsAddModalOpen(false);
      
      await fetchMedicines();
      toast.success(editingId ? "Medicine updated successfully!" : "Medicine added successfully!");

    } catch (error) {
      console.error("Error saving medicine:", error);
      toast.error("Failed to save medicine. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log("Database Role for Ali:", users.find(u => u.full_name === 'Ali Ramish')?.role);

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
                className={`flex items-center gap-3 px-4 py-3 rounded-[10px] text-sm font-medium transition-colors ${isActive
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
              {overviewStats.map((stat, idx) => (
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
              {dynamicUserStats.map((stat, idx) => (
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
              {dynamicInventoryStats.map((stat, idx) => (
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
              {dynamicOrderStats.map((stat, idx) => (
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
                      <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} tickFormatter={(value) => `Rs.${value / 1000}k`} />
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
                        {recentOrders.map((order, i) => (
                          <tr key={order.id || i} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">{order.id}</td>
                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{order.profiles?.full_name || order.customer || 'Unknown'}</td>
                            <td className="px-6 py-4 font-medium text-gray-600 whitespace-nowrap">{`Rs. ${Number(order.total_amount || order.total || 0).toLocaleString()}`}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border border-green-200/50' :
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
                    {lowStockItems.length === 0 ? (
                      <div className="p-4 text-sm text-gray-500">No low stock items.</div>
                    ) : (
                      lowStockItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-[10px] transition-colors">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                            <p className="text-xs text-red-500 font-bold mt-0.5">{Number(item.stock || 0)} units left</p>
                          </div>
                          <button className="text-xs font-medium text-teal-600 hover:text-teal-700 bg-teal-50 px-3 py-1.5 rounded-full hover:bg-teal-100 transition-colors border border-transparent">
                            Restock
                          </button>
                        </div>
                      ))
                    )}
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
              {/* Header */}
              <div className="p-6 border-b border-gray-100 bg-white space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">User Management</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage platform access and roles.</p>
                </div>
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
                    value={userSearchTerm}
                    onChange={(e) => { setUserSearchTerm(e.target.value); setUsersCurrentPage(1); }}
                    placeholder="Search users by name or email..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-[10px] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition-shadow"
                  />
                </div>
                {/* Filter */}
                <div className="relative w-full md:w-48">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter size={16} className="text-gray-400" />
                  </div>
                  <select 
                    value={userSelectedRole}
                    onChange={(e) => { setUserSelectedRole(e.target.value); setUsersCurrentPage(1); }}
                    className="w-full pl-10 pr-8 py-2.5 rounded-[10px] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white appearance-none cursor-pointer transition-shadow"
                  >
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
                    {usersLoading ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500 font-medium">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                            Loading users...
                          </div>
                        </td>
                      </tr>
                    ) : currentUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                          No users found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      currentUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-teal-50/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-semibold text-gray-800">{user.full_name || 'No Name'}</div>
                            <div className="text-gray-500 text-xs mt-0.5">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${user.role?.toLowerCase() === 'admin'
                                ? 'bg-teal-50 text-teal-700 border border-teal-200/50'
                                : 'bg-gray-100 text-gray-600 border border-gray-200/50'
                              }`}>
                              {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase() : 'User'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${user.status === 'Active'
                                ? 'bg-green-50 text-green-700 border border-green-200/50'
                                : 'bg-red-50 text-red-700 border border-red-200/50'
                              }`}>
                              {user.status || 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleToggleRole(user.id, user.role)}
                                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-[10px] hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 transition-colors flex items-center gap-1.5 shadow-sm"
                                title="Toggle Role"
                              >
                                {user.role?.toLowerCase() === 'admin' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                                Toggle Role
                              </button>
                              <button
                                onClick={() => handleToggleStatus(user.id, user.status || 'Active')}
                                className={`px-3 py-1.5 text-xs font-medium border rounded-[10px] transition-colors flex items-center gap-1.5 shadow-sm ${user.status === 'Active' || !user.status
                                    ? 'text-red-600 bg-white border-red-200 hover:bg-red-50'
                                    : 'text-green-600 bg-white border-green-200 hover:bg-green-50'
                                  }`}
                                title={user.status === 'Active' || !user.status ? 'Deactivate' : 'Activate'}
                              >
                                {user.status === 'Active' || !user.status ? <PowerOff size={14} /> : <Power size={14} />}
                                {user.status === 'Active' || !user.status ? 'Deactivate' : 'Activate'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredUsers.length > 0 && (
                <div className="p-5 border-t border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-500">
                    Showing <span className="font-medium text-gray-800">{(usersCurrentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-gray-800">{Math.min(usersCurrentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="font-medium text-gray-800">{filteredUsers.length}</span> entries
                  </p>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setUsersCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={usersCurrentPage === 1}
                      className={`flex items-center gap-1 px-3 py-1.5 border rounded-[10px] text-sm font-medium transition-colors ${usersCurrentPage === 1 ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      <ChevronLeft size={16} />
                      Prev
                    </button>
                    
                    {filteredUsers.length > itemsPerPage && (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(usersTotalPages, 5) }).map((_, idx) => {
                          let pageNum = idx + 1;
                          if (usersTotalPages > 5 && usersCurrentPage > 3) {
                            pageNum = usersCurrentPage - 2 + idx;
                            if (pageNum > usersTotalPages) pageNum = usersTotalPages - (4 - idx);
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setUsersCurrentPage(pageNum)}
                              className={`w-8 h-8 flex items-center justify-center rounded-[10px] text-sm font-medium transition-colors ${
                                usersCurrentPage === pageNum
                                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                                  : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <button 
                      onClick={() => setUsersCurrentPage(prev => Math.min(prev + 1, usersTotalPages))}
                      disabled={usersCurrentPage === usersTotalPages}
                      className={`flex items-center gap-1 px-3 py-1.5 border rounded-[10px] text-sm font-medium transition-colors ${usersCurrentPage === usersTotalPages ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

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
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    placeholder="Search medicines by name or SKU..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-[10px] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition-shadow"
                  />
                </div>
                {/* Filter */}
                <div className="relative w-full md:w-48">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter size={16} className="text-gray-400" />
                  </div>
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-10 pr-8 py-2.5 rounded-[10px] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white appearance-none cursor-pointer transition-shadow"
                  >
                    {uniqueCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Product</th>
                      <th className="px-6 py-4 font-semibold">Category</th>
                      <th className="px-6 py-4 font-semibold">Date Added</th>
                      <th className="px-6 py-4 font-semibold">Price</th>
                      <th className="px-6 py-4 font-semibold">Stock Level</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500 font-medium">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                            Loading medicines...
                          </div>
                        </td>
                      </tr>
                    ) : currentMedicines.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                          No medicines found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      currentMedicines.map((med) => (
                        <tr key={med.id} className="hover:bg-teal-50/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-[8px] border border-gray-200 overflow-hidden bg-white shrink-0">
                                <img src={med.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=50&h=50&fit=crop'} alt={med.name} className="w-full h-full object-cover" />
                              </div>
                              <span className="font-semibold text-gray-800">{med.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {med.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {med.created_at ? new Date(med.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                            Rs. {med.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`font-semibold ${med.stock === 0 ? 'text-red-600' : med.stock <= (med.low_stock_threshold ?? 10) ? 'text-amber-600' : 'text-green-600'}`}>
                              {med.stock} units
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                med.stock === 0 ? 'bg-red-50 text-red-700 border border-red-200/50' :
                                med.stock <= (med.low_stock_threshold ?? 10) ? 'bg-amber-50 text-amber-700 border border-amber-200/50' :
                                'bg-green-50 text-green-700 border border-green-200/50'
                              }`}>
                              {med.stock === 0 ? 'Out of Stock' : med.stock <= (med.low_stock_threshold ?? 10) ? 'Low Stock' : 'In Stock'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleEditMedicine(med)}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 bg-white border border-gray-200 rounded-[8px] hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 transition-colors shadow-sm" title="Edit">
                                <Edit2 size={14} />
                              </button>
                              <button 
                                onClick={() => handleDeleteMedicine(med.id)}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 bg-white border border-gray-200 rounded-[8px] hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm" title="Delete">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredMedicines.length > 0 && (
                <div className="p-5 border-t border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-500">
                    Showing <span className="font-medium text-gray-800">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-gray-800">{Math.min(currentPage * itemsPerPage, filteredMedicines.length)}</span> of <span className="font-medium text-gray-800">{filteredMedicines.length}</span> entries
                  </p>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-1 px-3 py-1.5 border rounded-[10px] text-sm font-medium transition-colors ${currentPage === 1 ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      <ChevronLeft size={16} />
                      Prev
                    </button>
                    
                    {filteredMedicines.length > itemsPerPage && (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                          let pageNum = idx + 1;
                          if (totalPages > 5 && currentPage > 3) {
                            pageNum = currentPage - 2 + idx;
                            if (pageNum > totalPages) pageNum = totalPages - (4 - idx);
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-8 h-8 flex items-center justify-center rounded-[10px] text-sm font-medium transition-colors ${
                                currentPage === pageNum
                                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                                  : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`flex items-center gap-1 px-3 py-1.5 border rounded-[10px] text-sm font-medium transition-colors ${currentPage === totalPages ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

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
                    value={ordersSearchTerm}
                    onChange={(e) => { setOrdersSearchTerm(e.target.value); setOrdersCurrentPage(1); }}
                    placeholder="Search by Order ID or Customer Name..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-[10px] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition-shadow"
                  />
                </div>
                {/* Filter */}
                <div className="relative w-full md:w-48">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter size={16} className="text-gray-400" />
                  </div>
                  <select 
                    value={ordersStatusFilter}
                    onChange={(e) => { setOrdersStatusFilter(e.target.value); setOrdersCurrentPage(1); }}
                    className="w-full pl-10 pr-8 py-2.5 rounded-[10px] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white appearance-none cursor-pointer transition-shadow"
                  >
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
                    {ordersLoading ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500 font-medium">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                            Loading orders...
                          </div>
                        </td>
                      </tr>
                    ) : paginatedOrders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                          No orders found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      paginatedOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-teal-50/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-semibold text-gray-800">{order.id.substring(0, 8).toUpperCase()}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{new Date(order.created_at).toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            <div className="font-medium text-gray-800">{order.profiles?.full_name || 'N/A'}</div>
                            <div className="text-xs text-gray-500">{order.profiles?.email || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {order.items?.reduce((acc, item) => acc + item.qty, 0) || 0} items
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                            Rs. {order.total_amount?.toLocaleString() || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200/50' :
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
                                value={order.status || 'Pending'}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredOrders.length > 0 && (
                <div className="p-5 border-t border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-500">
                    Showing <span className="font-medium text-gray-800">{(ordersCurrentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-gray-800">{Math.min(ordersCurrentPage * itemsPerPage, filteredOrders.length)}</span> of <span className="font-medium text-gray-800">{filteredOrders.length}</span> entries
                  </p>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setOrdersCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={ordersCurrentPage === 1}
                      className={`flex items-center gap-1 px-3 py-1.5 border rounded-[10px] text-sm font-medium transition-colors ${ordersCurrentPage === 1 ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      <ChevronLeft size={16} />
                      Prev
                    </button>
                    
                    {filteredOrders.length > itemsPerPage && (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(ordersTotalPages, 5) }).map((_, idx) => {
                          let pageNum = idx + 1;
                          if (ordersTotalPages > 5 && ordersCurrentPage > 3) {
                            pageNum = ordersCurrentPage - 2 + idx;
                            if (pageNum > ordersTotalPages) pageNum = ordersTotalPages - (4 - idx);
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setOrdersCurrentPage(pageNum)}
                              className={`w-8 h-8 flex items-center justify-center rounded-[10px] text-sm font-medium transition-colors ${
                                ordersCurrentPage === pageNum
                                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                                  : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <button 
                      onClick={() => setOrdersCurrentPage(prev => Math.min(prev + 1, ordersTotalPages))}
                      disabled={ordersCurrentPage === ordersTotalPages}
                      className={`flex items-center gap-1 px-3 py-1.5 border rounded-[10px] text-sm font-medium transition-colors ${ordersCurrentPage === ordersTotalPages ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

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
                <h2 className="text-lg font-bold text-gray-800">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                <button
                  onClick={() => { setIsAddModalOpen(false); setEditingId(null); setNewMedicine({ name: '', price: '', stock: '', category: '', main_category: '', sub_category: '', item_type: '', image_url: '', is_rx: false, low_stock_threshold: 10 }); }}
                  className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full transition-colors focus:outline-none"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Medicine Name*</label>
                  <input type="text" value={newMedicine.name} onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })} placeholder="E.g. Panadol Extra 500mg" className="w-full px-4 py-2.5 rounded-[10px] bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (Rs.)*</label>
                    <input type="number" value={newMedicine.price} onChange={(e) => setNewMedicine({ ...newMedicine, price: e.target.value })} placeholder="0.00" className="w-full px-4 py-2.5 rounded-[10px] bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Initial Stock*</label>
                    <input type="number" value={newMedicine.stock} onChange={(e) => setNewMedicine({ ...newMedicine, stock: e.target.value })} placeholder="100" className="w-full px-4 py-2.5 rounded-[10px] bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Low Stock Alert Value</label>
                    <input type="number" value={newMedicine.low_stock_threshold} onChange={(e) => setNewMedicine({ ...newMedicine, low_stock_threshold: e.target.value })} placeholder="10" className="w-full px-4 py-2.5 rounded-[10px] bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Main Category*</label>
                  <select
                    value={newMedicine.main_category}
                    onChange={(e) => setNewMedicine({ ...newMedicine, main_category: e.target.value, sub_category: '', item_type: '', category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-[10px] bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer transition-shadow"
                  >
                    <option value="">Select Main Category</option>
                    {Object.keys(PRODUCT_CATEGORIES).map((mainCategory) => (
                      <option key={mainCategory} value={mainCategory}>{mainCategory}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Sub-Category*</label>
                    <select
                      value={newMedicine.sub_category}
                      onChange={(e) => setNewMedicine({ ...newMedicine, sub_category: e.target.value, item_type: '' })}
                      disabled={!selectedMainCategory}
                      className="w-full px-4 py-2.5 rounded-[10px] bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer transition-shadow disabled:cursor-not-allowed disabled:bg-gray-100"
                    >
                      <option value="">Select Sub-Category</option>
                      {availableSubCategories.map((subCategory) => (
                        <option key={subCategory} value={subCategory}>{subCategory}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Specific Type (Optional)</label>
                    <select
                      value={newMedicine.item_type}
                      onChange={(e) => setNewMedicine({ ...newMedicine, item_type: e.target.value })}
                      disabled={!availableItemTypes.length}
                      className="w-full px-4 py-2.5 rounded-[10px] bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer transition-shadow disabled:cursor-not-allowed disabled:bg-gray-100"
                    >
                      <option value="">{availableItemTypes.length ? 'Select Specific Type' : 'No specific type available'}</option>
                      {availableItemTypes.map((itemType) => (
                        <option key={itemType} value={itemType}>{itemType}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Image URL</label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-[8px] flex items-center justify-center shrink-0 text-gray-400">
                      <ImageIcon size={20} />
                    </div>
                    <input type="text" value={newMedicine.image_url} onChange={(e) => setNewMedicine({ ...newMedicine, image_url: e.target.value })} placeholder="https://..." className="w-full px-4 py-2.5 rounded-[10px] bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow" />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-purple-50/50 border border-purple-100 rounded-[10px] hover:border-purple-200 transition-colors cursor-pointer">
                  <input type="checkbox" id="rx-required" checked={newMedicine.is_rx} onChange={(e) => setNewMedicine({ ...newMedicine, is_rx: e.target.checked })} className="w-4 h-4 text-purple-600 rounded border-purple-300 focus:ring-purple-500 cursor-pointer" />
                  <label htmlFor="rx-required" className="text-sm font-medium text-purple-900 cursor-pointer select-none">
                    Requires Prescription (Rx)
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={() => { setIsAddModalOpen(false); setEditingId(null); setNewMedicine({ name: '', price: '', stock: '', category: '', main_category: '', sub_category: '', item_type: '', image_url: '', is_rx: false, low_stock_threshold: 10 }); }}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-[10px] text-gray-600 font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMedicine}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-teal-600 text-white rounded-[10px] font-medium hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save Product'}
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
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${selectedOrder.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200/50' :
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
                      <p className="text-sm font-semibold text-gray-800">{selectedOrder.profiles?.full_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Contact</p>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-2"><Mail size={14} className="text-gray-400" /> {selectedOrder.profiles?.email || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Delivery Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-[10px] border border-gray-200">
                    <div className="sm:col-span-2">
                      <p className="text-xs text-gray-500 mb-1">Address</p>
                      <p className="text-sm font-medium text-gray-800">{selectedOrder.delivery_address || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                      <p className="text-sm font-medium text-gray-800">{selectedOrder.payment_method === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'}</p>
                    </div>
                  </div>
                </div>

                {/* Prescription (if any) */}
                {selectedOrder.prescription_url && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Prescription</h3>
                    <div className="bg-gray-50 p-4 rounded-[10px] border border-gray-200 flex items-center justify-between">
                      <p className="text-sm text-gray-700">A prescription has been uploaded for this order.</p>
                      <button onClick={() => window.open(selectedOrder.prescription_url, '_blank')} className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm px-3 py-2 rounded">
                        <Eye size={16} /> View Prescription
                      </button>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Order Items</h3>
                  <div className="bg-white border border-gray-200 rounded-[10px] overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                        <tr>
                          <th className="px-4 py-2.5 font-medium">Item</th>
                          <th className="px-4 py-2.5 font-medium text-center">Qty</th>
                          <th className="px-4 py-2.5 font-medium text-right">Price</th>
                          <th className="px-4 py-2.5 font-medium text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {(selectedOrder.items || []).map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                            <td className="px-4 py-3 text-center text-gray-600">{item.qty}</td>
                            <td className="px-4 py-3 text-right text-gray-600">Rs. {item.price.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right font-medium text-gray-800">Rs. {(item.price * item.qty).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50 border-t border-gray-200">
                        <tr>
                          <td colSpan="3" className="px-4 py-3 text-right font-medium text-gray-600">Subtotal</td>
                          <td className="px-4 py-3 text-right font-bold text-gray-800">
                            Rs. {selectedOrder.items?.reduce((acc, it) => acc + it.price * it.qty, 0).toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="3" className="px-4 py-3 text-right font-medium text-gray-600">Shipping</td>
                          <td className="px-4 py-3 text-right font-bold text-gray-800">
                            Rs. {150}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="3" className="px-4 py-3 text-right font-bold text-gray-800 text-base">Total Amount</td>
                          <td className="px-4 py-3 text-right font-bold text-teal-700 text-base">Rs. {selectedOrder.total_amount?.toLocaleString()}</td>
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
                  className="px-6 py-2.5 bg-gray-800 text-white rounded-[10px] font-medium hover:bg-gray-900 transition-colors shadow-sm"
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
