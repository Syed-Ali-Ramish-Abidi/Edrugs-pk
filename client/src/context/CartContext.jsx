import React, { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  function addItem(product, qty = 1) {
    setItems((prev) => {
      const found = prev.find((p) => p.id === product.id)
      if (found) return prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + qty } : p))
      return [...prev, { ...product, qty }]
    })
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }

  function updateQty(id, qty) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)))
  }

  function clearCart() {
    setItems([])
  }

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.qty, 0), [items])
  const hasPrescriptionItem = useMemo(() => items.some((it) => it.requiresPrescription), [items])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, subtotal, hasPrescriptionItem }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
