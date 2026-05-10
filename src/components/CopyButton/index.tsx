'use client'

import { useState } from 'react'

interface CopyButtonProps {
  text: string
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Copiado' : 'Copiar comando'}
      className="relative flex items-center justify-center px-3 py-2 border-l border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
    >
      <span
        className={`transition-all duration-200 ${
          copied ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
        } absolute`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </span>
      <span
        className={`transition-all duration-200 ${
          copied ? 'opacity-100 scale-100 text-green-400' : 'opacity-0 scale-75'
        } absolute`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      <span className="w-[14px] h-[14px]" aria-hidden />
    </button>
  )
}
