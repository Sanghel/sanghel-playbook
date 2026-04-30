'use client'

import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'

function subscribe() {
  return () => {}
}

export function useControllerHeader() {
  const { theme, setTheme } = useTheme()

  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return { theme, mounted, toggleTheme }
}
