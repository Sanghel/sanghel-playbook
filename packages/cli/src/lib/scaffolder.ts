import { spawnSync } from 'child_process'

export type Stack = 'react-vite' | 'nextjs' | 'astro'

type Command = [string, string[]]

const COMMANDS: Record<Stack, Command> = {
  'react-vite': ['npm', ['create', 'vite@latest']],
  'nextjs': ['npx', ['create-next-app@latest']],
  'astro': ['npm', ['create', 'astro@latest']],
}

export function scaffold(stack: Stack, projectName: string): boolean {
  const [cmd, args] = COMMANDS[stack]
  const result = spawnSync(cmd, [...args, projectName], { stdio: 'inherit', shell: true })
  if (result.status === null) {
    throw result.error ?? new Error(`Spawning ${cmd} failed (signal: ${result.signal})`)
  }
  return result.status === 0
}
