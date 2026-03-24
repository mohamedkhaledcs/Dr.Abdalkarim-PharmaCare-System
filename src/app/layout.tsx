import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'

const cairo = Cairo({ subsets: ['arabic'], weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'صيدلية عبد الكريم',
  description: 'نظام إدارة صيدلية شامل',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} bg-background`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-textPrimary text-white mt-12">
          <div className="max-w-7xl mx-auto px-4 py-8 text-center">
            <p>© 2024 صيدلية عبد الكريم. جميع الحقوق محفوظة</p>
          </div>
        </footer>
      </body>
    </html>
  )
}