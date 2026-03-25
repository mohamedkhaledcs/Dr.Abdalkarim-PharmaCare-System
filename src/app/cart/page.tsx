'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { useUserStore } from '@/store/userStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()
  const { user } = useUserStore()
  const [orderType, setOrderType] = useState<'whatsapp' | 'system'>('whatsapp')
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
  })
  const router = useRouter()

  const total = getTotal()
  const itemCount = items.length

  if (itemCount === 0) {
    return (
      <div className="max-w-4xl px-4 py-12 mx-auto">
        <Card className="py-16 text-center border-dashed border-2 shadow-none border-gray-200">
          <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13l-1.1 5m10 0h.01M12 2v3m0 18v-3" />
          </svg>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">السلة فارغة</h1>
          <p className="mb-8 text-gray-500">لم تضف أي منتجات إلى السلة بعد</p>
          <Link href="/">
            <Button className="px-8 py-3 font-semibold text-white rounded-xl bg-primary hover:bg-primary/90 transition-all shadow-md">
              تصفح المنتجات
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  const generateWhatsAppMessage = () => {
    const cleanedPhone = userInfo.phone.replace(/\D/g, '')
    if (cleanedPhone.length !== 11 || !cleanedPhone.startsWith('01')) {
      alert('رقم الهاتف غير صحيح. يرجى إدخال 11 رقماً تبدأ بـ 01')
      return
    }

    const productList = items.map(item => 
      `🔹 ${item.product.name} - عدد ${item.quantity} (بـ ${(item.product.price_box || 0) * item.quantity} ج.م)`
    ).join('\n')

    const message = `🏥 طلب جديد من صيدلية عبد الكريم\n\n*المنتجات:*\n${productList}\n\n*الإجمالي:* ${total} ج.م\n\n*بيانات الطلب:*\nالاسم: ${userInfo.name}\nالهاتف: ${cleanedPhone}\nالعنوان: ${userInfo.address}`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/201068186019?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  const handleSystemOrder = async () => {
    const cleanedPhone = userInfo.phone.replace(/\D/g, '')
    if (cleanedPhone.length !== 11 || !cleanedPhone.startsWith('01')) {
      alert('رقم الهاتف غير صحيح. يرجى إدخال 11 رقماً تبدأ بـ 01')
      return
    }

    if (!user) {
      router.push('/login')
      return
    }

    try {
      setLoading(true)
      const orderItems = items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }))

      // Example fetch, if API missing, it will fail gracefully here
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('user-storage') ? JSON.parse(localStorage.getItem('user-storage') || '{}').state?.token : ''}`,
        },
        body: JSON.stringify({
          items: orderItems,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create order. System not fully integrated yet.')
      }

      clearCart()
      alert('✅ تم إرسال الطلب بنجاح!')
      router.push('/')
    } catch (error) {
      console.warn('[Cart] Error creating order, attempting WhatsApp instead:', error)
      alert('❌ حدث خطأ في النظام الداخلي. جاري تحويلك للواتساب...')
      generateWhatsAppMessage() // Fallback to WhatsApp if system order fails
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl px-4 py-8 mx-auto pb-24">
      <h1 className="mb-2 text-3xl font-extrabold text-gray-900">🛒 سلة الشراء</h1>
      <p className="mb-8 text-gray-500 font-medium">لديك {itemCount} منتجات في السلة</p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item, index) => (
              <Card key={index} className="p-4 transition-all hover:shadow-lg border border-gray-100 rounded-2xl">
                <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-4">
                  
                  {/* Product Image */}
                  <div className="relative overflow-hidden bg-gray-50/50 rounded-xl aspect-square sm:aspect-auto sm:h-24 flex items-center justify-center p-2">
                    {item.product.image ? (
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-contain transition-transform hover:scale-110"
                      />
                    ) : (
                       <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="sm:col-span-2 space-y-1">
                    <h3 className="text-[15px] font-bold text-gray-900 line-clamp-2 leading-snug">{item.product.name}</h3>
                    {item.product.category && <p className="text-xs text-gray-500">{item.product.category}</p>}
                    <p className="text-sm font-bold text-primary pt-1">
                      {item.product.price_box} ج.م
                    </p>
                  </div>

                  {/* Quantity and Total */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
                      <button
                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center transition-colors bg-white rounded-lg hover:bg-gray-100 text-gray-600 shadow-sm"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product.id, Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-12 text-center bg-transparent border-0 focus:ring-0 text-sm font-bold text-gray-900"
                      />
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center transition-colors bg-white rounded-lg hover:bg-gray-100 text-gray-600 shadow-sm"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-gray-400 font-medium">الإجمالي</p>
                      <p className="text-lg font-bold text-primary">
                        {(item.product.price_box || 0) * item.quantity} ج.م
                      </p>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-2 transition-all rounded-lg sm:absolute sm:top-4 sm:left-4 text-gray-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* Clear Cart Button */}
          <button
            onClick={() => {
              if (confirm('هل تريد حذف جميع المنتجات من السلة؟')) {
                clearCart()
              }
            }}
            className="px-5 py-2 mt-6 text-sm font-semibold transition-colors rounded-xl text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100"
          >
            🗑️ مسح جميع المنتجات
          </button>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky p-6 sm:p-8 top-20 border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h2 className="mb-6 text-xl font-bold text-gray-900">ملخص الطلب</h2>

            <div className="pb-6 mb-6 space-y-4 border-b border-gray-100">
              <div className="flex justify-between text-sm text-gray-600">
                <span>المنتجات</span>
                <span className="font-semibold text-gray-900">{itemCount}</span>
              </div>
              <div className="flex justify-between pt-4 text-lg font-extrabold text-primary border-t border-gray-50">
                <span>الإجمالي</span>
                <span>{total.toFixed(2)} ج.م</span>
              </div>
            </div>

            <div className="mb-6 space-y-3">
              <h3 className="mb-3 text-sm font-bold text-gray-900">طريقة إتمام الطلب</h3>
              <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                orderType === 'whatsapp' 
                  ? 'border-[#25D366] bg-[#25D366]/5' 
                  : 'border-gray-100 hover:border-gray-200'
              }`}>
                <div className="flex items-center">
                  <input
                    type="radio"
                    value="whatsapp"
                    checked={orderType === 'whatsapp'}
                    onChange={(e) => setOrderType(e.target.value as 'whatsapp')}
                    className="w-4 h-4 text-[#25D366] border-gray-300 focus:ring-[#25D366]"
                  />
                  <div className="mr-3">
                    <span className="font-bold text-gray-900 block">واتساب</span>
                    <span className="text-[11px] text-gray-500">أسرع وأسهل</span>
                  </div>
                </div>
              </label>
              
              <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                orderType === 'system' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-100 hover:border-gray-200'
              }`}>
                <div className="flex items-center">
                  <input
                    type="radio"
                    value="system"
                    checked={orderType === 'system'}
                    onChange={(e) => setOrderType(e.target.value as 'system')}
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <div className="mr-3">
                    <span className="font-bold text-gray-900 block">النظام</span>
                    <span className="text-[11px] text-gray-500">متابعة دقيقة لطلبك</span>
                  </div>
                </div>
              </label>
            </div>

            <div className="mb-8 space-y-4">
              <h3 className="text-sm font-bold text-gray-900">بيانات التوصيل</h3>
              <Input
                label="الاسم بالكامل"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                required
              />
              <Input
                label="رقم الهاتف"
                value={userInfo.phone}
                onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                required
              />
              <Input
                label="عنوان التوصيل (اختياري)"
                value={userInfo.address}
                onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
              />
            </div>

            {orderType === 'whatsapp' ? (
              <Button
                onClick={generateWhatsAppMessage}
                disabled={loading || !userInfo.name || !userInfo.phone}
                className="w-full py-4 font-bold text-white transition-all bg-[#25D366] rounded-xl hover:bg-[#20bd5a] hover:shadow-[0_8px_20px_rgba(37,211,102,0.3)] shadow-[0_4px_10px_rgba(37,211,102,0.2)]"
              >
                ارسال عبر الواتساب
              </Button>
            ) : (
              <Button
                onClick={handleSystemOrder}
                disabled={loading || !userInfo.name || !userInfo.phone || !user}
                className="w-full py-4 font-bold text-white transition-all rounded-xl bg-primary hover:bg-primary/90 hover:shadow-lg shadow-md"
              >
                {loading ? '⏳ جاري التنفيذ...' : '✅ تأكيد الطلب من النظام'}
              </Button>
            )}

            {!user && orderType === 'system' && (
              <p className="mt-3 text-xs font-semibold text-center text-red-600 bg-red-50 py-2 rounded-lg">
                يجب تسجيل الدخول لإتمام الطلب من النظام
              </p>
            )}

            <Link href="/">
              <button className="w-full py-3 mt-4 text-sm font-semibold transition-colors rounded-xl text-gray-500 hover:bg-gray-50 border border-gray-100">
                إضافة منتجات أخرى
              </button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}