import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'

export type AppMode = 'create' | 'add'

interface Props {
  onSelect: (mode: AppMode) => void
}

const OPTIONS: { label: string; value: AppMode }[] = [
  { label: 'Crear nuevo proyecto', value: 'create' },
  { label: 'Añadir a proyecto existente', value: 'add' },
]

export function MainMenu({ onSelect }: Props) {
  const [cursor, setCursor] = useState(0)

  useInput((_, key) => {
    if (key.upArrow) setCursor((c) => Math.max(0, c - 1))
    if (key.downArrow) setCursor((c) => Math.min(OPTIONS.length - 1, c + 1))
    if (key.return) onSelect(OPTIONS[cursor].value)
  })

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">
        sanghel-playbook
      </Text>
      <Text> </Text>
      <Text dimColor>¿Qué quieres hacer?</Text>
      <Text> </Text>
      {OPTIONS.map((opt, i) => (
        <Text key={opt.value} color={i === cursor ? 'green' : undefined}>
          {i === cursor ? '▶ ' : '  '}
          {opt.label}
        </Text>
      ))}
      <Text> </Text>
      <Text dimColor>↑↓ navegar  enter confirmar</Text>
    </Box>
  )
}
