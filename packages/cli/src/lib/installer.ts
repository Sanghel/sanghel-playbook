import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fetchFile } from './fetcher.js'
import type { ManifestItem, ManifestPatch, InstallResult } from '../types.js'

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

    try {
      // file.src is relative to the item root (e.g. "files/src/components/Welcome.tsx")
      // strip the leading "files/" prefix to get the sub-path within the files/ directory
      const subPath = file.src.replace(/^files\//, '')
      const content = await fetchFile(manifest.category, manifest.id, subPath)
      mkdirSync(dirname(destPath), { recursive: true })
      writeFileSync(destPath, content, 'utf-8')
      results.push({ path: file.dest, skipped: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      results.push({ path: file.dest, skipped: false, error: message })
    }
  }

  return results
}

export async function applyPatches(
  patches: ManifestPatch[],
  cwd: string
): Promise<InstallResult[]> {
  const results: InstallResult[] = []

  for (const patch of patches) {
    const filePath = join(cwd, patch.file)

    if (!existsSync(filePath)) {
      results.push({ path: patch.file, skipped: true })
      continue
    }

    try {
      let content = readFileSync(filePath, 'utf-8')

      switch (patch.operation) {
        case 'prepend':
          content = patch.content + '\n' + content
          break
        case 'append':
          content = content + '\n' + patch.content
          break
        case 'append-import': {
          // Insert after the last 'import ' line
          const lines = content.split('\n')
          let lastImportIndex = -1
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].trimStart().startsWith('import ')) {
              lastImportIndex = i
            }
          }
          if (lastImportIndex >= 0) {
            lines.splice(lastImportIndex + 1, 0, patch.content)
          } else {
            lines.unshift(patch.content)
          }
          content = lines.join('\n')
          break
        }
        case 'replace':
          if (!patch.marker) {
            results.push({ path: patch.file, skipped: false, error: 'replace operation requires a marker' })
            continue
          }
          if (!content.includes(patch.marker)) {
            results.push({ path: patch.file, skipped: true })
            continue
          }
          content = content.replace(patch.marker, patch.content)
          break
      }

      writeFileSync(filePath, content, 'utf-8')
      results.push({ path: patch.file, skipped: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      results.push({ path: patch.file, skipped: false, error: message })
    }
  }

  return results
}
