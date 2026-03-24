'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types'
import api from '@/services/api'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface CartItem {
  product: Product
  quantity: number
  type: 'box' | 'strip'
}

export default function CashierPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get('/products')
        setProducts(response.data)
      } catch (error) {
        console.error('Failed to load products', error)
      }
    }
    loadProducts()
  }, [])

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [searchTerm, products])

  const addToCart = (product: Product, type: 'box' | 'strip') => {
    const existing = cart.find(item => item.product.id === product.id && item.type === type)
    if (existing) {
      existing.quantity += 1
      setCart([...cart])
    } else {
      setCart([...cart, { product, quantity: 1, type }])
    }
    setSearchTerm('')
    setSuggestions([])
  }

  const updateQuantity = (productId: string, type: 'box' | 'strip', quantity: number) => {
    const item = cart.find(item => item.product.id === productId && item.type === type)
    if (item) {
      item.quantity = quantity
      setCart([...cart])
    }
  }

  const removeFromCart = (productId: string, type: 'box' | 'strip') => {
    setCart(cart.filter(item => item.product.id !== productId || item.type !== type))
  }

  const getUnitPrice = (item: CartItem) => {
    const computedStripPrice = item.product.strips_per_box > 0
      ? Number((item.product.price_box / item.product.strips_per_box).toFixed(2))
      : item.product.price_strip
    return item.type === 'box' ? item.product.price_box : computedStripPrice
  }

  const getTotal = () => {
    return cart.reduce((total, item) => {
      const price = getUnitPrice(item)
      return total + price * item.quantity
    }, 0)
  }

  const printReceipt = () => {
    const receipt = `
صيدلية عبد الكريم

${cart.map(item => {
  const unitPrice = getUnitPrice(item)
  return `${item.product.name} - ${item.quantity} ${item.type === 'box' ? 'علبة' : 'شريط'} x ${unitPrice} ج.م = ${unitPrice * item.quantity} ج.م`
}).join('\n')}

الإجمالي: ${getTotal()} ج.م

تشرفنا بزيارتكم
    `.trim()

    console.log(receipt) // In real app, this would trigger print
    alert('تم طباعة الفاتورة')
    setCart([])
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Search and Add Section */}
        <div className="bg-surface p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">البحث والإضافة</h2>

          <div className="relative mb-4">
            <Input
              placeholder="ابحث عن الدواء..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-lg mt-1 z-10">
                {suggestions.map((product) => (
                  <div key={product.id} className="p-2 border-b border-gray-100 last:border-b-0">
                    <div className="font-semibold">{product.name}</div>
                    <div className="flex gap-2 mt-1">
                      <Button
                        size="sm"
                        onClick={() => addToCart(product, 'box')}
                      >
                        علبة ({product.price_box} ج.م)
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => addToCart(product, 'strip')}
                      >
                        شريط ({product.price_strip} ج.م)
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cart Section */}
        <div className="bg-surface p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">السلة</h2>

          {cart.length === 0 ? (
            <p className="text-textSecondary">السلة فارغة</p>
          ) : (
            <div className="space-y-2 mb-4">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-background rounded-2xl">
                  <div>
                    <div className="font-semibold">{item.product.name}</div>
                    <div className="text-sm text-textSecondary">
                      {item.type === 'box' ? 'علبة' : 'شريط'} - {getUnitPrice(item)} ج.م (سيولة من العلبة)
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.product.id, item.type, parseInt(e.target.value) || 1)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded-2xl text-center"
                    />
                    <span className="font-semibold">
                      {getUnitPrice(item) * item.quantity} ج.م
                    </span>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-danger hover:text-danger/80"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t pt-4">
            <div className="text-xl font-bold mb-4">الإجمالي: {getTotal()} ج.م</div>
            <Button onClick={printReceipt} className="w-full" disabled={cart.length === 0}>
              طباعة الفاتورة
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}