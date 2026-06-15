import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartLine {
  id: string
  name: string
  slug: string
  price: number
  image_url?: string
  quantity: number
}

interface CartStore {
  items: CartLine[]
  add: (item: Omit<CartLine, 'quantity'>, qty?: number) => void
  remove: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
  count: () => number
  total: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + qty } : i,
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity: qty }] }
        }),

      remove: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      setQty: (id, qty) =>
        set((state) => ({
          items: qty <= 0
            ? state.items.filter((i) => i.id !== id)
            : state.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
        })),

      clear: () => set({ items: [] }),

      count: () => get().items.reduce((s, i) => s + i.quantity, 0),

      total: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
    }),
    { name: 'ephesus_cart' },
  ),
)
