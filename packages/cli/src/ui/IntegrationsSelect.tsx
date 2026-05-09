import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import type { Integration } from '../types.js'

interface Props {
  items: Integration[]
  framework: string
  onConfirm: (selected: Integration[]) => void
  onBack: () => void
}

export function IntegrationsSelect({ items, framework, onConfirm, onBack }: Props) {
  const [cursor, setCursor] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useInput((input, key) => {
    if (items.length === 0) {
      if (key.escape) onBack()
      if (key.return) onConfirm([])
      return
    }
    if (key.upArrow) setCursor((c) => Math.max(0, c - 1))
    if (key.downArrow) setCursor((c) => Math.min(items.length - 1, c + 1))
    if (input === ' ') {
      setSelected((s) => {
        const next = new Set(s)
        const id = items[cursor].id
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
    }
    if (key.return) {
      const toConfirm = items.filter((item) => selected.has(item.id))
      onConfirm(toConfirm)
    }
    if (key.escape) onBack()
  })

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">
        Integraciones para {framework}
      </Text>
      <Text> </Text>
      {items.length === 0 ? (
        <Text dimColor>No hay integraciones disponibles para este stack</Text>
      ) : (
        items.map((item, i) => (
          <Box key={item.id} flexDirection="column">
            <Text color={i === cursor ? 'green' : undefined}>
              {i === cursor ? '▶ ' : '  '}
              {selected.has(item.id) ? '[✓] ' : '[ ] '}
              <Text bold={i === cursor}>{item.name}</Text>
            </Text>
            {i === cursor && (
              <Text dimColor>     {item.description}</Text>
            )}
          </Box>
        ))
      )}
      <Text> </Text>
      {items.length === 0 ? (
        <Text dimColor>enter continuar  esc volver</Text>
      ) : (
        <Text dimColor>↑↓ navegar  espacio seleccionar  enter confirmar  esc volver</Text>
      )}
      {selected.size > 0 && (
        <Text color="yellow">{selected.size} integración(es) seleccionada(s)</Text>
      )}
    </Box>
  )
}
