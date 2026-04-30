'use client'

import { useControllerCodeBlock } from './useControllerCodeBlock'
import type { CodeBlockProps } from './types'

export function CodeBlock({ children, 'data-language': language, ...props }: CodeBlockProps) {
  const { copied, copy, preRef } = useControllerCodeBlock()

  return (
    <div className="group relative my-6 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
        <span className="text-xs font-mono text-zinc-500">
          {language ?? 'code'}
        </span>
        <button
          onClick={copy}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label="Copy code"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre
        ref={preRef}
        {...props}
        className="overflow-x-auto p-4 text-sm leading-relaxed [&_[data-highlighted-line]]:bg-zinc-800/60 [&_[data-highlighted-line]]:border-l-2 [&_[data-highlighted-line]]:border-blue-400 [&_[data-highlighted-line]]:pl-3"
      >
        {children}
      </pre>
    </div>
  )
}
