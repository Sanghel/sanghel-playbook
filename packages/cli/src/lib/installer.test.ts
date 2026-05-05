import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, rmSync, readFileSync, existsSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { installFiles } from './installer.js'
import * as fetcher from './fetcher.js'
import type { ManifestItem } from '../types.js'

vi.mock('./fetcher.js')

const mockManifest: ManifestItem = {
  id: 'zod-form',
  name: 'Zod Form Pattern',
  description: 'Test',
  category: 'react',
  tags: [],
  deps: { dependencies: ['zod'], devDependencies: [] },
  files: [
    { src: 'files/useZodForm.ts', dest: 'src/hooks/useZodForm.ts' },
  ],
  docsUrl: 'https://example.com',
}

describe('installFiles', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'installer-test-'))
    vi.mocked(fetcher.fetchFile).mockResolvedValue('export const useZodForm = () => ({})')
  })

  afterEach(() => {
    rmSync(tmpDir, { recursive: true })
    vi.resetAllMocks()
  })

  it('escribe el archivo en el destino correcto', async () => {
    const results = await installFiles(mockManifest, tmpDir)

    expect(results).toHaveLength(1)
    expect(results[0].path).toBe('src/hooks/useZodForm.ts')
    expect(results[0].skipped).toBe(false)
    expect(existsSync(join(tmpDir, 'src/hooks/useZodForm.ts'))).toBe(true)
    expect(readFileSync(join(tmpDir, 'src/hooks/useZodForm.ts'), 'utf-8')).toBe('export const useZodForm = () => ({})')
  })

  it('crea directorios intermedios si no existen', async () => {
    await installFiles(mockManifest, tmpDir)
    expect(existsSync(join(tmpDir, 'src/hooks'))).toBe(true)
  })

  it('llama a fetchFile con los parámetros correctos', async () => {
    await installFiles(mockManifest, tmpDir)
    expect(fetcher.fetchFile).toHaveBeenCalledWith('react', 'zod-form', 'useZodForm.ts')
  })

  it('marca como skipped si el archivo ya existe', async () => {
    await installFiles(mockManifest, tmpDir)
    const results = await installFiles(mockManifest, tmpDir)

    expect(results[0].skipped).toBe(true)
    expect(fetcher.fetchFile).toHaveBeenCalledTimes(1)
  })

  it('instala múltiples archivos del mismo manifest', async () => {
    const manifest: ManifestItem = {
      ...mockManifest,
      files: [
        { src: 'files/useZodForm.ts', dest: 'src/hooks/useZodForm.ts' },
        { src: 'files/FormField.tsx', dest: 'src/components/FormField.tsx' },
      ],
    }
    vi.mocked(fetcher.fetchFile).mockResolvedValue('// content')

    const results = await installFiles(manifest, tmpDir)
    expect(results).toHaveLength(2)
    expect(results.every(r => !r.skipped)).toBe(true)
  })

  it('registra error en el resultado si fetchFile falla', async () => {
    vi.mocked(fetcher.fetchFile).mockRejectedValueOnce(new Error('Network error fetching file'))

    const results = await installFiles(mockManifest, tmpDir)
    expect(results[0].skipped).toBe(false)
    expect(results[0].error).toBe('Network error fetching file')
  })
})
