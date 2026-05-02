'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import type { NavGroup } from './types'

export function useControllerSidebar(groups: NavGroup[]) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  function isActive(href: string) {
    return pathname === href
  }

  function toggleKey(key: string) {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function toggleMobile() {
    setMobileOpen((prev) => !prev)
  }

  function closeMobile() {
    setMobileOpen(false)
  }

  return {
    groups,
    pathname,
    mobileOpen,
    collapsed,
    isActive,
    toggleKey,
    toggleMobile,
    closeMobile,
  }
}
