'use client'
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs'
import type Entity from '@ant-design/cssinjs/es/Cache'
import { useServerInsertedHTML } from 'next/navigation'
import { useState } from 'react'
import type { ReactNode } from 'react'

export function AntdRegistry({ children }: { children: ReactNode }) {
  const [cache] = useState<Entity>(() => createCache())

  useServerInsertedHTML(() => (
    <style id="antd" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />
  ))

  return <StyleProvider cache={cache}>{children}</StyleProvider>
}
