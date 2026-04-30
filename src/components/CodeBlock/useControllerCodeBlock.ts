'use client'

import { useState, useCallback, useRef } from 'react'

export function useControllerCodeBlock() {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  const copy = useCallback(async () => {
    const text = preRef.current?.innerText ?? ''
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  return { copied, copy, preRef }
}
