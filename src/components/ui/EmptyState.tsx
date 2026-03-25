import React from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 p-16 text-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.01)] transition-all">
      <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-5">
        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">{description}</p>}
      
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="mt-8 px-8 py-3 bg-white border border-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-gray-100 active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
