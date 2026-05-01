'use client'

import Link from 'next/link'
import { useControllerSearchModal } from './useControllerSearchModal'
import type { SearchModalProps } from './types'

export function SearchModal({ docs }: SearchModalProps) {
  const { isOpen, query, results, activeIndex, inputRef, close, setQuery, handleKeyboardNav } =
    useControllerSearchModal(docs)

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Búsqueda"
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 border-b border-zinc-200 dark:border-zinc-700">
          <svg
            className="h-4 w-4 shrink-0 text-zinc-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyboardNav}
            placeholder="Buscar documentos..."
            className="flex-1 py-4 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none"
          />
          <kbd className="hidden sm:flex h-5 items-center gap-0.5 rounded border border-zinc-200 dark:border-zinc-700 px-1.5 text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
            esc
          </kbd>
        </div>

        {results.length > 0 && (
          <ul className="max-h-80 overflow-y-auto py-2" role="listbox">
            {results.map((doc, i) => (
              <li key={doc.href} role="option" aria-selected={i === activeIndex}>
                <Link
                  href={doc.href}
                  onClick={close}
                  className={`flex flex-col gap-0.5 px-4 py-2.5 transition-colors ${
                    i === activeIndex
                      ? 'bg-zinc-100 dark:bg-zinc-800'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {doc.title}
                  </span>
                  {doc.description && (
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                      {doc.description}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {query && results.length === 0 && (
          <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Sin resultados para &ldquo;{query}&rdquo;
          </p>
        )}

        {!query && (
          <p className="py-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
            Escribe para buscar en la documentación
          </p>
        )}
      </div>

      {/* Backdrop blur */}
      <div className="absolute inset-0 -z-10 bg-black/40 backdrop-blur-sm" />
    </div>
  )
}
