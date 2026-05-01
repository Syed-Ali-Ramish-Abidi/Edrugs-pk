import React from 'react'
import Navbar from './Navbar'
import CategoryNav from './CategoryNav'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <CategoryNav />

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  )
}
