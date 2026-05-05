import { describe, it, expect, vi } from 'vitest'
import { spawnSync } from 'child_process'
import { scaffold } from './scaffolder.js'

vi.mock('child_process', () => ({
  spawnSync: vi.fn(() => ({ status: 0 })),
}))

describe('scaffold', () => {
  it('react-vite: corre npm create vite@latest', () => {
    scaffold('react-vite', 'my-app')
    expect(spawnSync).toHaveBeenCalledWith(
      'npm',
      ['create', 'vite@latest', 'my-app'],
      { stdio: 'inherit', shell: true }
    )
  })

  it('nextjs: corre npx create-next-app@latest', () => {
    scaffold('nextjs', 'my-app')
    expect(spawnSync).toHaveBeenCalledWith(
      'npx',
      ['create-next-app@latest', 'my-app'],
      { stdio: 'inherit', shell: true }
    )
  })

  it('astro: corre npm create astro@latest', () => {
    scaffold('astro', 'my-app')
    expect(spawnSync).toHaveBeenCalledWith(
      'npm',
      ['create', 'astro@latest', 'my-app'],
      { stdio: 'inherit', shell: true }
    )
  })

  it('retorna true cuando status es 0', () => {
    expect(scaffold('react-vite', 'my-app')).toBe(true)
  })

  it('retorna false cuando status es distinto de 0', () => {
    vi.mocked(spawnSync).mockReturnValueOnce({ status: 1 } as ReturnType<typeof spawnSync>)
    expect(scaffold('nextjs', 'my-app')).toBe(false)
  })

  it('lanza error cuando status es null (comando no encontrado)', () => {
    vi.mocked(spawnSync).mockReturnValueOnce({ status: null, error: new Error('spawn npm ENOENT'), signal: null } as unknown as ReturnType<typeof spawnSync>)
    expect(() => scaffold('react-vite', 'my-app')).toThrow('spawn npm ENOENT')
  })
})
