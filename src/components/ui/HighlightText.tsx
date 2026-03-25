import React from 'react'

interface HighlightTextProps {
  text: string
  highlight?: string
}

export function HighlightText({ text, highlight }: HighlightTextProps) {
  if (!highlight || !highlight.trim()) {
    return <>{text}</>
  }

  // Create a regex to match the highlighted text, case-insensitive
  const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapeRegExp(highlight)})`, 'gi')
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 text-gray-900 rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}
