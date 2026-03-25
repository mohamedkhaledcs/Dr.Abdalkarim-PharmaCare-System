'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useProductStore } from '@/store/productStore'
import { useDebounce } from '@/hooks/useDebounce'

export default function HeroSection() {
  const router = useRouter()
  const [localSearch, setLocalSearch] = useState('')
  const debouncedSearchTerm = useDebounce(localSearch, 300)
  const setSearchQuery = useProductStore((state) => state.setSearchQuery)

  // Sync debounced search to global store
  useEffect(() => {
    setSearchQuery(debouncedSearchTerm)
  }, [debouncedSearchTerm, setSearchQuery])

  const handleSearchSubmit = useCallback(() => {
    if (localSearch.trim().length > 1) {
      router.push(`/search?q=${encodeURIComponent(localSearch)}`)
    }
  }, [localSearch, router])

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit()
    }
  }, [handleSearchSubmit])

  return (
    <section className="bg-white border-b border-gray-100 pt-10 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
          ابحث عن أدويتك <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-primary">بكل سهولة</span>
        </h1>
        <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto pb-4">
          تصفح منتجاتنا، راجع المخزون، وأضف لعربتك من صيدلية عبد الكريم بسرعة وأمان.
        </p>
        
        <div className="relative max-w-2xl mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl">
          <div className="relative flex items-center bg-white border border-gray-200 rounded-2xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-200">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="ابحث عن دواء... (مثال: بانادول)"
              className="w-full bg-transparent px-4 py-4 pr-5 pl-12 text-gray-900 placeholder:text-gray-400 focus:outline-none text-base"
            />
            {localSearch && (
              <button 
                onClick={() => setLocalSearch('')}
                className="absolute left-10 text-gray-400 hover:text-gray-600 focus:outline-none z-10 p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
            <span className="absolute left-4 text-gray-400 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
