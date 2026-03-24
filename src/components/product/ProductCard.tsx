import Image from 'next/image'
import { Product } from '@/types'
import Button from '@/components/ui/Button'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const stockStatus = product.stock > 10 ? 'وفير' : product.stock > 0 ? 'محدود' : 'نفذ من المخزون'
  const stockColor = product.stock > 10 ? 'green' : product.stock > 0 ? 'yellow' : 'red'
  const computedStripPrice = product.strips_per_box > 0 ? Number((product.price_box / product.strips_per_box).toFixed(2)) : product.price_strip

  return (
    <div className="group relative h-full">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col hover:scale-105 transform">
        {/* Image Container */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="text-gray-400 text-xs mt-2">لا توجد صورة</span>
            </div>
          )}

          {/* Stock Badge */}
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${
            stockColor === 'green' ? 'bg-green-500' :
            stockColor === 'yellow' ? 'bg-yellow-500' :
            'bg-red-500'
          }`}>
            {stockStatus}
          </div>

          {/* Sale Badge (optional) */}
          {product.stock > 50 && (
            <div className="absolute top-3 right-3 bg-primary text-white px-2 py-1 rounded-full text-xs font-bold">
              ⭐ الأفضل
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          {/* Title and Category */}
          <div className="mb-3">
            <h3 className="font-bold text-textPrimary text-base line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            {product.category && (
              <p className="text-xs text-textSecondary mt-1 bg-gray-100 inline-block px-2 py-1 rounded">
                {product.category}
              </p>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-xs text-textSecondary line-clamp-2 mb-3">
              {product.description}
            </p>
          )}

          {/* Dosage */}
          {product.dosage && (
            <p className="text-xs text-textSecondary mb-3">
              💊 الجرعة: {product.dosage}
            </p>
          )}

          {/* Pricing */}
          <div className="space-y-2 mb-4 bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-xs text-textSecondary">علبة</span>
              <span className="text-lg font-bold text-primary">{product.price_box} ج.م</span>
            </div>
            {product.strips_per_box > 1 && (
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-textSecondary">شريط (معتمد على العلبة)</span>
                  <span className="text-sm font-semibold text-textPrimary">{computedStripPrice} ج.م</span>
                </div>
                <p className="text-xs text-textSecondary">{product.strips_per_box} شريط في العلبة  (العلبة ÷ الشريط = {computedStripPrice} ج.م)</p>
              </div>
            )}
            {product.strips_per_box > 1 && product.price_strip !== computedStripPrice && (
              <p className="text-xs text-red-700">سعر الشريط من قاعدة البيانات ({product.price_strip}) تم تعديله حسابياً إلى ({computedStripPrice}) ليكون متناسقاً مع العلبة.</p>
            )}
          </div>

          {/* Stock Info */}
          <div className="mb-4 text-xs text-textSecondary">
            <p>📦 المخزون: <span className="font-bold text-textPrimary">{product.stock} علبة</span></p>
            {product.strips_per_box > 1 && (
              <p>🔢 {product.strips_per_box} شريط بكل علبة</p>
            )}
          </div>

          {/* Add to Cart Button */}
          {onAddToCart && (
            <Button
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
              className={`w-full py-2 rounded-lg font-semibold transition-all transform ${
                product.stock === 0
                  ? 'bg-gray-300 text-textSecondary cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary/90 active:scale-95'
              }`}
            >
              {product.stock === 0 ? '❌ غير متوفر' : '🛒 أضف للسلة'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}