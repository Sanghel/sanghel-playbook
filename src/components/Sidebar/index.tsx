'use client'

import Link from 'next/link'
import { useControllerSidebar } from './useControllerSidebar'
import type { NavGroup } from './types'

interface SidebarProps {
  groups: NavGroup[]
}

export function Sidebar({ groups }: SidebarProps) {
  const { mobileOpen, collapsed, isActive, toggleKey, toggleMobile, closeMobile } =
    useControllerSidebar(groups)

  const nav = (
    <nav className="flex flex-col gap-6 py-6 px-4">
      {groups.map((group) => (
        <div key={group.title}>
          {/* Group header */}
          <button
            onClick={() => toggleKey(group.title)}
            className="flex w-full items-center justify-between mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            {group.title}
            <span className="text-zinc-400">{collapsed[group.title] ? '+' : '−'}</span>
          </button>

          {!collapsed[group.title] && (
            <div className="flex flex-col gap-3">
              {/* Sub-sections (depth 3) */}
              {group.subsections.map((sub) => {
                const subKey = `${group.title}:${sub.title}`
                return (
                  <div key={sub.title}>
                    <button
                      onClick={() => toggleKey(subKey)}
                      className="flex w-full items-center justify-between mb-1 pl-2 text-xs font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                    >
                      {sub.title}
                      <span>{collapsed[subKey] ? '+' : '−'}</span>
                    </button>

                    {!collapsed[subKey] && (
                      <ul className="flex flex-col gap-0.5">
                        {sub.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={closeMobile}
                              className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                                isActive(item.href)
                                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium'
                                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                              }`}
                            >
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              })}

              {/* Direct items (depth 2) */}
              {group.items.length > 0 && (
                <ul className="flex flex-col gap-0.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={closeMobile}
                        className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                          isActive(item.href)
                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      ))}

      {groups.length === 0 && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500">No docs yet.</p>
      )}
    </nav>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-50 flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 lg:hidden"
        aria-label="Toggle sidebar"
      >
        <span className="text-sm">{mobileOpen ? '✕' : '☰'}</span>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transform transition-transform duration-200 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {nav}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-y-auto">
        {nav}
      </aside>
    </>
  )
}
