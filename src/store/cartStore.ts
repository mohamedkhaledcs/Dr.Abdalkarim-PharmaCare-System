import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/types'

interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const items = [...get().items]
        const existingInfo = items.findIndex(item => item.product.id === product.id)
        if (existingInfo !== -1) {
          items[existingInfo].quantity += quantity
          set({ items })
        } else {
          set({ items: [...items, { product, quantity }] })
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter(item => item.product.id !== productId) })
      },
      updateQuantity: (productId, quantity) => {
        const items = [...get().items]
        const itemIndex = items.findIndex(item => item.product.id === productId)
        if (itemIndex !== -1) {
          items[itemIndex].quantity = quantity
          set({ items })
        }
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => {
          return total + (item.product.price_box || 0) * item.quantity
        }, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)