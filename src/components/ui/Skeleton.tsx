interface SkeletonProps {
  className?: string
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 ${className}`}
      style={{
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s infinite',
      }}
    />
  )
}
