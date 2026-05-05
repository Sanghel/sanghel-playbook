import { scaffold } from '../lib/scaffolder.js'
import type { Stack } from '../lib/scaffolder.js'

export type { Stack }

export function createProject(stack: Stack, projectName: string): boolean {
  return scaffold(stack, projectName)
}
