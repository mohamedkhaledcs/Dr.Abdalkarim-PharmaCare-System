'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlToken = searchParams?.get('token') || ''
  
  const [token, setToken] = useState(urlToken)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة')
      return
    }
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ')
      }
      
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'الكود غير صالح أو منتهي الصلاحية')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
      {/* Left Decoration Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary/5 p-12 flex-col justify-between overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(var(--primary),0.05),transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(var(--primary),0.05),transparent_50%)]" />
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 text-2xl font-black text-primary hover:opacity-80 transition group">
            <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-primary/10 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary">
                <path d="M7 11c0 2.2 2 4 5 4s5-1.8 5-4" />
                <path d="M12 15v6" />
                <path d="M9 21h6" />
                <path d="M12 2v9" />
                <path d="M9 5c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3 1.3-3 3 1.3 3 3 3" />
              </svg>
            </div>
            <span className="tracking-tight text-gray-900">صيدلية عبد الكريم</span>
          </Link>
        </div>

        <div className="relative z-10 mt-auto mb-10">
          <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight">تعيين كلمة المرور الجديدة!</h2>
          <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-lg">
            أدخل كود الاستعادة الذي أرسلناه لك لتعيين كلمة مرورك الجديدة، وتأكد من حفظها في مكان آمن.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md relative z-10 animate-fade-in-up">
          <div className="mb-10 text-center lg:text-right">
            <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">كلمة مرور جديدة 🔒</h1>
            <p className="text-gray-500 font-medium">أدخل كود الاستعادة (التوكن) وكلمة مرورك الجديدة لتفعيلها.</p>
          </div>

          <div className="bg-transparent">
            {success ? (
              <div className="text-center space-y-4 p-8 bg-green-50/50 border border-green-100 rounded-3xl shadow-sm">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">تم تغيير كلمة المرور بنجاح!</h3>
                <p className="text-sm font-medium text-gray-500">جاري تحويلك لصفحة تسجيل الدخول...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-4 bg-red-50/80 border border-red-100 text-red-600 rounded-2xl text-[13px] font-bold text-center flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2 text-right">
                    <label className="text-[13px] font-extrabold text-gray-700 mr-1">كود الاستعادة (Token)</label>
                    <input
                      type="text"
                      required
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="XXXX-XXXX-XXXX"
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl px-5 py-4 text-[15px] font-medium outline-none transition-all shadow-sm tracking-widest text-center uppercase"
                    />
                  </div>

                  <div className="space-y-2 text-right">
                    <label className="text-[13px] font-extrabold text-gray-700 mr-1">كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl px-5 py-4 text-[15px] font-medium outline-none transition-all shadow-sm dir-ltr text-right"
                    />
                  </div>

                  <div className="space-y-2 text-right">
                    <label className="text-[13px] font-extrabold text-gray-700 mr-1">تأكيد كلمة المرور</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl px-5 py-4 text-[15px] font-medium outline-none transition-all shadow-sm dir-ltr text-right"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full h-14 text-[16px] rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all outline-none"
                    disabled={loading || !token || !password || !confirmPassword}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        جاري التنفيذ...
                      </span>
                    ) : 'تعيين وحفظ الباسورد'}
                  </Button>
                </div>
              </form>
            )}
          </div>
          
          <div className="text-center mt-8 border-t border-gray-100 pt-8">
            <Link href="/login" className="text-[14px] font-black text-gray-500 hover:text-primary transition-colors">
              إلغاء والعودة لتسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
