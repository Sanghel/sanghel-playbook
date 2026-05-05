import { existsSync } from 'fs'
import { join } from 'path'

export type PackageManager = 'pnpm' | 'yarn' | 'npm'

export function detectPackageManager(cwd: string = process.cwd()): PackageManager | null {
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm'
  if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn'
  if (existsSync(join(cwd, 'package-lock.json'))) return 'npm'
  return null
}

export function getInstallCommand(pm: PackageManager, deps: string[], dev = false): string {
  const depStr = deps.join(' ')
  if (pm === 'pnpm') return dev ? `pnpm add -D ${depStr}` : `pnpm add ${depStr}`
  if (pm === 'yarn') return dev ? `yarn add -D ${depStr}` : `yarn add ${depStr}`
  return dev ? `npm install --save-dev ${depStr}` : `npm install ${depStr}`
}
