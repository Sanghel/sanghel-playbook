import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import type { PackageManager } from '../lib/package-manager.js'

interface Props {
  onSelect: (pm: PackageManager) => void
  onBack: () => void
}

const OPTIONS: { label: string; value: PackageManager; description: string }[] = [
  {
    label: 'pnpm',
    value: 'pnpm',
    description: 'Recomendado — workspace-friendly y rápido',
  },
  {
    label: 'npm',
    value: 'npm',
    description: 'El gestor por defecto de Node.js',
  },
  {
    label: 'yarn',
    value: 'yarn',
    description: 'Alternativa popular con workspaces',
  },
]

export function PackageManagerMenu({ onSelect, onBack }: Props) {
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
        Nuevo proyecto — elige el gestor de paquetes
      </Text>
      <Text> </Text>
      {OPTIONS.map((opt, i) => (
        <Box key={opt.value} flexDirection="column">
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
