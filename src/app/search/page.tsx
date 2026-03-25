'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Product } from '@/types'
import { productService } from '@/services/productService'
import ProductCard from '@/components/product/ProductCard'
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton'
import EmptyState from '@/components/ui/EmptyState'
import { useCartStore } from '@/store/cartStore'

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''
  const { addItem } = useCartStore()

  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        if (!query || query.trim().length === 0) {
          setProducts([])
          setLoading(false)
          return
        }

        setLoading(true)
        setError(null)

        const results = await productService.searchProducts(query)
        if (results && Array.isArray(results)) {
          setProducts(results)
        } else {
          setProducts([])
          setError('صيغة البيانات غير صحيحة')
        }
      } catch (err) {
        console.error('[SearchPage] Search error:', err)
        setError('حدث خطأ أثناء البحث، يرجى المحاولة لاحقاً')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchSearchData()
  }, [query])

  const handleAddToCart = useCallback((product: Product) => {
    addItem(product, 1, 'box')
  }, [addItem])

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 min-h-screen">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            نتائج البحث عن: <span className="text-primary">&quot;{query}&quot;</span>
          </h1>
          <p className="text-gray-500 font-medium">
            {!loading && products.length > 0 && `وجدنا ${products.length} منتج`}
          </p>
        </div>
        <button 
          onClick={() => router.push('/')}
          className="text-sm font-medium text-gray-500 hover:text-gray-900 bg-gray-100/50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors self-start"
        >
          العودة للرئيسية
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 flex items-center gap-4 text-red-600 shadow-sm mb-8">
          <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="font-medium text-[15px]">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <ProductCardSkeleton key={`search-skeleton-${i}`} />
          ))}
        </div>
      ) : products.length === 0 && !error ? (
        <EmptyState 
          title="للأسف لم نجد ما تبحث عنه"
          description="تأكد من إملاء الكلمة أو جرب كلمات بحث أخرى."
          actionLabel="تصفح جميع المنتجات"
          onAction={() => router.push('/')}
        />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              searchQuery={query}
              onAddToCart={handleAddToCart} 
            />
          ))}
        </div>
      )}
    </div>
  )
}