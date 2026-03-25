'use client'

import { useMemo, useCallback } from 'react'
import { Product } from '@/types'
import { useProductStore } from '@/store/productStore'
import { useCartStore } from '@/store/cartStore'
import ProductCard from '@/components/product/ProductCard'
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton'

export default function FeaturedProducts() {
  const products = useProductStore((state) => state.products)
  const loading = useProductStore((state) => state.loading)
  const { addItem } = useCartStore()

  const featuredProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 8)
  }, [products])

  const handleAddToCart = useCallback((product: Product) => {
    addItem(product, 1, 'box')
  }, [addItem])

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">الأكثر مبيعاً</h2>
        <span className="text-sm text-gray-500 font-medium">مختارة لك</span>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={`featured-skeleton-${i}`} />)
        ) : featuredProducts.length === 0 ? (
          <p className="col-span-full text-center text-gray-400 py-12">لا توجد منتجات مميزة حاليا</p>
        ) : (
          featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))
        )}
      </div>
    </section>
  )
}
