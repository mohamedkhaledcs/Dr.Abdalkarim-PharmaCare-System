import Skeleton from '@/components/ui/Skeleton'

export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col justify-between bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 h-full">
      {/* Image Skeleton */}
      <div className="relative w-full aspect-square bg-gray-50/50 rounded-xl overflow-hidden mb-5">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-col flex-grow">
        {/* Title */}
        <div className="space-y-2 mb-3">
          <Skeleton className="h-4 w-5/6 rounded-lg" />
          <Skeleton className="h-4 w-2/3 rounded-lg" />
        </div>

        {/* Category & Dosage */}
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-4 w-12 rounded-md" />
        </div>

        {/* Pricing & Button area */}
        <div className="mt-auto space-y-4 pt-4 border-t border-gray-50">
          <div className="space-y-2">
            <Skeleton className="h-5 w-24 rounded" />
            <Skeleton className="h-3 w-32 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>

          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
