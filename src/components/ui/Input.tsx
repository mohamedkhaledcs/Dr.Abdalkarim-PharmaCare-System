interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-textPrimary mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${error ? 'border-danger' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
    </div>
  )
}