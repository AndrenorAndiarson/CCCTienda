import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
export const useCart = () => useContext(CartContext)

const KEY = 'colonial-cart-v1'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load)
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      /* sin almacenamiento: el carrito vive solo en memoria */
    }
  }, [items])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const add = (p) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === p.id)
      if (found) return prev.map((i) => (i.id === p.id ? { ...i, qty: Math.min(i.qty + 1, 99) } : i))
      return [...prev, { id: p.id, name: p.name, price: Number(p.price), image_url: p.image_url, qty: 1 }]
    })
    setToast(`${p.name} agregado al carrito`)
  }
  const setQty = (id, qty) =>
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty: Math.min(qty, 99) } : i))
    )
  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id))
  const clear = () => setItems([])

  const count = useMemo(() => items.reduce((a, i) => a + i.qty, 0), [items])
  const total = useMemo(() => items.reduce((a, i) => a + i.qty * i.price, 0), [items])

  return (
    <CartContext.Provider
      value={{ items, count, total, add, setQty, remove, clear, open, setOpen, toast, setToast }}
    >
      {children}
    </CartContext.Provider>
  )
}
