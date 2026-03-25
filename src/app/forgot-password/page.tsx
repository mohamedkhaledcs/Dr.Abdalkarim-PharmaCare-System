'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ')
      }
      
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء الاتصال بالخادم')
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
          <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight">استعادة كلمة المرور بأمان!</h2>
          <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-lg">
            أدخل بريدك الإلكتروني ليصلك كود خاص لتتمكن من إعادة تعيين كلمة مرور جديدة بشكل آمن وسري.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-6 right-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2 text-primary font-bold">
            صيدلية عبد الكريم
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-right">
            <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">كلمة المرور 🔒</h1>
            <p className="text-gray-500 font-medium">أدخل بريدك الإلكتروني لإرسال كود الاستعادة.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          {success ? (
            <div className="mb-8 p-8 bg-green-50/50 border border-green-100 rounded-3xl text-center space-y-4 shadow-sm">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">انتقل لصندوق الوارد 📩</h3>
              <p className="text-sm font-medium text-gray-600">
                لقد أرسلنا كود استعادة ورابط تعيين كلمة المرور إلى البريد الإلكتروني الخاص بك. يرجى المراجعة.
              </p>
              
              <div className="pt-4 space-y-3">
                <Link href="/reset-password" className="block w-full py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
                  لدي كود الاستعادة بالفعل
                </Link>
                <button onClick={() => setSuccess(false)} className="block w-full py-3.5 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-colors">
                  إعادة إدخال الإيميل
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <Input
                  label="البريد الإلكتروني"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !email}
                className="w-full py-4 text-[15px] font-extrabold rounded-2xl bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all outline-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    جاري الإرسال...
                  </span>
                ) : 'إرسال رابط الاستعادة'}
              </Button>
            </form>
          )}

          <div className="mt-8 text-center border-t border-gray-100 pt-8">
            <p className="text-gray-500 text-sm font-medium">
              تذكرت كلمة المرور؟{' '}
              <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4 pointer-events-auto">سجل دخولك الآن</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
