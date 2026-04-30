'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import type { NavSection } from './types'

export function useControllerSidebar(sections: NavSection[]) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  function isActive(href: string) {
    return pathname === href
  }

  function toggleSection(title: string) {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  function toggleMobile() {
    setMobileOpen((prev) => !prev)
  }

  function closeMobile() {
    setMobileOpen(false)
  }

  return {
    sections,
    pathname,
    mobileOpen,
    collapsed,
    isActive,
    toggleSection,
    toggleMobile,
    closeMobile,
  }
}
