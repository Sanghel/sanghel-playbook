import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchJson, fetchText, fetchCatalogIndex, fetchCategoryIndex, fetchManifest, fetchFile } from './fetcher.js'

const BASE = 'https://raw.githubusercontent.com/Sanghel/sanghel-playbook/main'

global.fetch = vi.fn()

describe('fetchJson', () => {
  beforeEach(() => vi.resetAllMocks())

  it('fetches and parses JSON from the correct URL', async () => {
    const mockData = { categories: [] }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response)

    const result = await fetchJson('catalog/index.json')

    expect(fetch).toHaveBeenCalledWith(`${BASE}/catalog/index.json`)
    expect(result).toEqual(mockData)
  })

  it('throws when response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 404 } as Response)

    await expect(fetchJson('catalog/index.json')).rejects.toThrow(
      'Failed to fetch catalog/index.json: 404'
    )
  })
})

describe('fetchText', () => {
  beforeEach(() => vi.resetAllMocks())

  it('fetches text content from the correct URL', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve('file content here'),
    } as unknown as Response)

    const result = await fetchText('catalog/rules/github-flow/files/github-flow.md')

    expect(fetch).toHaveBeenCalledWith(`${BASE}/catalog/rules/github-flow/files/github-flow.md`)
    expect(result).toBe('file content here')
  })

  it('throws when response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 500 } as Response)

    await expect(fetchText('catalog/rules/github-flow/files/github-flow.md')).rejects.toThrow(
      'Failed to fetch catalog/rules/github-flow/files/github-flow.md: 500'
    )
  })
})

describe('fetchCatalogIndex', () => {
  beforeEach(() => vi.resetAllMocks())

  it('fetches catalog/index.json', async () => {
    const mockIndex = { categories: [{ id: 'react', label: 'React', indexUrl: 'catalog/react/index.json' }] }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockIndex),
    } as Response)

    const result = await fetchCatalogIndex()
    expect(fetch).toHaveBeenCalledWith(`${BASE}/catalog/index.json`)
    expect(result.categories).toHaveLength(1)
  })
})

describe('fetchCategoryIndex', () => {
  beforeEach(() => vi.resetAllMocks())

  it('fetches catalog/{categoryId}/index.json', async () => {
    const mockCatIndex = { category: 'react', label: 'React', items: ['zod-form'] }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockCatIndex),
    } as Response)

    const result = await fetchCategoryIndex('react')
    expect(fetch).toHaveBeenCalledWith(`${BASE}/catalog/react/index.json`)
    expect(result.items).toEqual(['zod-form'])
  })
})

describe('fetchManifest', () => {
  beforeEach(() => vi.resetAllMocks())

  it('fetches catalog/{categoryId}/{itemId}/manifest.json', async () => {
    const mockManifest = { id: 'zod-form', name: 'Zod Form', description: '', category: 'react', tags: [], deps: { dependencies: [], devDependencies: [] }, files: [], docsUrl: '' }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockManifest),
    } as Response)

    const result = await fetchManifest('react', 'zod-form')
    expect(fetch).toHaveBeenCalledWith(`${BASE}/catalog/react/zod-form/manifest.json`)
    expect(result.id).toBe('zod-form')
  })
})

describe('fetchFile', () => {
  beforeEach(() => vi.resetAllMocks())

  it('fetches catalog/{categoryId}/{itemId}/files/{filename}', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve('export const x = 1'),
    } as unknown as Response)

    const result = await fetchFile('react', 'zod-form', 'useZodForm.ts')
    expect(fetch).toHaveBeenCalledWith(`${BASE}/catalog/react/zod-form/files/useZodForm.ts`)
    expect(result).toBe('export const x = 1')
  })
})
