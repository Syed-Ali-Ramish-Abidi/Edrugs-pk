import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ChatbotWidget from './components/ChatbotWidget'
import Home from './pages/Home' // Testing which component breaks the app
import { CartProvider } from './context/CartContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
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
  isAuthenticated: false, // change to true to test protected pages
  user: { role: 'user' }, // role: 'user' | 'admin'
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
          {/* Public routes (wrapped in Layout) */}
          <Route path="/" element={<Layout><Home /></Layout>} />
        </Routes>

        {/* Chat widget present globally */}
        <ChatbotWidget />
      </CartProvider>
    </BrowserRouter>
  )
}