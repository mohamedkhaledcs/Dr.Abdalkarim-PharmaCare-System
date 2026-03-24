'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Product } from '@/types'
import api from '@/services/api'
import Button from '@/components/ui/Button'
import { useCartStore } from '@/store/cartStore'

interface ProductPageProps {
  params: { id: string }
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<'box' | 'strip'>('box')
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCartStore()
  const router = useRouter()

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await api.get(`/products/${params.id}`)
        setProduct(response.data)
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
      addItem(product, quantity, selectedType)
      router.push('/cart')
    }
  }

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>
  }

  if (!product) {
    return <div className="text-center py-8">المنتج غير موجود</div>
  }

  const price = selectedType === 'box' ? product.price_box : product.price_strip

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={384}
              className="w-full h-96 object-cover rounded-2xl"
            />
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="mb-6">
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setSelectedType('box')}
                className={`px-4 py-2 rounded-2xl ${
                  selectedType === 'box'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-textPrimary'
                }`}
              >
                علبة - {product.price_box} ج.م
              </button>
              <button
                onClick={() => setSelectedType('strip')}
                className={`px-4 py-2 rounded-2xl ${
                  selectedType === 'strip'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-textPrimary'
                }`}
              >
                شريط - {product.price_strip} ج.م
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <label className="text-textPrimary">الكمية:</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-2xl"
              />
            </div>

            <div className="text-2xl font-bold text-primary mb-6">
              الإجمالي: {price * quantity} ج.م
            </div>

            <Button onClick={handleAddToCart} className="w-full">
              إضافة للسلة
            </Button>
          </div>

          <div className="space-y-4">
            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">الوصف:</h3>
                <p className="text-textSecondary">{product.description}</p>
              </div>
            )}

            {product.usage && (
              <div>
                <h3 className="font-semibold mb-2">الاستخدام:</h3>
                <p className="text-textSecondary">{product.usage}</p>
              </div>
            )}

            {product.dosage && (
              <div>
                <h3 className="font-semibold mb-2">الجرعة:</h3>
                <p className="text-textSecondary">{product.dosage}</p>
              </div>
            )}

            {product.side_effects && (
              <div>
                <h3 className="font-semibold mb-2">الأعراض الجانبية:</h3>
                <p className="text-textSecondary">{product.side_effects}</p>
              </div>
            )}

            {product.warnings && (
              <div>
                <h3 className="font-semibold mb-2">التحذيرات:</h3>
                <p className="text-textSecondary">{product.warnings}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}