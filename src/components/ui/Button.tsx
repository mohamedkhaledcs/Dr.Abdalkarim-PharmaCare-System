interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  const baseClasses = 'rounded-2xl font-medium transition-colors transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 hover:-translate-y-0.5 active:scale-95'
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary hover:shadow-lg',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary hover:shadow-lg',
    danger: 'bg-danger text-white hover:bg-danger/90 focus:ring-danger hover:shadow-lg',
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  )
}