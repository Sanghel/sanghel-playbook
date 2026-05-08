import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import type { Stack } from '../commands/create.js'

interface Props {
  stack: Stack
  onConfirm: (name: string) => void
  onBack: () => void
}

const STACK_DEFAULTS: Record<Stack, string> = {
  'react-vite': 'my-react-app',
  'nextjs': 'my-next-app',
  'astro': 'my-astro-app',
}

export function ProjectNameInput({ stack, onConfirm, onBack }: Props) {
  const [value, setValue] = useState(STACK_DEFAULTS[stack])

  useInput((input, key) => {
    if (key.return) {
      const name = value.trim()
      if (name) onConfirm(name)
      return
    }
    if (key.escape) {
      onBack()
      return
    }
    if (key.backspace || key.delete) {
      setValue((v) => v.slice(0, -1))
      return
    }
    if (input && !key.ctrl && !key.meta) {
      setValue((v) => v + input)
    }
  })

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">
        Nuevo proyecto — nombre del proyecto
      </Text>
      <Text> </Text>
      <Box>
        <Text dimColor>{'> '}</Text>
        <Text color="white">{value}</Text>
        <Text color="green">{'█'}</Text>
      </Box>
      <Text> </Text>
      <Text dimColor>enter confirmar  esc volver</Text>
    </Box>
  )
}
