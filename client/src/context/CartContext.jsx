import React, { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  function addToCart(product, qty = 1) {
    setCart((prev) => {
      const found = prev.find((p) => p.id === product.id)
      if (found) return prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + qty } : p))
      return [...prev, { ...product, qty }]
    })
  }

  function removeItem(id) {
    setCart((prev) => prev.filter((p) => p.id !== id))
  }

  function updateQty(id, qty) {
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)))
  }

  function clearCart() {
    setCart([])
  }

  const totalAmount = useMemo(() => cart.reduce((s, it) => s + it.price * it.qty, 0), [cart])
  const totalItems = useMemo(() => cart.reduce((s, it) => s + it.qty, 0), [cart])
  const hasPrescriptionItem = useMemo(() => cart.some((it) => it.is_rx), [cart])

  return (
    <CartContext.Provider value={{ cart, addToCart, removeItem, updateQty, clearCart, totalAmount, totalItems, hasPrescriptionItem }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
