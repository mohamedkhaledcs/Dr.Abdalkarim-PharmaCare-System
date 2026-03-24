interface CardProps {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-surface rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 ${className}`}>
      {children}
    </div>
  )
}