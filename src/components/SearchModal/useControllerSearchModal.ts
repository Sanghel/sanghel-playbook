'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Fuse from 'fuse.js'
import type { SearchDoc } from './types'

export function useControllerSearchModal(docs: SearchDoc[]) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchDoc[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const fuseRef = useRef(
    new Fuse(docs, {
      keys: ['title', 'description'],
      threshold: 0.3,
      includeScore: true,
    })
  )

  const close = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    setResults([])
    setActiveIndex(0)
  }, [])

  function handleQueryChange(newQuery: string) {
    setQuery(newQuery)
    setActiveIndex(0)
    if (!newQuery.trim()) {
      setResults([])
      return
    }
    setResults(fuseRef.current.search(newQuery).map((r) => r.item))
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }

    function handleOpenSearch() {
      setIsOpen(true)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('open-search', handleOpenSearch)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('open-search', handleOpenSearch)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [isOpen])

  function handleKeyboardNav(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Escape') {
      close()
    }
  }

  return {
    isOpen,
    query,
    results,
    activeIndex,
    inputRef,
    close,
    handleQueryChange,
    handleKeyboardNav,
  }
}
