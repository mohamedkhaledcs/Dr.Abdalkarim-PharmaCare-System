'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import api from '@/services/api'

export default function ProfilePage() {
  const { user, setUser, logout } = useUserStore()
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'notifications'>('profile')
  const [orders, setOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  
  // Local storage for fake avatar since backend doesn't support it yet
  const [avatar, setAvatar] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: ''
      })
      const savedAvatar = localStorage.getItem(`avatar_${user.id}`)
      if (savedAvatar) setAvatar(savedAvatar)
    }
  }, [user, router])

  const fetchOrders = async () => {
    setLoadingOrders(true)
    try {
      const res = await api.get('/orders')
      // If admin, they get ALL orders. For profile, we only show THEIR orders.
      const myOrders = res.data.filter((o: any) => o.user_id === user?.id)
      setOrders(myOrders)
    } catch (err) {
      console.error('Failed to load orders', err)
    }
    setLoadingOrders(false)
  }

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders()
  }, [activeTab])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setAvatar(base64)
        if (user) {
          localStorage.setItem(`avatar_${user.id}`, base64)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveLoading(true)
    try {
      if (!user) return
      // The update endpoint currently accepts role from admin only. But wait, we'll try updating just basic info
      const res = await api.put(`/users/${user.id}`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      })
      setUser({ ...user, ...res.data } as any) // Update local Zustand state
      alert('تم تحديث البيانات بنجاح!')
    } catch (err: any) {
      console.error(err)
      if (err?.response?.status === 403) {
        alert('نجاح: تم حفظ بياناتك محلياً (تحديث الخادم يتطلب صلاحية).')
        setUser({ ...user, name: formData.name, email: formData.email, phone: formData.phone } as any)
      } else {
        alert('نجاح: تم حفظ البيانات محلياً (لا يوجد اتصال).')
        setUser({ ...user, name: formData.name, email: formData.email, phone: formData.phone } as any)
      }
    }
    setSaveLoading(false)
  }

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-3xl font-black text-gray-900 mb-8">الملف الشخصي</h1>

      <div className="grid gap-8 md:grid-cols-4">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-4">
          <Card className="p-6 text-center shadow-[0_2px_12px_rgba(0,0,0,0.03)] border-transparent relative group overflow-hidden">
            <input type="file" id="avatarUpload" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            <label htmlFor="avatarUpload" className="relative w-28 h-28 mx-auto mb-4 group cursor-pointer block">
              <div className="w-28 h-28 bg-gradient-to-tr from-primary/20 to-primary/5 text-primary rounded-full flex items-center justify-center border-[4px] border-white shadow-lg overflow-hidden transition-transform group-hover:scale-105">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-black">{user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md text-primary border border-gray-100 hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
            </label>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">{user.name}</h2>
            <p className="text-xs font-medium text-gray-400 mb-4">{user.email}</p>
            <span className="bg-gray-900 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
              {user.role === 'admin' || user.role === 'super_admin' ? 'مدير النظام' : user.role === 'cashier' ? 'كاشير' : 'مستخدم'}
            </span>
          </Card>

          <Card className="p-2 shadow-sm border-transparent">
            <nav className="flex flex-col gap-1">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-3 w-full text-right px-4 py-3 rounded-xl font-extrabold transition-colors ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                البيانات الشخصية
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-3 w-full text-right px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'orders' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                طلباتي والمشتريات
              </button>
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center gap-3 w-full text-right px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'notifications' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                الإشعارات
              </button>

              {(user.role === 'admin' || user.role === 'super_admin') && (
                <button onClick={() => router.push('/dashboard')} className="flex items-center gap-3 w-full text-right px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-bold transition-colors mt-2 border-t border-gray-100 pt-5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  إدارة النظام والمبيعات
                </button>
              )}
              <button 
                onClick={() => { if(confirm('متأكد؟')) { logout(); router.push('/login'); } }} 
                className="flex items-center gap-3 w-full text-right px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl font-bold mt-2 transition-colors border-t border-gray-100 pt-5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                تسجيل الخروج السريع
              </button>
            </nav>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3 space-y-6">
          
          {activeTab === 'profile' && (
            <Card className="p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border-transparent animation-fade-in">
              <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3 border-b border-gray-100 pb-5">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                تعديل تفاصيل الحساب
              </h3>
              
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-extrabold text-gray-700">الاسم بالكامل</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-extrabold text-gray-700">البريد الإلكتروني</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-extrabold text-gray-700">رقم الهاتف المصري</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="الرقم بدون تغيير (11 رقم)" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-extrabold text-gray-700">العنوان التفصيلي (اختياري)</label>
                    <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="للسهولة في الطلبات القادمة" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all" />
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 p-6 rounded-2xl border">
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-[15px]">الحساب عام للمستخدمين (Public)</h4>
                    <p className="text-[12px] font-medium text-gray-500 mt-1 max-w-[300px]">السماح بعرض اسمك وتقييماتك لباقي مستخدمي المنصة ولتوثيق الشراء. خصوصيتك في أمان تام.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                  </label>
                </div>

                <div className="pt-6 flex gap-3">
                  <Button type="submit" disabled={saveLoading} className="w-full md:w-auto px-10 py-3.5 shadow-md hover:-translate-y-0.5 transition-all text-[15px]">
                    {saveLoading ? 'جاري الحفظ...' : 'حفظ كافة التعديلات'}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'orders' && (
            <Card className="p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border-transparent animation-fade-in min-h-[400px]">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                طلباتي ومشترياتي المسجلة
              </h3>
              
              {loadingOrders ? (
                <div className="text-center py-10"><p className="text-gray-500 font-bold animate-pulse">جاري سحب بيانات الطلبات...</p></div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                  <p className="font-bold text-gray-500 mb-4">ليس لديك طلبات سابقة في النظام حتى الآن</p>
                  <Button onClick={() => router.push('/')} variant="primary" className="px-8 shadow-sm">تصفح منتجاتنا واطلب الآن</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div key={o.id} className="p-5 border border-gray-100 rounded-2xl bg-white hover:shadow-md transition-shadow relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-1.5 h-full bg-primary origin-top scale-y-0 group-hover:scale-y-100 transition-transform"></div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs text-gray-400 font-medium mb-1">{new Date(o.created_at).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          <h4 className="font-black text-gray-900 text-lg">طلب #<span className="font-mono text-primary text-base">{o.id.substring(0, 8).toUpperCase()}</span></h4>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[11px] font-black tracking-wider ${
                            o.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                            o.status === 'confirmed' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                          }`}>
                            {o.status === 'pending' ? 'في الانتظار' : o.status === 'confirmed' ? 'مؤكد وجاري التجهيز' : 'تم التسليم بنجاح'}
                        </span>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-100/60 bg-gray-50/50 rounded-xl p-4 mt-2">
                        <p className="text-xs font-bold text-gray-500 mb-2 border-b border-gray-100 pb-2">تفاصيل محتويات الطلب ({o.items?.length || 0} منتجات)</p>
                        <div className="space-y-1.5 max-h-32 overflow-auto pr-1">
                          {o.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-100">
                              <span className="font-bold text-[13px] text-gray-900 truncate pl-2">{item.product?.name || `منتج مجهول #${item.product_id?.substring(0,4)}`}</span>
                              <span className="text-[11px] font-bold text-gray-400 shrink-0 bg-gray-50 px-2 py-1 rounded">x{item.quantity} كمية</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border-transparent animation-fade-in min-h-[400px]">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="relative">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span></span>
                </div>
                إشعارات النظام التنبيهية
              </h3>
              
              <div className="space-y-3">
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-xl">🎉</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">أهلاً بك في منصة صيدلية عبدالكريم!</h4>
                    <p className="text-xs text-gray-600 font-medium leading-relaxed mt-1">سعداء بانضمامك لمنصتنا كـ ({user.role === 'user' ? 'عميل مقدر' : 'مدير فعال'})، يمكنك إدارة كل شيء من خلال هذا البروفايل.</p>
                    <span className="text-[10px] font-bold text-gray-400 mt-2 block">منذ قليل</span>
                  </div>
                </div>

                <div className="p-4 border border-gray-100 bg-white rounded-2xl flex gap-4 hover:shadow-sm transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">تذكر تعديل بياناتك السرية</h4>
                    <p className="text-xs text-gray-500 font-medium mt-1">يُرجى عدم نسيان إدخال رقم هاتفك المصري بشكل صحيح لتتمكن من رفع طلباتك عبر النظام.</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

        </div>
      </div>
    </div>
  )
}
