'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Product } from '@/types'
import api from '@/services/api'
import ProductCard from '@/components/product/ProductCard'
import { useCartStore } from '@/store/cartStore'

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const { addItem } = useCartStore()

  useEffect(() => {
    const searchProducts = async () => {
      try {
        if (!query || query.trim().length === 0) {
          console.log('[SearchPage] No query provided')
          setProducts([])
          setLoading(false)
          return
        }

        console.log(`[SearchPage] Searching for: ${query}`)
        setLoading(true)
        setError(null)

        const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`)
        
        if (response.data && Array.isArray(response.data)) {
          console.log(`[SearchPage] Found ${response.data.length} results`)
          setProducts(response.data)
        } else {
          console.warn('[SearchPage] Invalid response format')
          setError('صيغة البيانات غير صحيحة')
          setProducts([])
        }
      } catch (err) {
        console.error('[SearchPage] Search error:', err)
        setError('خطأ في البحث')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    searchProducts()
  }, [query])

  const handleAddToCart = useCallback((product: Product) => {
    console.log(`[SearchPage] Adding to cart: ${product.name}`)
    addItem(product, 1, 'box')
  }, [addItem])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-textSecondary">جاري البحث...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">
        نتائج البحث عن: &quot;{query}&quot;
      </h1>
      <p className="text-textSecondary mb-6">
        {products.length === 0 ? 'لم يتم العثور على منتجات' : `وجدنا ${products.length} منتج`}
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-textSecondary text-lg mb-4">
            للأسف لم نجد ما تبحث عنه
          </p>
          <Link href="/" className="text-primary hover:text-primary/80 font-semibold">
            العودة للرئيسية
          </Link>
        </div>
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