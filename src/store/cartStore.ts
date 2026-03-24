import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/types'

interface CartItem {
  product: Product
  quantity: number
  type: 'box' | 'strip'
}

interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity: number, type: 'box' | 'strip') => void
  removeItem: (productId: string, type?: 'box' | 'strip') => void
  updateQuantity: (productId: string, type: 'box' | 'strip', quantity: number) => void
  clearCart: () => void
  getTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity, type) => {
        const items = get().items
        const existing = items.find(item => item.product.id === product.id && item.type === type)
        if (existing) {
          existing.quantity += quantity
          set({ items: [...items] })
        } else {
          set({ items: [...items, { product, quantity, type }] })
        }
      },
      removeItem: (productId, type) => {
        set({ items: get().items.filter(item => item.product.id !== productId || (type ? item.type !== type : false)) })
      },
      updateQuantity: (productId, type, quantity) => {
        const items = get().items
        const item = items.find(item => item.product.id === productId && item.type === type)
        if (item) {
          item.quantity = quantity
          set({ items: [...items] })
        }
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.type === 'box' ? item.product.price_box : item.product.price_strip
          return total + price * item.quantity
        }, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)