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
    adminCode: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAdminCode, setShowAdminCode] = useState(false)
  const { setUser } = useUserStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Phone validation
    const cleanedPhone = formData.phone.replace(/\D/g, '')
    if (cleanedPhone.length !== 11 || !cleanedPhone.startsWith('01')) {
      setError('رقم الهاتف غير صحيح. يجب أن يتكون من 11 رقماً ويبدأ بـ 01')
      setLoading(false)
      return
    }

    try {
      const response = await api.post('/auth/register', { ...formData, phone: cleanedPhone })
      setUser(response.data.user, response.data.token)
      
      if (response.data.user.role === 'admin') {
        router.push('/dashboard')
      } else {
        router.push('/')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'حدث خطأ في إنشاء الحساب (أو لا يمكن الاتصال بقاعدة البيانات)')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/80 p-4 sm:p-8 font-cairo">
      <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col md:flex-row-reverse min-h-[650px] border border-gray-100 relative">
        
        {/* Decorative Brand Panel - Reversed for Register */}
        <div className="md:w-5/12 bg-gradient-to-bl from-green-700 to-green-600 p-12 text-white flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="absolute top-0 left-0 -ml-16 -mt-16 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 -mr-16 -mb-16 w-80 h-80 rounded-full bg-black/20 blur-3xl"></div>

          <div className="relative z-10 flex flex-col h-full">
            <div>
              <Link href="/">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl inline-block mb-8 border border-white/20 shadow-xl cursor-pointer hover:bg-white/30 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-white drop-shadow-md">
                    <path d="M7 11c0 2.2 2 4 5 4s5-1.8 5-4" />
                    <path d="M12 15v6" />
                    <path d="M9 21h6" />
                    <path d="M12 2v9" />
                    <path d="M9 5c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3 1.3-3 3 1.3 3 3 3" />
                  </svg>
                </div>
              </Link>
              <h2 className="text-4xl font-black mb-4 leading-tight text-white drop-shadow-sm">انضم إلينا<br/>اليوم!</h2>
              <p className="text-white/90 font-medium text-lg leading-relaxed">
                أنشئ حسابك الآن واستمتع بتجربة تسوق دوائية فريدة وعروض حصرية.
              </p>
            </div>
            
            <div className="mt-auto">
              <div className="flex bg-black/20 backdrop-blur-md border border-white/10 p-5 rounded-2xl gap-4">
                <div className="bg-white/20 p-3 rounded-xl h-fit">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">تسجيل سريع وآمن</h4>
                  <p className="text-xs text-white/80 leading-relaxed">بياناتك مشفرة ومحفوظة بأعلى درجات الأمان في سيرفراتنا.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div className="md:w-7/12 p-8 sm:p-12 md:p-14 flex flex-col justify-center bg-white relative z-10 text-right">
          
          <div className="md:hidden flex items-center justify-center gap-3 mb-8 pb-8 border-b border-gray-100">
             <div className="bg-green-50 p-3 rounded-2xl">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-green-700">
                  <path d="M7 11c0 2.2 2 4 5 4s5-1.8 5-4" />
                  <path d="M12 15v6" />
                  <path d="M9 21h6" />
                  <path d="M12 2v9" />
                  <path d="M9 5c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3 1.3-3 3 1.3 3 3 3" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-gray-900">صيدلية عبد الكريم</h2>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">تسجيل حساب جديد 🚀</h1>
            <p className="text-gray-500 font-medium">خطوات بسيطة لتصبح جزءاً من عائلتنا.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
              <Input
                label="الاسم بالكامل"
                type="text"
                placeholder="أحمد محمد"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={loading}
                className="bg-gray-50 border-gray-200 focus:bg-white"
              />
              <Input
                label="رقم الهاتف"
                type="tel"
                placeholder="010XXXXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                disabled={loading}
                className="bg-gray-50 border-gray-200 focus:bg-white text-right"
              />
            </div>
            
            <div className="text-right">
              <Input
                label="البريد الإلكتروني"
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
                className="bg-gray-50 border-gray-200 focus:bg-white text-right"
              />
            </div>
            
            <div className="text-right">
              <Input
                label="كلمة المرور"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={loading}
                className="bg-gray-50 border-gray-200 focus:bg-white text-right"
              />
            </div>

            {!showAdminCode ? (
              <button 
                type="button" 
                onClick={() => setShowAdminCode(true)}
                className="text-xs font-bold text-gray-400 hover:text-green-600 transition-colors block text-right pt-2"
              >
                هل أنت مدير أو كاشير؟ (أدخل الكود)
              </button>
            ) : (
              <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Input
                  label="كود الصلاحية (اختياري)"
                  type="password"
                  placeholder="أدخل كود المسؤول"
                  value={formData.adminCode}
                  onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
                  disabled={loading}
                  className="bg-amber-50/50 border-amber-200 focus:bg-white focus:border-amber-400 text-right"
                />
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50/80 border border-red-100 rounded-xl flex items-start gap-3 mt-4">
                <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-sm font-semibold text-red-700 mt-0.5 whitespace-pre-line">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(22,163,74,0.39)] hover:shadow-[0_6px_20px_rgba(22,163,74,0.23)] transition-all active:scale-[0.98] mt-6"
            >
              {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-gray-500 text-sm font-medium">
              لديك حساب بالفعل؟{' '}
              <Link href="/login" className="text-green-600 font-bold hover:underline underline-offset-4 ml-1">
                سجل الدخول هنا
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}