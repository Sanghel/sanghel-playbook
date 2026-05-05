import { describe, it, expect, vi, afterEach } from 'vitest'
import { existsSync } from 'fs'
import { detectPackageManager, getInstallCommand } from './package-manager.js'

vi.mock('fs', () => ({
  existsSync: vi.fn(),
}))

describe('detectPackageManager', () => {
  afterEach(() => vi.resetAllMocks())

  it('detecta pnpm por pnpm-lock.yaml', () => {
    vi.mocked(existsSync).mockImplementation((p) => String(p).endsWith('pnpm-lock.yaml'))
    expect(detectPackageManager('/fake/dir')).toBe('pnpm')
  })

  it('detecta yarn por yarn.lock', () => {
    vi.mocked(existsSync).mockImplementation((p) => String(p).endsWith('yarn.lock'))
    expect(detectPackageManager('/fake/dir')).toBe('yarn')
  })

  it('detecta npm por package-lock.json', () => {
    vi.mocked(existsSync).mockImplementation((p) => String(p).endsWith('package-lock.json'))
    expect(detectPackageManager('/fake/dir')).toBe('npm')
  })

  it('devuelve null si no hay lockfile', () => {
    vi.mocked(existsSync).mockReturnValue(false)
    expect(detectPackageManager('/fake/dir')).toBeNull()
  })

  it('prioriza pnpm sobre los demás', () => {
    vi.mocked(existsSync).mockReturnValue(true)
    expect(detectPackageManager('/fake/dir')).toBe('pnpm')
  })
})

describe('getInstallCommand', () => {
  it('pnpm: pnpm add deps', () => {
    expect(getInstallCommand('pnpm', ['zod', 'react-hook-form'])).toBe('pnpm add zod react-hook-form')
  })

  it('yarn: yarn add deps', () => {
    expect(getInstallCommand('yarn', ['zod'])).toBe('yarn add zod')
  })

  it('npm: npm install deps', () => {
    expect(getInstallCommand('npm', ['zod'])).toBe('npm install zod')
  })

  it('pnpm devDeps: pnpm add -D', () => {
    expect(getInstallCommand('pnpm', ['vitest'], true)).toBe('pnpm add -D vitest')
  })

  it('yarn devDeps: yarn add -D', () => {
    expect(getInstallCommand('yarn', ['vitest'], true)).toBe('yarn add -D vitest')
  })

  it('npm devDeps: npm install --save-dev', () => {
    expect(getInstallCommand('npm', ['vitest'], true)).toBe('npm install --save-dev vitest')
  })

  it('lanza error si deps está vacío', () => {
    expect(() => getInstallCommand('pnpm', [])).toThrow('deps must not be empty')
  })
})
