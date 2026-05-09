'use client'
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs'
import type Entity from '@ant-design/cssinjs/es/Cache'
import { useServerInsertedHTML } from 'next/navigation'
import { useRef } from 'react'
import type { ReactNode } from 'react'

export function AntdRegistry({ children }: { children: ReactNode }) {
  const cache = useRef<Entity | null>(null)
  if (!cache.current) cache.current = createCache()

  useServerInsertedHTML(() => (
    <style id="antd" dangerouslySetInnerHTML={{ __html: extractStyle(cache.current!, true) }} />
  ))

  return <StyleProvider cache={cache.current}>{children}</StyleProvider>
}
