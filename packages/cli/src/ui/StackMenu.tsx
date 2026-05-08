import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import type { Stack } from '../commands/create.js'

interface Props {
  onSelect: (stack: Stack) => void
  onBack: () => void
}

const OPTIONS: { label: string; value: Stack; description: string }[] = [
  {
    label: 'React + Vite',
    value: 'react-vite',
    description: 'Welcome module · components/ · hooks/ · useLocalStorage',
  },
  {
    label: 'Next.js (create-next-app)',
    value: 'nextjs',
    description: 'Welcome module · components/ · hooks/ · useLocalStorage',
  },
  {
    label: 'Astro',
    value: 'astro',
    description: 'Scaffold base (sin template Sanghel aún)',
  },
]

export function StackMenu({ onSelect, onBack }: Props) {
  const [cursor, setCursor] = useState(0)

  useInput((_, key) => {
    if (key.upArrow) setCursor((c) => Math.max(0, c - 1))
    if (key.downArrow) setCursor((c) => Math.min(OPTIONS.length - 1, c + 1))
    if (key.return) onSelect(OPTIONS[cursor].value)
    if (key.escape) onBack()
  })

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">
        Nuevo proyecto — elige el stack base
      </Text>
      <Text> </Text>
      {OPTIONS.map((opt, i) => (
        <Box key={opt.value} flexDirection="column" marginBottom={i === cursor ? 0 : 0}>
          <Text color={i === cursor ? 'green' : undefined}>
            {i === cursor ? '▶ ' : '  '}
            <Text bold={i === cursor}>{opt.label}</Text>
          </Text>
          {i === cursor && (
            <Text dimColor>     {opt.description}</Text>
          )}
        </Box>
      ))}
      <Text> </Text>
      <Text dimColor>↑↓ navegar  enter confirmar  esc volver</Text>
    </Box>
  )
}
