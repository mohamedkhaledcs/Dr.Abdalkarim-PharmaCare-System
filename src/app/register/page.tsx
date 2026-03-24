'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUserStore } from '@/store/userStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import api from '@/services/api'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setUser } = useUserStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة')
      setLoading(false)
      return
    }

    try {
      const { confirmPassword, ...registerData } = formData
      const response = await api.post('/auth/register', registerData)
      setUser(response.data.user, response.data.token)
      router.push('/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'حدث خطأ في إنشاء الحساب')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="bg-surface p-6 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold text-center mb-6">إنشاء حساب</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="الاسم"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="البريد الإلكتروني"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Input
            label="الهاتف"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <Input
            label="كلمة المرور"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <Input
            label="تأكيد كلمة المرور"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />

          {error && (
            <p className="text-danger text-sm">{error}</p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
          </Button>
        </form>

        <p className="text-center mt-4 text-textSecondary">
          لديك حساب بالفعل؟{' '}
          <Link href="/login" className="text-primary hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  )
}