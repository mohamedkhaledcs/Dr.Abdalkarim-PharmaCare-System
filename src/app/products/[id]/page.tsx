'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Product } from '@/types'
import { productService } from '@/services/productService'
import Button from '@/components/ui/Button'
import { useCartStore } from '@/store/cartStore'

interface ProductPageProps {
  params: { id: string }
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  
  const { addItem } = useCartStore()
  const router = useRouter()

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const data = await productService.getProductById(params.id)
        setProduct(data)
      } catch (error) {
        console.error('Failed to load product', error)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [params.id])

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity)
      router.push('/cart')
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">المنتج غير موجود</h2>
        <p className="text-gray-500 mb-8">عذراً، لم نتمكن من العثور على المنتج المطلوب.</p>
        <button 
          onClick={() => router.push('/')}
          className="bg-primary text-white font-semibold px-8 py-3 rounded-xl hover:bg-primary/90"
        >
          العودة للرئيسية
        </button>
      </div>
    )
  }

  const price = product.price_box || 0
  const isOutOfStock = product.stock === 0

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Product Image Panel */}
        <div className="relative bg-gray-50/80 rounded-3xl p-8 flex items-center justify-center border border-gray-100 shadow-[inset_0_2px_20px_rgba(0,0,0,0.02)] min-h-[400px]">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={400}
              className="w-full max-w-sm object-contain drop-shadow-sm hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
             <svg className="w-24 h-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}

          {isOutOfStock && (
            <div className="absolute top-6 right-6">
              <span className="bg-red-50 text-red-600 border border-red-100 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                نفذ من المخزون
              </span>
            </div>
          )}
        </div>

        {/* Product Details Panel */}
        <div className="flex flex-col justify-center">
          {product.category && (
            <span className="text-sm font-semibold text-primary/80 mb-3 block">
              {product.category}
            </span>
          )}
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
            {product.name}
          </h1>
          
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
            <div className="flex items-end justify-between mb-8 pb-6 border-b border-gray-100">
              <span className="text-sm text-gray-500 font-medium">سعر المنتج</span>
              <span className="text-3xl font-extrabold text-gray-900">{price} <span className="text-sm font-medium text-gray-500">ج.م</span></span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <label className="text-sm font-medium text-gray-700 w-16">الكمية:</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl max-w-[120px]">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-r-xl transition"
                >-</button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-10 h-10 text-center bg-transparent border-0 focus:ring-0 text-gray-900 font-semibold p-0"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-l-xl transition"
                >+</button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div>
                <span className="block text-sm text-gray-500 mb-1">الإجمالي</span>
                <span className="text-2xl font-bold text-primary">{price * quantity} <span className="text-base font-medium">ج.م</span></span>
              </div>
              
              <Button 
                onClick={handleAddToCart} 
                disabled={isOutOfStock}
                className={`px-8 transition-all ${isOutOfStock ? 'opacity-50 cursor-not-allowed bg-gray-300' : 'hover:scale-105 active:scale-95 shadow-md hover:shadow-lg'}`}
              >
                {isOutOfStock ? 'نفذ من المخزون' : '🛒 أضف للسلة'}
              </Button>
            </div>
          </div>

          {/* Product Additional Details */}
          <div className="space-y-6 pt-4">
            {product.description && (
              <div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-2">الوصف</h3>
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  {product.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.usage && (
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-50">
                  <h3 className="text-[13px] font-bold text-blue-900 mb-1 flex items-center gap-2">
                    <span className="text-blue-500">ℹ️</span> الاستخدام
                  </h3>
                  <p className="text-xs text-blue-800 leading-relaxed">{product.usage}</p>
                </div>
              )}

              {product.dosage && (
                <div className="bg-green-50/50 p-4 rounded-xl border border-green-50">
                  <h3 className="text-[13px] font-bold text-green-900 mb-1 flex items-center gap-2">
                    <span className="text-green-500">💊</span> الجرعة
                  </h3>
                  <p className="text-xs text-green-800 leading-relaxed">{product.dosage}</p>
                </div>
              )}

              {product.warnings && (
                <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-50">
                  <h3 className="text-[13px] font-bold text-orange-900 mb-1 flex items-center gap-2">
                    <span className="text-orange-500">⚠️</span> تحذيرات
                  </h3>
                  <p className="text-xs text-orange-800 leading-relaxed">{product.warnings}</p>
                </div>
              )}
              
              {product.side_effects && (
                <div className="bg-red-50/50 p-4 rounded-xl border border-red-50">
                  <h3 className="text-[13px] font-bold text-red-900 mb-1 flex items-center gap-2">
                    <span className="text-red-500">⚡</span> أعراض جانبية
                  </h3>
                  <p className="text-xs text-red-800 leading-relaxed">{product.side_effects}</p>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}