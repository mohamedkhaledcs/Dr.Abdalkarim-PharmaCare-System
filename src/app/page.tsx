'use client'

import { useEffect } from 'react'
import { productService } from '@/services/productService'
import { useProductStore } from '@/store/productStore'

// Refactored UI Sections
import HeroSection from '@/components/home/HeroSection'
import CategoryFilter from '@/components/home/CategoryFilter'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import ProductGrid from '@/components/home/ProductGrid'

export default function Home() {
  const products = useProductStore((state) => state.products)
  const setProducts = useProductStore((state) => state.setProducts)
  const setLoading = useProductStore((state) => state.setLoading)
  const setError = useProductStore((state) => state.setError)
  const error = useProductStore((state) => state.error)
  const selectedCategory = useProductStore((state) => state.selectedCategory)
  const searchQuery = useProductStore((state) => state.searchQuery)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await productService.getProducts()
        
        if (data && Array.isArray(data)) {
          setProducts(data)
          if (data.length === 0) {
            setError('لا توجد منتجات متاحة حاليا. يرجى إضافة منتجات إلى قاعدة البيانات.')
          }
        } else {
          setProducts([])
          setError('بيانات غير صالحة من السيرفر.')
        }
      } catch (err) {
        console.error('[Home] Failed to load products:', err)
        setError('حدث خطأ في الاتصال بالسيرفر. حاول مرة أخرى.')
      } finally {
        setLoading(false)
      }
    }

    if (products.length === 0) {
      loadProducts()
    } else {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Mount only

  return (
    <main className="min-h-screen bg-[#FDFDFD] pb-32">
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-12 space-y-16">
        {/* Global Error Handle */}
        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 flex items-center gap-4 text-red-600 shadow-sm">
            <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="font-medium text-[15px]">{error}</p>
          </div>
        )}

        <CategoryFilter />

        {!selectedCategory && !searchQuery.trim() && <FeaturedProducts />}

        <ProductGrid />
      </div>
    </main>
  )
}
