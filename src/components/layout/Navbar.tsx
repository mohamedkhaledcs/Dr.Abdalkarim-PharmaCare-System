'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useUserStore } from '@/store/userStore'

const categories = [
  { key: 'Pain Relief', label: 'مسكنات وألم' },
  { key: 'Antibiotics', label: 'مضادات حيوية' },
  { key: 'Vitamins', label: 'فيتامينات ومكملات' },
  { key: 'Cardiovascular', label: 'القلب والضغط' },
  { key: 'Respiratory', label: 'الجهاز التنفسي' },
  { key: 'Diabetes', label: 'أدوية السكري' },
  { key: 'Digestive', label: 'الجهاز الهضمي' },
  { key: 'Skin Care', label: 'العناية بالبشرة' },
  { key: 'Baby Care', label: 'عناية الطفل' },
]

export default function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, logout } = useUserStore()
  const { items } = useCartStore()
  const router = useRouter()
  const pathname = usePathname()

  if (pathname === '/login' || pathname === '/register' || pathname === '/forgot-password') {
    return null
  }

  const cartTotal = items.length

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          <Link href="/" className="flex flex-shrink-0 items-center gap-3 text-xl font-black text-primary hover:opacity-80 transition group">
            <div className="bg-primary/5 p-2 rounded-xl group-hover:bg-primary/10 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary">
                {/* Bowl of Hygieia - True Pharmacy Logo */}
                <path d="M7 11c0 2.2 2 4 5 4s5-1.8 5-4" />
                <path d="M12 15v6" />
                <path d="M9 21h6" />
                <path d="M12 2v9" />
                <path d="M9 5c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3 1.3-3 3 1.3 3 3 3" />
              </svg>
            </div>
            <span className="tracking-tight text-gray-900">صيدلية عبد الكريم</span>
          </Link>

          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center">
            <form onSubmit={handleSearch} className="w-full max-w-2xl relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن دواء أو منتج..."
                className="w-full rounded-full border-2 border-gray-100 bg-gray-50/50 pl-24 pr-11 py-2.5 text-sm font-medium focus:outline-none focus:border-primary focus:bg-white transition-all shadow-inner"
              />
              <button 
                type="submit"
                className="absolute inset-y-0 left-2 my-1.5 flex items-center bg-primary px-5 text-white rounded-full text-sm font-semibold hover:bg-primary/90 hover:shadow-md transition-all active:scale-95"
              >
                بحث
              </button>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative p-2.5 rounded-xl text-gray-500 hover:text-primary hover:bg-primary/5 transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3h15l-1.5 9H6z" />
                <path d="M3 3h3" />
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="19" cy="20" r="1.5" />
              </svg>
              {cartTotal > 0 && <span className="absolute -top-0.5 -right-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white ring-2 ring-white shadow-sm">{cartTotal}</span>}
            </Link>
            
            {user ? (
              <div className="hidden md:flex items-center gap-4 border-r border-gray-100 pr-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 leading-none mb-1">{user.name}</p>
                  <p className="text-[11px] font-semibold text-primary bg-primary/10 inline-block px-2 py-0.5 rounded-full">
                    {user.role === 'admin' || user.role === 'super_admin' ? 'مدير النظام' : user.role === 'cashier' ? 'كاشير' : 'مستخدم'}
                  </p>
                </div>
                <div className="flex gap-2 mr-2">
                  {(user.role === 'admin' || user.role === 'super_admin') && (
                    <Link href="/dashboard" className="p-2 rounded-xl text-primary font-bold hover:bg-primary/10 transition-colors" title="لوحة الإدارة">
                      <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    </Link>
                  )}
                  <Link href="/profile" className="p-2 rounded-xl text-gray-500 hover:text-primary hover:bg-primary/5 transition-colors" title="حسابي">
                    <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </Link>
                  <button onClick={() => { logout(); window.location.href = '/login' }} className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="تسجيل الخروج">
                    <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 border-r border-gray-100 pr-4">
                <Link href="/login" className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 hover:shadow-md transition-all active:scale-95">تسجيل الدخول</Link>
              </div>
            )}

            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="lg:hidden p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="hidden lg:block pb-4">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            {categories.map((category) => (
              <Link 
                key={category.key} 
                href={`/categories/${category.key}`} 
                className="whitespace-nowrap rounded-xl px-4 py-2 text-gray-500 hover:text-primary hover:bg-primary/5 transition-colors"
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-gray-100 pb-4 pt-2">
             <form onSubmit={handleSearch} className="p-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث..."
                  className="w-full rounded-xl border-2 border-gray-100 bg-gray-50 pl-14 pr-4 py-3 text-sm focus:outline-none focus:border-primary shadow-inner"
                />
                <button type="submit" className="absolute inset-y-0 left-0 flex items-center px-4 text-primary bg-primary/10 rounded-l-xl hover:bg-primary/20 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            <div className="px-2 space-y-1">
              <Link href="/cart" className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 font-bold hover:bg-gray-50">
                <span>🛒 سلة الشراء</span>
                {cartTotal > 0 && <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">{cartTotal}</span>}
              </Link>
              
              <div className="h-px bg-gray-100 my-2 mx-4"></div>
              
              <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">الفئات</p>
              <div className="grid grid-cols-2 gap-1 px-2">
                {categories.map((category) => (
                  <Link key={category.key} href={`/categories/${category.key}`} className="px-4 py-2.5 rounded-xl text-sm text-gray-600 font-medium hover:bg-primary/5 hover:text-primary">
                    {category.label}
                  </Link>
                ))}
              </div>

              <div className="h-px bg-gray-100 my-2 mx-4"></div>

              {user ? (
                <>
                  {(user.role === 'admin' || user.role === 'super_admin') && (
                    <Link href="/dashboard" className="flex items-center px-4 py-3 rounded-xl text-primary font-bold hover:bg-primary/5">
                      📊 لوحة الإدارة
                    </Link>
                  )}
                  <Link href="/profile" className="flex items-center px-4 py-3 rounded-xl text-gray-700 font-bold hover:bg-gray-50">
                    👤 حسابي
                  </Link>
                  <button onClick={() => { logout(); window.location.href = '/login' }} className="w-full text-start flex items-center px-4 py-3 rounded-xl text-red-600 font-bold hover:bg-red-50">
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <Link href="/login" className="flex items-center px-4 py-3 rounded-xl text-primary font-bold hover:bg-primary/5">
                  تسجيل الدخول
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
