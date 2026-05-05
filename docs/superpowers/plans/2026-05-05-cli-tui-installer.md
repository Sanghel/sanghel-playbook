# CLI/TUI Installer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar sanghel-playbook en un monorepo con un CLI/TUI público (`npx sanghel-playbook`) que permite instalar patrones del catálogo o scaffoldear nuevos proyectos, leyendo el contenido desde este mismo repo en GitHub.

**Architecture:** Monorepo con `packages/cli` (TUI con Ink 5 + React 18, TypeScript ESM) y `catalog/` (manifests JSON + archivos fuente). El CLI fetcha contenido desde GitHub raw en runtime. El site Next.js no cambia estructuralmente.

**Tech Stack:** Ink 5, React 18, TypeScript 5 strict, tsup (build), vitest (tests), native fetch (Node ≥18)

---

## Mapa de archivos

| Archivo | Estado | Responsabilidad |
|---|---|---|
| `package.json` (raíz) | Modificar | Añadir `workspaces: ["packages/*"]` |
| `packages/cli/package.json` | Crear | Metadata del paquete npm, bin entry, deps |
| `packages/cli/tsconfig.json` | Crear | TypeScript config (ESM, React JSX) |
| `packages/cli/tsup.config.ts` | Crear | Build config (ESM, shebang) |
| `packages/cli/vitest.config.ts` | Crear | Config de tests |
| `packages/cli/src/types.ts` | Crear | Interfaces compartidas (CatalogIndex, ManifestItem, etc.) |
| `packages/cli/src/lib/fetcher.ts` | Crear | Fetch de JSON y archivos desde GitHub raw |
| `packages/cli/src/lib/package-manager.ts` | Crear | Detectar pnpm/yarn/npm, generar comandos install |
| `packages/cli/src/lib/installer.ts` | Crear | Copiar archivos al cwd del usuario |
| `packages/cli/src/lib/scaffolder.ts` | Crear | Correr create-next-app, create vite, create astro |
| `packages/cli/src/commands/add.ts` | Crear | Lógica de flujo "añadir a proyecto" |
| `packages/cli/src/commands/create.ts` | Crear | Lógica de flujo "crear proyecto" |
| `packages/cli/src/ui/MainMenu.tsx` | Crear | Primera pantalla: crear / añadir |
| `packages/cli/src/ui/StackMenu.tsx` | Crear | Selección de stack base para proyecto nuevo |
| `packages/cli/src/ui/CategoryMenu.tsx` | Crear | Selección de categoría del catálogo |
| `packages/cli/src/ui/ItemSelect.tsx` | Crear | Multi-select de items con espacio |
| `packages/cli/src/ui/InstallProgress.tsx` | Crear | Pantalla de progreso de instalación |
| `packages/cli/src/index.tsx` | Crear | Entry point: App state machine + render |
| `packages/cli/src/lib/fetcher.test.ts` | Crear | Tests de fetcher |
| `packages/cli/src/lib/package-manager.test.ts` | Crear | Tests de package-manager |
| `packages/cli/src/lib/installer.test.ts` | Crear | Tests de installer |
| `packages/cli/src/lib/scaffolder.test.ts` | Crear | Tests de scaffolder |
| `catalog/index.json` | Crear | Lista de categorías del catálogo |
| `catalog/react/index.json` | Crear | Items disponibles en React |
| `catalog/nextjs/index.json` | Crear | Items disponibles en Next.js |
| `catalog/astro/index.json` | Crear | Items disponibles en Astro |
| `catalog/rules/index.json` | Crear | Items disponibles en Rules |
| `catalog/rules/github-flow/manifest.json` | Crear | Manifest del github-flow |
| `catalog/rules/github-flow/files/github-flow.md` | Crear | Archivo fuente (copia de rules/) |
| `catalog/rules/deploy-guide/manifest.json` | Crear | Manifest del deploy-guide |
| `catalog/rules/deploy-guide/files/deploy-guide.md` | Crear | Archivo fuente (copia de rules/) |
| `src/content/docs/getting-started.mdx` | Modificar | Explicar el CLI |

---

## Task 1: Monorepo setup

**Files:**
- Modify: `package.json` (raíz)
- Create: `packages/cli/package.json`
- Create: `packages/cli/tsconfig.json`
- Create: `packages/cli/tsup.config.ts`
- Create: `packages/cli/vitest.config.ts`

- [ ] **Step 1: Añadir workspaces al package.json raíz**

Editar `package.json` (raíz) — añadir la clave `workspaces` y eliminar `"private": true` solo si quieres publicar la raíz (mantenerlo está bien):

```json
{
  "name": "sanghel-playbook",
  "version": "0.1.0",
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@tailwindcss/typography": "^0.5.19",
    "fuse.js": "^7.3.0",
    "github-slugger": "^2.0.0",
    "gray-matter": "^4.0.3",
    "next": "16.2.4",
    "next-mdx-remote": "^6.0.0",
    "next-themes": "^0.4.6",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "rehype-pretty-code": "^0.14.3",
    "rehype-slug": "^6.0.0",
    "shiki": "^4.0.2"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/mdx": "^2.0.13",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.4",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

- [ ] **Step 2: Crear packages/cli/package.json**

```bash
mkdir -p packages/cli/src/ui packages/cli/src/lib packages/cli/src/commands
```

Crear `packages/cli/package.json`:

```json
{
  "name": "sanghel-playbook",
  "version": "0.1.0",
  "description": "CLI/TUI para instalar patrones y scaffoldear proyectos desde el sanghel-playbook",
  "type": "module",
  "bin": {
    "sanghel-playbook": "./dist/index.js"
  },
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "ink": "^5.2.0",
    "ink-spinner": "^5.0.0",
    "react": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18",
    "tsup": "^8",
    "typescript": "^5",
    "vitest": "^3"
  },
  "files": ["dist"],
  "publishConfig": {
    "access": "public"
  }
}
```

- [ ] **Step 3: Crear packages/cli/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Crear packages/cli/tsup.config.ts**

```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm'],
  target: 'node18',
  outDir: 'dist',
  banner: {
    js: '#!/usr/bin/env node',
  },
  jsx: 'transform',
  jsxImportSource: 'react',
  clean: true,
  sourcemap: false,
})
```

- [ ] **Step 5: Crear packages/cli/vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
})
```

- [ ] **Step 6: Instalar dependencias del workspace**

```bash
cd packages/cli && pnpm install
```

Expected: se instalan ink, react, ink-spinner y devDependencies sin errores.

- [ ] **Step 7: Commit**

```bash
git add package.json packages/cli/
git commit -m "chore: setup monorepo con packages/cli (Ink TUI)"
```

---

## Task 2: TypeScript types

**Files:**
- Create: `packages/cli/src/types.ts`

- [ ] **Step 1: Crear packages/cli/src/types.ts**

```typescript
export interface CatalogIndex {
  categories: CategoryRef[]
}

export interface CategoryRef {
  id: string
  label: string
  indexUrl: string
}

export interface CategoryIndex {
  category: string
  label: string
  items: string[]
}

export interface ManifestItem {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  deps: {
    dependencies: string[]
    devDependencies: string[]
  }
  files: FileEntry[]
  docsUrl: string
}

export interface FileEntry {
  src: string
  dest: string
}

export interface InstallResult {
  path: string
  skipped: boolean
}

export interface InstallStep {
  label: string
  status: 'pending' | 'running' | 'done' | 'skipped' | 'error'
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/cli/src/types.ts
git commit -m "feat(cli): tipos compartidos (CatalogIndex, ManifestItem, etc.)"
```

---

## Task 3: lib/fetcher.ts (TDD)

**Files:**
- Create: `packages/cli/src/lib/fetcher.ts`
- Create: `packages/cli/src/lib/fetcher.test.ts`

- [ ] **Step 1: Escribir los tests en fetcher.test.ts**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchJson, fetchText, fetchCatalogIndex, fetchCategoryIndex, fetchManifest, fetchFile } from './fetcher.js'

const BASE = 'https://raw.githubusercontent.com/sanghelgonzalez/sanghel-playbook/main'

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
```

- [ ] **Step 2: Correr tests — deben fallar**

```bash
cd packages/cli && pnpm test
```

Expected: FAIL — "Cannot find module './fetcher.js'"

- [ ] **Step 3: Implementar packages/cli/src/lib/fetcher.ts**

```typescript
import type { CatalogIndex, CategoryIndex, ManifestItem } from '../types.js'

const BASE_URL = 'https://raw.githubusercontent.com/sanghelgonzalez/sanghel-playbook/main'

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
```

- [ ] **Step 4: Correr tests — deben pasar**

```bash
cd packages/cli && pnpm test
```

Expected: PASS — 8 tests passed

- [ ] **Step 5: Commit**

```bash
git add packages/cli/src/lib/fetcher.ts packages/cli/src/lib/fetcher.test.ts
git commit -m "feat(cli): lib/fetcher — fetch de JSON y archivos desde GitHub raw"
```

---

## Task 4: lib/package-manager.ts (TDD)

**Files:**
- Create: `packages/cli/src/lib/package-manager.ts`
- Create: `packages/cli/src/lib/package-manager.test.ts`

- [ ] **Step 1: Escribir los tests en package-manager.test.ts**

```typescript
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
})
```

- [ ] **Step 2: Correr tests — deben fallar**

```bash
cd packages/cli && pnpm test
```

Expected: FAIL — "Cannot find module './package-manager.js'"

- [ ] **Step 3: Implementar packages/cli/src/lib/package-manager.ts**

```typescript
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
```

- [ ] **Step 4: Correr tests — deben pasar**

```bash
cd packages/cli && pnpm test
```

Expected: PASS — todos los tests de package-manager pasan

- [ ] **Step 5: Commit**

```bash
git add packages/cli/src/lib/package-manager.ts packages/cli/src/lib/package-manager.test.ts
git commit -m "feat(cli): lib/package-manager — detectar pnpm/yarn/npm y generar comandos"
```

---

## Task 5: lib/installer.ts (TDD)

**Files:**
- Create: `packages/cli/src/lib/installer.ts`
- Create: `packages/cli/src/lib/installer.test.ts`

- [ ] **Step 1: Escribir los tests en installer.test.ts**

```typescript
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
})
```

- [ ] **Step 2: Correr tests — deben fallar**

```bash
cd packages/cli && pnpm test
```

Expected: FAIL — "Cannot find module './installer.js'"

- [ ] **Step 3: Implementar packages/cli/src/lib/installer.ts**

```typescript
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname, basename } from 'path'
import { fetchFile } from './fetcher.js'
import type { ManifestItem, InstallResult } from '../types.js'

export async function installFiles(
  manifest: ManifestItem,
  cwd: string = process.cwd()
): Promise<InstallResult[]> {
  const results: InstallResult[] = []

  for (const file of manifest.files) {
    const destPath = join(cwd, file.dest)

    if (existsSync(destPath)) {
      results.push({ path: file.dest, skipped: true })
      continue
    }

    const content = await fetchFile(manifest.category, manifest.id, basename(file.src))
    mkdirSync(dirname(destPath), { recursive: true })
    writeFileSync(destPath, content, 'utf-8')
    results.push({ path: file.dest, skipped: false })
  }

  return results
}
```

- [ ] **Step 4: Correr tests — deben pasar**

```bash
cd packages/cli && pnpm test
```

Expected: PASS — todos los tests de installer pasan

- [ ] **Step 5: Commit**

```bash
git add packages/cli/src/lib/installer.ts packages/cli/src/lib/installer.test.ts
git commit -m "feat(cli): lib/installer — copiar archivos del catálogo al proyecto del usuario"
```

---

## Task 6: lib/scaffolder.ts (TDD)

**Files:**
- Create: `packages/cli/src/lib/scaffolder.ts`
- Create: `packages/cli/src/lib/scaffolder.test.ts`

- [ ] **Step 1: Escribir los tests en scaffolder.test.ts**

```typescript
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
})
```

- [ ] **Step 2: Correr tests — deben fallar**

```bash
cd packages/cli && pnpm test
```

Expected: FAIL — "Cannot find module './scaffolder.js'"

- [ ] **Step 3: Implementar packages/cli/src/lib/scaffolder.ts**

```typescript
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
  return result.status === 0
}
```

- [ ] **Step 4: Correr todos los tests — deben pasar**

```bash
cd packages/cli && pnpm test
```

Expected: PASS — todos los tests de fetcher, package-manager, installer y scaffolder pasan.

- [ ] **Step 5: Commit**

```bash
git add packages/cli/src/lib/scaffolder.ts packages/cli/src/lib/scaffolder.test.ts
git commit -m "feat(cli): lib/scaffolder — ejecutar create-next-app/vite/astro"
```

---

## Task 7: Catalog data — JSON files y migración de rules/

**Files:**
- Create: `catalog/index.json`
- Create: `catalog/react/index.json`
- Create: `catalog/nextjs/index.json`
- Create: `catalog/astro/index.json`
- Create: `catalog/rules/index.json`
- Create: `catalog/rules/github-flow/manifest.json`
- Create: `catalog/rules/github-flow/files/github-flow.md`
- Create: `catalog/rules/deploy-guide/manifest.json`
- Create: `catalog/rules/deploy-guide/files/deploy-guide.md`

- [ ] **Step 1: Crear la estructura de directorios del catálogo**

```bash
mkdir -p catalog/react catalog/nextjs catalog/astro \
         catalog/rules/github-flow/files \
         catalog/rules/deploy-guide/files
```

- [ ] **Step 2: Crear catalog/index.json**

```json
{
  "categories": [
    { "id": "react", "label": "React", "indexUrl": "catalog/react/index.json" },
    { "id": "nextjs", "label": "Next.js", "indexUrl": "catalog/nextjs/index.json" },
    { "id": "astro", "label": "Astro", "indexUrl": "catalog/astro/index.json" },
    { "id": "rules", "label": "Rules & Guides", "indexUrl": "catalog/rules/index.json" }
  ]
}
```

- [ ] **Step 3: Crear catalog/react/index.json**

```json
{
  "category": "react",
  "label": "React",
  "items": []
}
```

(Se populará con items reales en futuras PRs siguiendo el workflow de `catalog + docs en un PR`)

- [ ] **Step 4: Crear catalog/nextjs/index.json**

```json
{
  "category": "nextjs",
  "label": "Next.js",
  "items": []
}
```

- [ ] **Step 5: Crear catalog/astro/index.json**

```json
{
  "category": "astro",
  "label": "Astro",
  "items": []
}
```

- [ ] **Step 6: Crear catalog/rules/index.json**

```json
{
  "category": "rules",
  "label": "Rules & Guides",
  "items": ["github-flow", "deploy-guide"]
}
```

- [ ] **Step 7: Crear catalog/rules/github-flow/manifest.json**

```json
{
  "id": "github-flow",
  "name": "GitHub Flow",
  "description": "Flujo de trabajo completo con Git y GitHub: feature branches, PRs, code review y merge strategy",
  "category": "rules",
  "tags": ["git", "github", "workflow", "branching"],
  "deps": {
    "dependencies": [],
    "devDependencies": []
  },
  "files": [
    { "src": "files/github-flow.md", "dest": "rules/github-flow.md" }
  ],
  "docsUrl": "https://sanghel-playbook.vercel.app/docs/catalog/rules/github-flow"
}
```

- [ ] **Step 8: Copiar rules/github-flow.md como catalog/rules/github-flow/files/github-flow.md**

```bash
cp rules/github-flow.md catalog/rules/github-flow/files/github-flow.md
```

- [ ] **Step 9: Crear catalog/rules/deploy-guide/manifest.json**

```json
{
  "id": "deploy-guide",
  "name": "Deploy Guide (Vercel)",
  "description": "Checklist completo de deploy en Vercel: configuración, variables de entorno, monitoreo y rollback",
  "category": "rules",
  "tags": ["deploy", "vercel", "ci-cd", "checklist"],
  "deps": {
    "dependencies": [],
    "devDependencies": []
  },
  "files": [
    { "src": "files/deploy-guide.md", "dest": "rules/deploy-guide.md" }
  ],
  "docsUrl": "https://sanghel-playbook.vercel.app/docs/catalog/rules/deploy-guide"
}
```

- [ ] **Step 10: Copiar rules/deploy-guide.md como catalog/rules/deploy-guide/files/deploy-guide.md**

```bash
cp rules/deploy-guide.md catalog/rules/deploy-guide/files/deploy-guide.md
```

- [ ] **Step 11: Verificar estructura del catálogo**

```bash
find catalog -type f | sort
```

Expected output:
```
catalog/astro/index.json
catalog/index.json
catalog/nextjs/index.json
catalog/react/index.json
catalog/rules/deploy-guide/files/deploy-guide.md
catalog/rules/deploy-guide/manifest.json
catalog/rules/github-flow/files/github-flow.md
catalog/rules/github-flow/manifest.json
catalog/rules/index.json
```

- [ ] **Step 12: Commit**

```bash
git add catalog/
git commit -m "feat: estructura del catálogo con github-flow y deploy-guide"
```

---

## Task 8: commands/add.ts y commands/create.ts

**Files:**
- Create: `packages/cli/src/commands/add.ts`
- Create: `packages/cli/src/commands/create.ts`

- [ ] **Step 1: Crear packages/cli/src/commands/add.ts**

```typescript
import { execSync } from 'child_process'
import { fetchCatalogIndex, fetchCategoryIndex, fetchManifest } from '../lib/fetcher.js'
import { installFiles } from '../lib/installer.js'
import { detectPackageManager, getInstallCommand } from '../lib/package-manager.js'
import type { CategoryRef, ManifestItem, InstallStep } from '../types.js'

export async function loadCatalog(): Promise<CategoryRef[]> {
  const index = await fetchCatalogIndex()
  return index.categories
}

export async function loadCategoryItems(categoryId: string): Promise<ManifestItem[]> {
  const catIndex = await fetchCategoryIndex(categoryId)
  return Promise.all(catIndex.items.map((id) => fetchManifest(categoryId, id)))
}

export async function runInstall(
  manifests: ManifestItem[],
  cwd: string,
  onStep: (step: InstallStep) => void
): Promise<string | null> {
  const pm = detectPackageManager(cwd) ?? 'npm'
  let lastDocsUrl: string | null = null

  for (const manifest of manifests) {
    const fileResults = await installFiles(manifest, cwd)
    for (const result of fileResults) {
      onStep({ label: result.path, status: result.skipped ? 'skipped' : 'done' })
    }

    if (manifest.deps.dependencies.length > 0) {
      const cmd = getInstallCommand(pm, manifest.deps.dependencies)
      onStep({ label: cmd, status: 'running' })
      execSync(cmd, { cwd, stdio: 'pipe' })
      onStep({ label: cmd, status: 'done' })
    }

    if (manifest.deps.devDependencies.length > 0) {
      const cmd = getInstallCommand(pm, manifest.deps.devDependencies, true)
      onStep({ label: cmd, status: 'running' })
      execSync(cmd, { cwd, stdio: 'pipe' })
      onStep({ label: cmd, status: 'done' })
    }

    lastDocsUrl = manifest.docsUrl
  }

  return lastDocsUrl
}
```

- [ ] **Step 2: Crear packages/cli/src/commands/create.ts**

```typescript
import { scaffold } from '../lib/scaffolder.js'
import type { Stack } from '../lib/scaffolder.js'

export type { Stack }

export function createProject(stack: Stack, projectName: string): boolean {
  return scaffold(stack, projectName)
}
```

- [ ] **Step 3: Commit**

```bash
git add packages/cli/src/commands/
git commit -m "feat(cli): commands/add y commands/create — lógica de flujo de instalación"
```

---

## Task 9: UI components — MainMenu y StackMenu

**Files:**
- Create: `packages/cli/src/ui/MainMenu.tsx`
- Create: `packages/cli/src/ui/StackMenu.tsx`

- [ ] **Step 1: Crear packages/cli/src/ui/MainMenu.tsx**

```tsx
import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'

export type AppMode = 'create' | 'add'

interface Props {
  onSelect: (mode: AppMode) => void
}

const OPTIONS: { label: string; value: AppMode }[] = [
  { label: 'Crear nuevo proyecto', value: 'create' },
  { label: 'Añadir a proyecto existente', value: 'add' },
]

export function MainMenu({ onSelect }: Props) {
  const [cursor, setCursor] = useState(0)

  useInput((_, key) => {
    if (key.upArrow) setCursor((c) => Math.max(0, c - 1))
    if (key.downArrow) setCursor((c) => Math.min(OPTIONS.length - 1, c + 1))
    if (key.return) onSelect(OPTIONS[cursor].value)
  })

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">
        sanghel-playbook
      </Text>
      <Text> </Text>
      <Text dimColor>¿Qué quieres hacer?</Text>
      <Text> </Text>
      {OPTIONS.map((opt, i) => (
        <Text key={opt.value} color={i === cursor ? 'green' : undefined}>
          {i === cursor ? '▶ ' : '  '}
          {opt.label}
        </Text>
      ))}
      <Text> </Text>
      <Text dimColor>↑↓ navegar  enter confirmar</Text>
    </Box>
  )
}
```

- [ ] **Step 2: Crear packages/cli/src/ui/StackMenu.tsx**

```tsx
import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import type { Stack } from '../commands/create.js'

interface Props {
  onSelect: (stack: Stack) => void
  onBack: () => void
}

const OPTIONS: { label: string; value: Stack }[] = [
  { label: 'React + Vite', value: 'react-vite' },
  { label: 'Next.js (create-next-app)', value: 'nextjs' },
  { label: 'Astro', value: 'astro' },
]

export function StackMenu({ onSelect, onBack }: Props) {
  const [cursor, setCursor] = useState(0)

  useInput((_, key) => {
    if (key.upArrow) setCursor((c) => Math.max(0, c - 1))
    if (key.downArrow) setCursor((c) => Math.min(OPTIONS.length - 1, c + 1))
    if (key.return) onSelect(OPTIONS[cursor].value)
    if (key.escape) onBack()
  })

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">
        Nuevo proyecto — elige el stack base
      </Text>
      <Text> </Text>
      {OPTIONS.map((opt, i) => (
        <Text key={opt.value} color={i === cursor ? 'green' : undefined}>
          {i === cursor ? '▶ ' : '  '}
          {opt.label}
        </Text>
      ))}
      <Text> </Text>
      <Text dimColor>↑↓ navegar  enter confirmar  esc volver</Text>
    </Box>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add packages/cli/src/ui/MainMenu.tsx packages/cli/src/ui/StackMenu.tsx
git commit -m "feat(cli): ui/MainMenu y ui/StackMenu"
```

---

## Task 10: UI components — CategoryMenu e ItemSelect

**Files:**
- Create: `packages/cli/src/ui/CategoryMenu.tsx`
- Create: `packages/cli/src/ui/ItemSelect.tsx`

- [ ] **Step 1: Crear packages/cli/src/ui/CategoryMenu.tsx**

```tsx
import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import type { CategoryRef } from '../types.js'

interface Props {
  categories: CategoryRef[]
  onSelect: (category: CategoryRef) => void
  onBack: () => void
}

export function CategoryMenu({ categories, onSelect, onBack }: Props) {
  const [cursor, setCursor] = useState(0)

  useInput((_, key) => {
    if (key.upArrow) setCursor((c) => Math.max(0, c - 1))
    if (key.downArrow) setCursor((c) => Math.min(categories.length - 1, c + 1))
    if (key.return) onSelect(categories[cursor])
    if (key.escape) onBack()
  })

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">
        Añadir a proyecto — elige categoría
      </Text>
      <Text> </Text>
      {categories.map((cat, i) => (
        <Text key={cat.id} color={i === cursor ? 'green' : undefined}>
          {i === cursor ? '▶ ' : '  '}
          {cat.label}
        </Text>
      ))}
      <Text> </Text>
      <Text dimColor>↑↓ navegar  enter confirmar  esc volver</Text>
    </Box>
  )
}
```

- [ ] **Step 2: Crear packages/cli/src/ui/ItemSelect.tsx**

```tsx
import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import type { ManifestItem } from '../types.js'

interface Props {
  items: ManifestItem[]
  categoryLabel: string
  onInstall: (selected: ManifestItem[]) => void
  onBack: () => void
}

export function ItemSelect({ items, categoryLabel, onInstall, onBack }: Props) {
  const [cursor, setCursor] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useInput((input, key) => {
    if (key.upArrow) setCursor((c) => Math.max(0, c - 1))
    if (key.downArrow) setCursor((c) => Math.min(items.length - 1, c + 1))
    if (input === ' ') {
      setSelected((s) => {
        const next = new Set(s)
        const id = items[cursor].id
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
    }
    if (key.return) {
      const toInstall = items.filter((item) => selected.has(item.id))
      if (toInstall.length > 0) onInstall(toInstall)
    }
    if (key.escape) onBack()
  })

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">
        {categoryLabel} — selecciona items
      </Text>
      <Text> </Text>
      {items.map((item, i) => (
        <Box key={item.id} flexDirection="column">
          <Text color={i === cursor ? 'green' : undefined}>
            {i === cursor ? '▶ ' : '  '}
            {selected.has(item.id) ? '[✓] ' : '[ ] '}
            <Text bold={i === cursor}>{item.name}</Text>
          </Text>
          {i === cursor && (
            <Text dimColor>     {item.description}</Text>
          )}
        </Box>
      ))}
      <Text> </Text>
      <Text dimColor>↑↓ navegar  espacio seleccionar  enter instalar  esc volver</Text>
      {selected.size > 0 && (
        <Text color="yellow">{selected.size} item(s) seleccionado(s)</Text>
      )}
    </Box>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add packages/cli/src/ui/CategoryMenu.tsx packages/cli/src/ui/ItemSelect.tsx
git commit -m "feat(cli): ui/CategoryMenu y ui/ItemSelect con multi-select"
```

---

## Task 11: UI component — InstallProgress

**Files:**
- Create: `packages/cli/src/ui/InstallProgress.tsx`

- [ ] **Step 1: Crear packages/cli/src/ui/InstallProgress.tsx**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add packages/cli/src/ui/InstallProgress.tsx
git commit -m "feat(cli): ui/InstallProgress con spinner y estado por paso"
```

---

## Task 12: index.tsx — App state machine + entry point

**Files:**
- Create: `packages/cli/src/index.tsx`

- [ ] **Step 1: Crear packages/cli/src/index.tsx**

```tsx
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { render, Box, Text, useApp } from 'ink'
import { MainMenu } from './ui/MainMenu.js'
import { StackMenu } from './ui/StackMenu.js'
import { CategoryMenu } from './ui/CategoryMenu.js'
import { ItemSelect } from './ui/ItemSelect.js'
import { InstallProgress } from './ui/InstallProgress.js'
import { loadCatalog, loadCategoryItems, runInstall } from './commands/add.js'
import { createProject } from './commands/create.js'
import type { CategoryRef, ManifestItem, InstallStep } from './types.js'
import type { Stack } from './commands/create.js'

type Screen =
  | { id: 'main-menu' }
  | { id: 'stack-menu' }
  | { id: 'loading'; message: string }
  | { id: 'category-menu'; categories: CategoryRef[] }
  | { id: 'item-select'; category: CategoryRef; items: ManifestItem[] }
  | { id: 'install-progress'; steps: InstallStep[]; done: boolean; docsUrl: string | null }
  | { id: 'error'; message: string }

function App() {
  const { exit } = useApp()
  const [screen, setScreen] = useState<Screen>({ id: 'main-menu' })
  // Preserve categories so ItemSelect's onBack can restore them without re-fetching
  const categoriesRef = useRef<CategoryRef[]>([])

  const handleMainMenuSelect = useCallback(
    (mode: 'create' | 'add') => {
      if (mode === 'create') {
        setScreen({ id: 'stack-menu' })
      } else {
        setScreen({ id: 'loading', message: 'Cargando catálogo...' })
      }
    },
    []
  )

  // spawnSync with stdio:'inherit' conflicts with Ink's TTY control.
  // Exit Ink first, run the scaffolder in the raw terminal, then let the user
  // re-run `npx sanghel-playbook` inside the new project to add patterns.
  const handleStackSelect = useCallback((stack: Stack) => {
    exit()
    const name = `my-${stack}-app`
    const ok = createProject(stack, name)
    if (!ok) {
      console.error('\n✗ Error al crear el proyecto.')
      process.exit(1)
    } else {
      console.log(`\n✓ Proyecto creado. Entra al directorio y corre npx sanghel-playbook para añadir patrones.`)
    }
  }, [exit])

  const handleCategorySelect = useCallback(async (category: CategoryRef) => {
    setScreen({ id: 'loading', message: `Cargando items de ${category.label}...` })
    try {
      const items = await loadCategoryItems(category.id)
      if (items.length === 0) {
        setScreen({ id: 'error', message: `No hay items disponibles en ${category.label} todavía.` })
      } else {
        setScreen({ id: 'item-select', category, items })
      }
    } catch (err) {
      setScreen({ id: 'error', message: `Error al cargar items: ${String(err)}` })
    }
  }, [])

  const handleInstall = useCallback(async (manifests: ManifestItem[]) => {
    const steps: InstallStep[] = []
    setScreen({ id: 'install-progress', steps: [], done: false, docsUrl: null })

    try {
      const docsUrl = await runInstall(manifests, process.cwd(), (step) => {
        steps.push(step)
        setScreen({ id: 'install-progress', steps: [...steps], done: false, docsUrl: null })
      })
      setScreen({ id: 'install-progress', steps: [...steps], done: true, docsUrl })
    } catch (err) {
      steps.push({ label: `Error: ${String(err)}`, status: 'error' })
      setScreen({ id: 'install-progress', steps: [...steps], done: true, docsUrl: null })
    }
  }, [])

  // Load catalog when entering loading screen for 'add' flow
  useEffect(() => {
    if (screen.id !== 'loading') return
    if (screen.message !== 'Cargando catálogo...') return

    loadCatalog()
      .then((categories) => {
        categoriesRef.current = categories
        setScreen({ id: 'category-menu', categories })
      })
      .catch((err) => {
        setScreen({ id: 'error', message: `Error al cargar catálogo: ${String(err)}` })
      })
  }, [screen])

  if (screen.id === 'main-menu') {
    return <MainMenu onSelect={handleMainMenuSelect} />
  }

  if (screen.id === 'stack-menu') {
    return (
      <StackMenu
        onSelect={handleStackSelect}
        onBack={() => setScreen({ id: 'main-menu' })}
      />
    )
  }

  if (screen.id === 'loading') {
    return (
      <Box padding={1}>
        <Text color="cyan">{screen.message}</Text>
      </Box>
    )
  }

  if (screen.id === 'category-menu') {
    return (
      <CategoryMenu
        categories={screen.categories}
        onSelect={handleCategorySelect}
        onBack={() => setScreen({ id: 'main-menu' })}
      />
    )
  }

  if (screen.id === 'item-select') {
    return (
      <ItemSelect
        items={screen.items}
        categoryLabel={screen.category.label}
        onInstall={handleInstall}
        onBack={() => setScreen({ id: 'category-menu', categories: categoriesRef.current })}
      />
    )
  }

  if (screen.id === 'install-progress') {
    return (
      <InstallProgress
        steps={screen.steps}
        done={screen.done}
        docsUrl={screen.docsUrl}
      />
    )
  }

  if (screen.id === 'error') {
    return (
      <Box padding={1}>
        <Text color="red">✗ {screen.message}</Text>
      </Box>
    )
  }

  return null
}

render(<App />)
```

- [ ] **Step 2: Commit**

```bash
git add packages/cli/src/index.tsx
git commit -m "feat(cli): index.tsx — App state machine + entry point Ink"
```

---

## Task 13: Build y verificación end-to-end

**Files:**
- No nuevos archivos — verificación del build y flujo completo

- [ ] **Step 1: Correr todos los tests**

```bash
cd packages/cli && pnpm test
```

Expected: PASS — todos los tests de fetcher, package-manager, installer, scaffolder

- [ ] **Step 2: Compilar el CLI**

```bash
cd packages/cli && pnpm build
```

Expected: `dist/index.js` creado sin errores de TypeScript.

- [ ] **Step 3: Verificar que el shebang está en dist/index.js**

```bash
head -1 packages/cli/dist/index.js
```

Expected: `#!/usr/bin/env node`

- [ ] **Step 4: Test manual — TUI arranca**

Desde el directorio raíz del proyecto o cualquier otro directorio:

```bash
node packages/cli/dist/index.js
```

Expected: aparece el menú principal con las opciones "Crear nuevo proyecto" y "Añadir a proyecto existente". Las flechas navegan. `q` o `ctrl+c` sale.

- [ ] **Step 5: Test manual — flujo añadir (rules)**

Desde un directorio temporal:

```bash
mkdir /tmp/test-playbook && cd /tmp/test-playbook && node <ruta-absoluta>/packages/cli/dist/index.js
```

1. Seleccionar "Añadir a proyecto existente"
2. Seleccionar "Rules & Guides"
3. Marcar "GitHub Flow" con espacio
4. Presionar enter

Expected: el archivo `rules/github-flow.md` aparece en `/tmp/test-playbook/rules/`.

- [ ] **Step 6: Commit final de build**

```bash
cd <raíz del repo>
git add packages/cli/dist/
# Agregar dist/ al .gitignore si no se quiere commitear
echo "packages/cli/dist/" >> .gitignore
git add .gitignore
git commit -m "chore: ignorar dist/ del CLI en git"
```

---

## Task 14: Site docs — actualizar getting-started.mdx

**Files:**
- Modify: `src/content/docs/getting-started.mdx`

- [ ] **Step 1: Actualizar src/content/docs/getting-started.mdx**

Reemplazar el contenido actual con esta versión actualizada que explica el CLI:

```mdx
---
title: Getting Started
description: Bienvenido a sanghel-playbook — patrones, decisiones de componentes y lecciones de software en producción, instalables desde la terminal.
order: 1
---

# Getting Started

Bienvenido a **Sanghel Playbook** — un catálogo vivo de patrones, configuraciones y guías que uso en proyectos de producción.

Puedes consumirlo de dos formas:

---

## CLI/TUI (recomendado)

Instala patrones directamente en tu proyecto desde la terminal, sin necesidad de copiar código manualmente.

```bash
npx sanghel-playbook
```

Al ejecutarlo, aparece una TUI interactiva con dos modos:

- **Crear nuevo proyecto** — scaffoldea React + Vite, Next.js o Astro con las herramientas oficiales, y luego ofrece aplicar patrones del catálogo encima.
- **Añadir a proyecto existente** — navega el catálogo por categoría, selecciona los items que quieres (con espacio), y los instala en tu proyecto actual.

El CLI detecta automáticamente tu package manager (`pnpm`, `yarn` o `npm`) e instala las dependencias necesarias.

### ¿Qué instala?

Cada item del catálogo puede instalar:
- Archivos de código (hooks, componentes, schemas)
- Guías y reglas en markdown
- Dependencias npm requeridas

---

## Documentación navegable (este site)

Explora los patrones con contexto completo: por qué se usan, cuándo aplicarlos, y ejemplos de código. Usa el sidebar para navegar por categoría.

---

## Catálogo actual

El catálogo crece con cada nuevo patrón documentado. Actualmente incluye:

- **React** — patrones de componentes y formularios
- **Next.js** — server actions, middleware, API routes, sessions
- **Astro** — islands, routing, content collections
- **Rules & Guides** — GitHub Flow, Deploy Guide (Vercel)

---

## Contribuir al catálogo

Para añadir un nuevo item:

1. Crear `catalog/{categoria}/{id}/manifest.json` con la metadata
2. Añadir los archivos fuente en `catalog/{categoria}/{id}/files/`
3. Crear la doc en `src/content/docs/catalog/{categoria}/{id}.mdx`
4. Abrir un PR — catálogo y docs se actualizan en el mismo commit
```

- [ ] **Step 2: Verificar que el site compila**

```bash
pnpm build
```

Expected: build de Next.js sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/content/docs/getting-started.mdx
git commit -m "docs: actualizar getting-started con instrucciones del CLI"
```

---

## Verificación final

```bash
# Todos los tests pasan
cd packages/cli && pnpm test

# Build del CLI
pnpm build

# Build del site
cd ../.. && pnpm build

# Test end-to-end manual
mkdir /tmp/final-test && cd /tmp/final-test
node <ruta-a-repo>/packages/cli/dist/index.js
# → Flujo completo: instalar github-flow desde Rules & Guides
# → Verificar que /tmp/final-test/rules/github-flow.md existe
```
