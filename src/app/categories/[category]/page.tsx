'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/types'
import { productService } from '@/services/productService'
import ProductCard from '@/components/product/ProductCard'
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton'
import EmptyState from '@/components/ui/EmptyState'
import { useCartStore } from '@/store/cartStore'

interface CategoryPageProps {
  params: { category: string }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addItem } = useCartStore()
  const router = useRouter()
  
  const category = decodeURIComponent(params.category)

  useEffect(() => {
    const loadCategoryProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        // Fetch products via abstracted service
        const allProducts = await productService.getProducts()
        
        const filtered = allProducts.filter((product: Product) =>
          product.category?.toLowerCase() === category.toLowerCase()
        )
        
        setProducts(filtered)
      } catch (err) {
        console.error('[CategoryData] Error loading products:', err)
        setError('خطأ في تحميل المنتجات لهذه الفئة')
      } finally {
        setLoading(false)
      }
    }

    loadCategoryProducts()
  }, [category])

  const handleAddToCart = useCallback((product: Product) => {
    addItem(product, 1, 'box')
  }, [addItem])

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 min-h-screen">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">📂 {category}</h1>
          <p className="text-gray-500 font-medium">
            {!loading && products.length > 0 && `عدد المنتجات المتاحة: ${products.length}`}
          </p>
        </div>
        <button 
          onClick={() => router.push('/')}
          className="text-sm font-medium text-gray-500 hover:text-gray-900 bg-gray-100/50 hover:bg-gray-100 px-5 py-2.5 rounded-xl transition-colors self-start"
        >
          العودة للرئيسية
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 flex items-center gap-4 text-red-600 shadow-sm mb-8">
           <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <ProductCardSkeleton key={`cat-skeleton-${i}`} />
          ))}
        </div>
      ) : products.length === 0 && !error ? (
        <EmptyState 
          title="للأسف، لا توجد منتجات في هذه الفئة"
          description="جرب تصفح فئات أخرى للبحث عما تريده."
          actionLabel="تصفح جميع الفئات"
          onAction={() => router.push('/')}
        />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  )
}