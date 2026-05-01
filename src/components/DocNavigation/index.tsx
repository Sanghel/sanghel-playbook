import Link from 'next/link'
import type { DocNavigationProps } from './types'

export function DocNavigation({ prev, next }: DocNavigationProps) {
  if (!prev && !next) return null

  return (
    <nav
      className="mt-16 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4"
      aria-label="Navegación de documentos"
    >
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-col gap-1 rounded-lg border border-zinc-200 dark:border-zinc-800 px-4 py-3 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors max-w-[45%]"
        >
          <span className="text-xs text-zinc-500 dark:text-zinc-400">← Anterior</span>
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={next.href}
          className="group flex flex-col gap-1 items-end rounded-lg border border-zinc-200 dark:border-zinc-800 px-4 py-3 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors max-w-[45%]"
        >
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Siguiente →</span>
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors text-right">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  )
}
