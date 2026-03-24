'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/types'
import api from '@/services/api'
import ProductCard from '@/components/product/ProductCard'
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton'
import { useCartStore } from '@/store/cartStore'

const categories = [
  { key: 'Pain Relief', label: 'ألم' },
  { key: 'Antibiotics', label: 'مضادات حيوية' },
  { key: 'Vitamins', label: 'فيتامينات' },
  { key: 'Cardiovascular', label: 'ضغط وسكر' },
  { key: 'Respiratory', label: 'الجهاز التنفسي' },
  { key: 'Dermatology', label: 'عناية البشرة' },
]

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { addItem } = useCartStore()

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (selectedCategory) {
      result = result.filter((item) => item.category === selectedCategory)
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase()
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term)
      )
    }

    return result
  }, [products, selectedCategory, searchTerm])

  const featuredProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 8)
  }, [products])

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.get('/products')

        if (response.data && Array.isArray(response.data)) {
          setProducts(response.data)
          if (response.data.length === 0) {
            setError('قاعدة البيانات خالية. تأكد من إضافة منتجات في Supabase.')
          }
        } else {
          setProducts([])
          setError('بيانات غير صالحة من السيرفر')
        }
      } catch (err) {
        console.error('[Home] Failed to load products:', err)
        setProducts([])
        setError('حدث خطأ في الاتصال بالسيرفر. حاول مرة أخرى.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term)

      if (!term.trim()) {
        setSuggestions([])
        return
      }

      const filtered = products
        .filter((item) => item.name.toLowerCase().includes(term.toLowerCase()))
        .slice(0, 8)

      setSuggestions(filtered.map((item) => item.name))

      if (term.trim().length > 1) {
        router.push(`/search?q=${encodeURIComponent(term)}`)
      }
    },
    [products, router]
  )

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSearch(searchTerm)
      }
    },
    [searchTerm, handleSearch]
  )

  const handleAddToCart = useCallback(
    (product: Product) => {
      addItem(product, 1, 'box')
    },
    [addItem]
  )

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-gray-500 text-lg">جاري تحميل المنتجات...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="space-y-10 px-4 pb-12 md:px-6 lg:px-8">
      <section className="rounded-3xl bg-gradient-to-r from-primary/85 via-secondary/85 to-cyan-600 p-8 text-white shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.3),_transparent_45%)]" />
        <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/20 rounded-full">صيدلة إلكترونية</span>
            <h1 className="text-3xl font-extrabold md:text-5xl">أشتري أدويتك بثقة وبسهولة</h1>
            <p className="max-w-xl text-white/90 text-base md:text-lg">تصفح المنتجات، راجع المخزون، وأضف للعربة بضغطة واحدة مع تجربه سريعة وسلسة من صيدلية عبد الكريم.</p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setSelectedCategory('')} className="rounded-xl bg-white px-5 py-2.5 font-semibold text-primary shadow-lg hover:bg-white/90">عرض الكل</button>
              <button onClick={() => setSelectedCategory('Pain Relief')} className="rounded-xl border border-white/70 px-5 py-2.5 text-white hover:bg-white/20">ألم</button>
            </div>
          </div>
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-lg shadow-inner">
            <p className="text-sm font-semibold text-white/90 mb-2">ابحث عن دواء</p>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="مثال: بانادول، ميترمين"
                className="w-full rounded-xl border border-white/50 bg-white/20 px-4 py-3 pr-14 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/70"
              />
              <button 
                onClick={() => handleSearch(searchTerm)} 
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-white shadow-md hover:bg-primary/90 hover:shadow-lg transition-all"
              >
                🔍
              </button>
            </div>

            {suggestions.length > 0 && (
              <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white/95 p-2 shadow-lg">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSearch(suggestion)}
                    className="w-full text-right px-3 py-2 text-sm text-textPrimary hover:bg-primary/10 rounded-lg"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-surface p-6 shadow-sm border border-gray-100">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-bold">الفئات</h2>
          <button onClick={() => setSelectedCategory('')} className="text-primary font-semibold hover:text-primary/80">عرض الكل</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`rounded-xl border px-3 py-2 font-semibold transition ${selectedCategory === cat.key ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 bg-white text-textPrimary hover:bg-gray-50'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-danger/20 bg-danger/10 p-4 text-danger">{error}</div>
      )}

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">منتجات مميزة</h2>
          <span className="text-sm text-textSecondary">اعرض من المخزون الأكثر جودة</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={`featured-skeleton-${i}`} />
              ))}
            </>
          ) : featuredProducts.length === 0 ? (
            <p className="col-span-full text-center text-textSecondary py-8">لا توجد منتجات مميزة حاليا</p>
          ) : (
            featuredProducts.map((product) => <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />)
          )}
        </div>
      </section>

      <section id="products-grid" className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">كل المنتجات</h2>
          <span className="text-sm text-textSecondary">{filteredProducts.length} نتائج</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={`products-skeleton-${i}`} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center text-textSecondary">
            <p className="text-lg font-semibold">لا توجد نتائج متاحة حاليا</p>
            <p className="mt-2">تأكد من البيانات في Supabase أو أعد تحميل الصفحة.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />)}
          </div>
        )}
      </section>
    </main>
  )
}
