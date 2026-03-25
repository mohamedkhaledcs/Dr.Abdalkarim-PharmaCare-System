import Image from 'next/image'
import { Product } from '@/types'
import Button from '@/components/ui/Button'
import { HighlightText } from '@/components/ui/HighlightText'

interface ProductCardProps {
  product: Product
  searchQuery?: string
  onAddToCart?: (product: Product) => void
}

export default function ProductCard({ product, searchQuery, onAddToCart }: ProductCardProps) {
  const isOutOfStock = product.stock === 0
  const isLimited = product.stock > 0 && product.stock <= 10
  const discount = false; // Add calculation here if needed later

  return (
    <div className="group flex flex-col justify-between bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
      {/* Image Section */}
      <div className="relative w-full aspect-square bg-gray-50/50 rounded-xl overflow-hidden mb-5 flex items-center justify-center">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-6 group-hover:scale-[1.05] transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="text-gray-200">
            <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isOutOfStock && (
            <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              نفذ
            </span>
          )}
          {isLimited && (
            <span className="bg-orange-50 text-orange-600 border border-orange-100 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              محدود
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-900 text-[15px] mb-1.5 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          <HighlightText text={product.name} highlight={searchQuery} />
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          {product.category && (
            <span className="text-[11px] font-medium text-gray-500 bg-gray-100/80 px-2 py-0.5 rounded-md">
              {product.category}
            </span>
          )}
          {product.dosage && (
            <span className="text-[11px] font-medium text-gray-400">
              {product.dosage}
            </span>
          )}
        </div>

        <div className="mt-auto space-y-4 pt-4 border-t border-gray-50">
          <div className="flex flex-col gap-1">
            <div className="flex items-end justify-between">
              <p className="text-xl font-bold tracking-tight text-gray-900 leading-none">
                {product.price_box || 0} <span className="text-[11px] font-normal text-gray-500 tracking-normal ml-0.5">ج.م</span>
              </p>
            </div>
            
            {product.stock > 0 && (
              <p className="text-[11px] text-gray-400 mt-1">
                المخزون المتوفر: <span className="font-medium text-gray-700">{product.stock} علبة</span>
              </p>
            )}
          </div>

          {onAddToCart && (
            <Button
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock}
              className={`w-full py-2.5 rounded-xl text-[13px] font-semibold transition-all shadow-sm ${
                isOutOfStock
                  ? 'bg-gray-100 text-gray-400 shadow-none cursor-not-allowed hidden'
                  : 'bg-black text-white hover:bg-gray-800 hover:shadow-md'
              }`}
            >
              أضف للسلة
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}