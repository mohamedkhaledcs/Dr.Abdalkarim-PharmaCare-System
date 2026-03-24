'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUserStore } from '@/store/userStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import api from '@/services/api'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setUser, user } = useUserStore()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      console.log('[LoginPage] User already logged in, redirecting...')
      router.push('/')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('[LoginPage] Attempting login with email:', formData.email)
      const response = await api.post('/auth/login', formData)
      
      console.log('[LoginPage] Login successful, user role:', response.data.user.role)
      setUser(response.data.user, response.data.token)
      
      // Redirect based on role
      if (response.data.user.role === 'admin') {
        console.log('[LoginPage] Redirecting to dashboard (admin)')
        router.push('/dashboard')
      } else if (response.data.user.role === 'cashier') {
        console.log('[LoginPage] Redirecting to cashier (cashier)')
        router.push('/cashier')
      } else {
        console.log('[LoginPage] Redirecting to home (user)')
        router.push('/')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'حدث خطأ في تسجيل الدخول'
      console.error('[LoginPage] Login failed:', errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-surface p-8 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-center mb-2 text-primary">
          صيدلية عبد الكريم
        </h1>
        <p className="text-center text-textSecondary mb-8">تسجيل الدخول</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-1">
              البريد الإلكتروني
            </label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-textPrimary mb-1">
              كلمة المرور
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-danger text-sm">{error}</p>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-textSecondary text-sm">
            ليس لديك حساب؟{' '}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}