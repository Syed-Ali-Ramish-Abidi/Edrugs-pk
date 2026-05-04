import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Search, ShoppingCart, User, ChevronDown, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SearchComponent from './SearchComponent'
import CategoryNav from './CategoryNav'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const { items } = useCart()
  const cartCount = items.length
  const isAuthenticated = false

  return (
    <header className="sticky top-0 z-[120] bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 shrink-0">
            <span className="text-xl font-bold text-teal-700">Edrugs</span>
            <span className="text-xl font-bold text-gray-800">.pk</span>
          </Link>

          {/* Search - desktop */}
          <div className="flex-1 flex justify-center px-6 max-w-2xl mx-auto">
            <div className="w-full hidden md:block">
              <SearchComponent />
            </div>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            {/* Mobile search icon */}
            <button className="md:hidden p-2 text-gray-600 hover:text-teal-700 transition-colors">
              <Search size={20} />
            </button>

            {/* Cart */}
            <NavLink
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-teal-700 transition-colors"
              title="Shopping Cart"
            >
              <ShoppingCart size={22} />
              <span className="absolute -top-0.5 -right-0.5 bg-teal-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount > 0 ? cartCount : '0'}
              </span>
            </NavLink>

            {/* User */}
            <div className="relative">
              <button
                onClick={() => setUserOpen(v => !v)}
                className="flex items-center gap-1 p-2 text-gray-700 hover:text-teal-700 transition-colors"
                aria-haspopup="true"
                aria-expanded={userOpen}
              >
                <User size={22} />
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              <AnimatePresence>
                {userOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-20"
                  >
                    {isAuthenticated ? (
                      <>
                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                        <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Orders</Link>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <LogOut size={14} /> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Sign In</Link>
                        <Link to="/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Create Account</Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-teal-700 transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-out */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed inset-0 z-50 bg-white"
          >
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
              <Link to="/" className="flex items-center gap-1">
                <span className="text-xl font-bold text-teal-700">Edrugs</span>
                <span className="text-xl font-bold text-gray-800">.pk</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2">
                <X size={22} />
              </button>
            </div>

            <div className="p-4">
              <SearchComponent />
            </div>

            <nav className="px-4 py-2 space-y-1">
              <NavLink to="/" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium">Home</NavLink>
              
              {/* Category Mega Menu - Mobile Accordion */}
              <CategoryNav isMobile={true} />

              <NavLink to="/contact" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium">Contact</NavLink>
              <NavLink to="/about" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium">About</NavLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
