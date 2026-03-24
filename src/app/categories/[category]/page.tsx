'use client'

import { useState, useEffect, useCallback } from 'react'
import { Product } from '@/types'
import api from '@/services/api'
import ProductCard from '@/components/product/ProductCard'
import { useCartStore } from '@/store/cartStore'
import Card from '@/components/ui/Card'

interface CategoryPageProps {
  params: { category: string }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addItem } = useCartStore()
  const category = decodeURIComponent(params.category)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log(`[Category] Loading products for category: ${category}`)
        setLoading(true)
        setError(null)
        const response = await api.get('/products')
        
        const filtered = response.data.filter((product: Product) =>
          product.category.toLowerCase() === category.toLowerCase()
        )
        
        console.log(`[Category] Found ${filtered.length} products in category: ${category}`)
        setProducts(filtered)
      } catch (err) {
        console.error('[Category] Error loading products:', err)
        setError('خطأ في تحميل المنتجات')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [category])

  const handleAddToCart = useCallback((product: Product) => {
    console.log(`[Category] Adding to cart: ${product.name}`)
    addItem(product, 1, 'box')
  }, [addItem])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-textSecondary">جاري تحميل المنتجات...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="text-center py-8">
          <p className="text-danger">{error}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-textPrimary mb-2">📂 {category}</h1>
        <p className="text-textSecondary">
          {products.length === 0 ? 'لا توجد منتجات' : `عدد المنتجات: ${products.length}`}
        </p>
      </div>

      {products.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-textSecondary text-lg">للأسف، لا توجد منتجات في هذه الفئة</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="h-full">
              <ProductCard 
                product={product}
                onAddToCart={handleAddToCart}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}