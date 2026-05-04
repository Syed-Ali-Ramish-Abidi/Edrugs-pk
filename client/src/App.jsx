import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ChatbotWidget from './components/ChatbotWidget'
import Home from './pages/Home'
import { CartProvider } from './context/CartContext'

// Import correctly from the components directory where you edited them
import Login from './components/Login'
import Signup from './components/Signup'
import UserProfile from './components/UserProfile'

// Other pages
import MedicinesCatalog from './pages/MedicinesCatalog'
import MedicineDetail from './pages/MedicineDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'

/*
  App routing:
  - Public pages are wrapped with <Layout> so Navbar/CategoryNav/Footer are present.
  - Protected route placeholders use simple mock auth checks (replace with real auth).
  - 404 Not Found route included.
*/

// Mock auth placeholder (replace with real auth logic)
const mockAuth = {
  isAuthenticated: true, // change to true to test protected pages
  user: { role: 'admin' }, // role: 'user' | 'admin'
}

// Simple protected route wrapper
function RequireAuth({ children }) {
  if (!mockAuth.isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

// Simple admin-only wrapper
function RequireAdmin({ children }) {
  if (!mockAuth.isAuthenticated || mockAuth.user.role !== 'admin') {
    return <Navigate to="/" replace />
  }
  return children
}

function NotFound() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-slate-800 mb-2">404 — Page Not Found</h1>
          <p className="text-slate-600 mb-4">The page you tried does not exist.</p>
          <a href="/" className="px-4 py-2 bg-teal-600 text-white rounded-[10px] hover:bg-teal-700">Go Home</a>
        </div>
      </div>
    </Layout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          
          {/* Authentication Routes */}
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/signup" element={<Layout><Signup /></Layout>} />
          <Route path="/profile" element={<Layout><UserProfile /></Layout>} />

          {/* E-commerce Routes */}
          <Route path="/medicines" element={<Layout><MedicinesCatalog /></Layout>} />
          <Route path="/medicines/:id" element={<Layout><MedicineDetail /></Layout>} />
          <Route path="/cart" element={<Layout><Cart /></Layout>} />
          <Route path="/checkout" element={<Layout><Checkout /></Layout>} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<RequireAuth><Layout><UserDashboard /></Layout></RequireAuth>} />
          <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Chat widget present globally */}
        <ChatbotWidget />
      </CartProvider>
    </BrowserRouter>
  )
}