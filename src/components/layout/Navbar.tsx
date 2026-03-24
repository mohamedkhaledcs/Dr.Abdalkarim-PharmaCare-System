'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useUserStore } from '@/store/userStore'

const categories = [
  { key: 'Pain Relief', label: 'ألم' },
  { key: 'Antibiotics', label: 'مضادات حيوية' },
  { key: 'Vitamins', label: 'فيتامينات' },
  { key: 'Cardiovascular', label: 'ضغط وسكر' },
  { key: 'Respiratory', label: 'الجهاز التنفسي' },
  { key: 'Dermatology', label: 'عناية البشرة' },
]

export default function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [search, setSearch] = useState('')
  const { user, logout } = useUserStore()
  const { items } = useCartStore()

  const cartTotal = items.length

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          <Link href="/" className="flex items-center gap-3 text-xl font-black text-primary hover:opacity-80 transition">
            <Image src="/pharmacy-logo.svg" alt="Pharmacy Logo" width={36} height={36} />
            <span>صيدلية عبد الكريم</span>
          </Link>

          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center">
            <div className="w-full max-w-xl relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن دواء أو فئة"
                className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button className="absolute inset-y-0 right-2 flex items-center bg-primary px-4 py-1.5 text-white rounded-full text-sm hover:bg-primary/90 transition">بحث</button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/cart" className="relative p-2 rounded-full text-textPrimary hover:bg-primary/10 transition">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3h15l-1.5 9H6z" />
                <path d="M3 3h3" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="19" cy="20" r="1" />
              </svg>
              {cartTotal > 0 && <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] text-white">{cartTotal}</span>}
            </Link>
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-textPrimary">{user.name}</p>
                  <p className="text-xs text-textSecondary">{user.role === 'admin' ? 'مسؤول' : user.role === 'cashier' ? 'كاشير' : 'مستخدم'}</p>
                </div>
                <button
                  onClick={() => {
                    logout()
                    window.location.href = '/login'
                  }}
                  className="px-4 py-2 rounded-lg bg-danger text-white text-sm font-semibold hover:bg-danger/90"
                >
                  خروج
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:inline-flex px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90">تسجيل الدخول</Link>
            )}

            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden p-2 rounded-lg border border-gray-200">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h18" />
                <path d="M3 6h18" />
                <path d="M3 18h18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="hidden md:block border-t border-gray-100 py-3">
          <div className="flex overflow-x-auto gap-2 text-sm">
            {categories.map((category) => (
              <Link key={category.key} href={`/categories/${category.key}`} className="whitespace-nowrap rounded-full border border-gray-200 px-4 py-2 text-textPrimary hover:bg-primary/10 transition">
                {category.label}
              </Link>
            ))}
          </div>
        </div>

        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="space-y-2">
              <Link href="/cart" className="block px-4 py-2 rounded-lg text-textPrimary hover:bg-gray-100">🛒 السلة ({cartTotal})</Link>
              {categories.map((category) => (
                <Link key={category.key} href={`/categories/${category.key}`} className="block px-4 py-2 rounded-lg text-textPrimary hover:bg-gray-100">{category.label}</Link>
              ))}
              {user ? (
                <button onClick={() => { logout(); window.location.href = '/login' }} className="w-full text-start px-4 py-2 rounded-lg text-danger hover:bg-danger/10">خروج</button>
              ) : (
                <Link href="/login" className="block px-4 py-2 rounded-lg text-primary">تسجيل الدخول</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
