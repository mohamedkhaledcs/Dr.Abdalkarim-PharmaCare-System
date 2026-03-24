import Skeleton from '@/components/ui/Skeleton'

export default function ProductCardSkeleton() {
  return (
    <div className="group relative h-full">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
        {/* Image Skeleton */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 p-4 flex flex-col justify-between space-y-3">
          {/* Title Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4 rounded-lg" />
            <Skeleton className="h-3 w-1/3 rounded-lg" />
          </div>

          {/* Description Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-full rounded-lg" />
            <Skeleton className="h-3 w-5/6 rounded-lg" />
          </div>

          {/* Pricing Skeleton */}
          <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
            <Skeleton className="h-4 w-1/2 rounded" />
            <Skeleton className="h-4 w-1/3 rounded" />
          </div>

          {/* Button Skeleton */}
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
