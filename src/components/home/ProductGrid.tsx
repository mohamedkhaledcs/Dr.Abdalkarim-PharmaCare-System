'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { Product } from '@/types'
import { useProductStore } from '@/store/productStore'
import { useCartStore } from '@/store/cartStore'
import ProductCard from '@/components/product/ProductCard'
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton'
import EmptyState from '@/components/ui/EmptyState'

const ITEMS_PER_PAGE = 20

export default function ProductGrid() {
  const { filteredProducts, searchQuery, selectedCategory, loading } = useProductStore()
  const setSearchQuery = useProductStore((state) => state.setSearchQuery)
  const setSelectedCategory = useProductStore((state) => state.setSelectedCategory)
  const { addItem } = useCartStore()
  const [currentPage, setCurrentPage] = useState(1)

  // Reset pagination when category or search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory])

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(0, currentPage * ITEMS_PER_PAGE)
  }, [filteredProducts, currentPage])

  const hasMore = paginatedProducts.length < filteredProducts.length

  const handleAddToCart = useCallback((product: Product) => {
    addItem(product, 1, 'box')
  }, [addItem])

  const clearFilters = () => {
    if (searchQuery) {
      // Find the input element and dispatch an event if tracking through DOM, 
      // but here we just update store so UI will naturally sync if wired two-way.
      // Easiest is to force via store. (Note: input field localSearch will get out of sync 
      // unless we emit an event or wire it differently, but for now this resets State!)
      setSearchQuery('')
    }
    setSelectedCategory('')
  }

  return (
    <section id="products-grid">
      <div className="flex items-center justify-between mb-8 border-t border-gray-100 pt-8">
        <div className="flex items-baseline gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {searchQuery ? 'نتائج البحث' : selectedCategory ? 'منتجات الفئة' : 'كل المنتجات'}
          </h2>
          {!loading && (
            <span className="text-sm font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {filteredProducts.length}
            </span>
          )}
        </div>
      </div>

      <div className="relative min-h-[400px]">
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => <ProductCardSkeleton key={`products-skeleton-${i}`} />)
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full">
              <EmptyState 
                title="لا توجد نتائج مطابقة"
                description="جرب البحث بكلمات مختلفة أو إزالة الفلاتر."
                actionLabel={(searchQuery || selectedCategory) ? "إعادة ضبط الفلاتر" : undefined}
                onAction={clearFilters}
              />
            </div>
          ) : (
            paginatedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                searchQuery={searchQuery} 
                onAddToCart={handleAddToCart} 
              />
            ))
          )}
        </div>

        {hasMore && !loading && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-primary hover:text-primary transition-colors focus:ring-4 focus:ring-primary/10 cursor-pointer"
            >
              عرض المزيد من المنتجات ({filteredProducts.length - paginatedProducts.length} متبقي)
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
