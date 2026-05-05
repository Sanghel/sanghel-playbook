import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import type { CategoryRef } from '../types.js'

interface Props {
  categories: CategoryRef[]
  onSelect: (category: CategoryRef) => void
  onBack: () => void
}

export function CategoryMenu({ categories, onSelect, onBack }: Props) {
  const [cursor, setCursor] = useState(0)

  useInput((_, key) => {
    if (categories.length === 0) {
      if (key.escape) onBack()
      return
    }
    if (key.upArrow) setCursor((c) => Math.max(0, c - 1))
    if (key.downArrow) setCursor((c) => Math.min(categories.length - 1, c + 1))
    if (key.return) onSelect(categories[cursor])
    if (key.escape) onBack()
  })

  if (categories.length === 0) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text dimColor>No hay categorías disponibles.</Text>
        <Text dimColor>esc volver</Text>
      </Box>
    )
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">
        Añadir a proyecto — elige categoría
      </Text>
      <Text> </Text>
      {categories.map((cat, i) => (
        <Text key={cat.id} color={i === cursor ? 'green' : undefined}>
          {i === cursor ? '▶ ' : '  '}
          {cat.label}
        </Text>
      ))}
      <Text> </Text>
      <Text dimColor>↑↓ navegar  enter confirmar  esc volver</Text>
    </Box>
  )
}
