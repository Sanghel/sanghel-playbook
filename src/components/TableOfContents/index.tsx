'use client'

import Link from 'next/link'
import { useControllerTableOfContents } from './useControllerTableOfContents'
import type { TableOfContentsProps } from './types'

export function TableOfContents({ items }: TableOfContentsProps) {
  const { activeId } = useControllerTableOfContents(items)

  if (items.length === 0) return null

  return (
    <aside className="hidden xl:block w-52 shrink-0">
      <div className="sticky top-20">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          On this page
        </p>
        <ul className="flex flex-col gap-1.5">
          {items.map((item) => (
            <li
              key={item.id}
              style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
            >
              <Link
                href={`#${item.id}`}
                className={`text-xs transition-colors ${
                  activeId === item.id
                    ? 'text-zinc-900 dark:text-zinc-100 font-medium'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
