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
        <Card className="py-16 text-center">
          <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13l-1.1 5m10 0h.01M12 2v3m0 18v-3" />
          </svg>
          <h1 className="mb-2 text-3xl font-bold text-textPrimary">السلة فارغة</h1>
          <p className="mb-6 text-textSecondary">لم تضف أي منتجات إلى السلة بعد</p>
          <Link href="/">
            <Button className="px-8 py-3 font-semibold text-white rounded-lg bg-primary hover:bg-primary/90">
              تصفح المنتجات
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  const generateWhatsAppMessage = () => {
    const productList = items.map(item => 
      `${item.product.name} - ${item.quantity} ${item.type === 'box' ? 'علبة' : 'شريط'} - (${(item.type === 'box' ? item.product.price_box : item.product.price_strip) * item.quantity} ج.م)`
    ).join('\n')

    const message = `🏥 طلب جديد من صيدلية عبد الكريم\n\n*المنتجات:*\n${productList}\n\n*الإجمالي:* ${total} ج.م\n\n*بيانات الطلب:*\nالاسم: ${userInfo.name}\nالهاتف: ${userInfo.phone}\nالعنوان: ${userInfo.address}`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/201234567890?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  const handleSystemOrder = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    try {
      setLoading(true)
      console.log('[Cart] Creating order...')
      const orderItems = items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        type: item.type,
      }))

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
        throw new Error('Failed to create order')
      }

      clearCart()
      alert('✅ تم إرسال الطلب بنجاح')
      router.push('/')
    } catch (error) {
      console.error('[Cart] Error creating order:', error)
      alert('❌ حدث خطأ في إرسال الطلب')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl px-4 py-8 mx-auto">
      <h1 className="mb-2 text-3xl font-bold">🛒 سلة الشراء</h1>
      <p className="mb-8 text-textSecondary">{itemCount} منتج في السلة</p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item, index) => (
              <Card key={index} className="p-4 transition-shadow hover:shadow-lg">
                <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-4">
                  {/* Product Image */}
                  <div className="relative overflow-hidden bg-gray-100 rounded-lg aspect-square sm:aspect-auto sm:h-24">
                    {item.product.image ? (
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover transition-transform hover:scale-110"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-gray-400">
                        📦
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="sm:col-span-2">
                    <h3 className="text-lg font-bold text-textPrimary">{item.product.name}</h3>
                    <p className="mt-1 text-sm text-textSecondary">{item.product.category}</p>
                    <p className="mt-2 text-sm font-semibold text-primary">
                      {item.type === 'box' ? item.product.price_box : item.product.price_strip} ج.م / {item.type === 'box' ? 'علبة' : 'شريط'}
                    </p>
                  </div>

                  {/* Quantity and Total */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.type, Math.max(1, item.quantity - 1))}
                        className="px-2 py-1 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product.id, item.type, Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 px-2 py-1 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <button
                        onClick={() => updateQuantity(item.product.id, item.type, item.quantity + 1)}
                        className="px-2 py-1 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-textSecondary">الإجمالي</p>
                      <p className="text-lg font-bold text-primary">
                        {getUnitPrice(item) * item.quantity} ج.م
                      </p>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.product.id, item.type)}
                    className="p-2 transition-all rounded-lg sm:absolute sm:top-4 sm:left-4 text-danger hover:text-red-700 hover:bg-red-50"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
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
            className="px-4 py-2 mt-4 font-semibold transition-colors rounded-lg text-danger hover:bg-red-50"
          >
            🗑️ مسح السلة
          </button>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky p-6 top-20">
            <h2 className="mb-6 text-xl font-bold text-textPrimary">ملخص الطلب</h2>

            {/* Summary Numbers */}
            <div className="pb-6 mb-6 space-y-3 border-b border-gray-200">
              <div className="flex justify-between text-textSecondary">
                <span>عدد المنتجات:</span>
                <span className="font-semibold">{itemCount}</span>
              </div>
              <div className="flex justify-between text-textSecondary">
                <span>الإجمالي الفرعي:</span>
                <span className="font-semibold">{total.toFixed(2)} ج.م</span>
              </div>
              <div className="flex justify-between pt-3 text-lg font-bold border-t text-primary">
                <span>الإجمالي:</span>
                <span>{total.toFixed(2)} ج.م</span>
              </div>
            </div>

            {/* Order Type Selection */}
            <div className="mb-6 space-y-3">
              <h3 className="mb-3 font-semibold text-textPrimary">طريقة الطلب</h3>
              <label className={`block p-3 rounded-lg border-2 cursor-pointer transition-all ${
                orderType === 'whatsapp' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  value="whatsapp"
                  checked={orderType === 'whatsapp'}
                  onChange={(e) => setOrderType(e.target.value as 'whatsapp')}
                  className="mr-2"
                />
                <span className="font-semibold">💬 واتساب</span>
                <p className="mt-1 text-xs text-textSecondary">سريع وسهل</p>
              </label>
              <label className={`block p-3 rounded-lg border-2 cursor-pointer transition-all ${
                orderType === 'system' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  value="system"
                  checked={orderType === 'system'}
                  onChange={(e) => setOrderType(e.target.value as 'system')}
                  className="mr-2"
                />
                <span className="font-semibold">🏪 النظام</span>
                <p className="mt-1 text-xs text-textSecondary">تتبع الطلب</p>
              </label>
            </div>

            {/* User Info */}
            <div className="mb-6 space-y-3">
              <h3 className="font-semibold text-textPrimary">بيانات الطلب</h3>
              <Input
                label="الاسم"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                required
              />
              <Input
                label="الهاتف"
                value={userInfo.phone}
                onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                required
              />
              <Input
                label="العنوان"
                value={userInfo.address}
                onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                required
              />
            </div>

            {/* Order Button */}
            {orderType === 'whatsapp' ? (
              <Button
                onClick={generateWhatsAppMessage}
                disabled={loading || !userInfo.name || !userInfo.phone}
                className="w-full py-3 font-bold text-white transition-all bg-green-500 rounded-lg hover:bg-green-600"
              >
                💬 إرسال عبر واتساب
              </Button>
            ) : (
              <Button
                onClick={handleSystemOrder}
                disabled={loading || !userInfo.name || !userInfo.phone || !user}
                className="w-full py-3 font-bold text-white transition-all rounded-lg bg-primary hover:bg-primary/90"
              >
                {loading ? '⏳ جاري الإرسال...' : '✅ تأكيد الطلب'}
              </Button>
            )}

            {!user && orderType === 'system' && (
              <p className="mt-2 text-xs text-danger">يجب تسجيل الدخول لإكمال الطلب</p>
            )}

            {/* Continue Shopping */}
            <Link href="/">
              <button className="w-full px-4 py-2 mt-3 font-semibold transition-colors rounded-lg text-primary hover:bg-primary/10">
                ← متابعة التسوق
              </button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}