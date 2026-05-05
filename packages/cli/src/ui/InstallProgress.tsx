import React from 'react'
import { Box, Text } from 'ink'
import Spinner from 'ink-spinner'
import type { InstallStep } from '../types.js'

interface Props {
  steps: InstallStep[]
  done: boolean
  docsUrl?: string | null
}

const ICON: Record<InstallStep['status'], string> = {
  pending: '○',
  running: '…',
  done: '✓',
  skipped: '⊘',
  error: '✗',
}

const COLOR: Record<InstallStep['status'], string | undefined> = {
  pending: 'gray',
  running: 'yellow',
  done: 'green',
  skipped: 'gray',
  error: 'red',
}

export function InstallProgress({ steps, done, docsUrl }: Props) {
  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">
        {done ? 'Listo.' : 'Instalando...'}
      </Text>
      <Text> </Text>
      {steps.map((step, i) => (
        <Box key={i}>
          {step.status === 'running' ? (
            <Text color="yellow">
              <Spinner type="dots" /> {step.label}
            </Text>
          ) : (
            <Text color={COLOR[step.status]}>
              {ICON[step.status]} {step.label}
            </Text>
          )}
        </Box>
      ))}
      {done && docsUrl && (
        <>
          <Text> </Text>
          <Text color="cyan">Docs: {docsUrl}</Text>
        </>
      )}
    </Box>
  )
}
