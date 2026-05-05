import type { CatalogIndex, CategoryIndex, ManifestItem } from '../types.js'

const BASE_URL = 'https://raw.githubusercontent.com/Sanghel/sanghel-playbook/main'

export async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}/${path}`)
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`)
  return res.json() as Promise<T>
}

export async function fetchText(path: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/${path}`)
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`)
  return res.text()
}

export async function fetchCatalogIndex(): Promise<CatalogIndex> {
  return fetchJson<CatalogIndex>('catalog/index.json')
}

export async function fetchCategoryIndex(categoryId: string): Promise<CategoryIndex> {
  return fetchJson<CategoryIndex>(`catalog/${categoryId}/index.json`)
}

export async function fetchManifest(categoryId: string, itemId: string): Promise<ManifestItem> {
  return fetchJson<ManifestItem>(`catalog/${categoryId}/${itemId}/manifest.json`)
}

export async function fetchFile(categoryId: string, itemId: string, filename: string): Promise<string> {
  return fetchText(`catalog/${categoryId}/${itemId}/files/${filename}`)
}
