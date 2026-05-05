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
      onStep({ label: result.path, status: result.error ? 'error' : result.skipped ? 'skipped' : 'done' })
    }

    if (manifest.deps.dependencies.length > 0) {
      const cmd = getInstallCommand(pm, manifest.deps.dependencies)
      onStep({ label: cmd, status: 'running' })
      try {
        execSync(cmd, { cwd, stdio: 'pipe' })
        onStep({ label: cmd, status: 'done' })
      } catch {
        onStep({ label: cmd, status: 'error' })
        throw new Error(`Failed to install dependencies: ${cmd}`)
      }
    }

    if (manifest.deps.devDependencies.length > 0) {
      const cmd = getInstallCommand(pm, manifest.deps.devDependencies, true)
      onStep({ label: cmd, status: 'running' })
      try {
        execSync(cmd, { cwd, stdio: 'pipe' })
        onStep({ label: cmd, status: 'done' })
      } catch {
        onStep({ label: cmd, status: 'error' })
        throw new Error(`Failed to install devDependencies: ${cmd}`)
      }
    }

    lastDocsUrl = manifest.docsUrl
  }

  return lastDocsUrl
}
