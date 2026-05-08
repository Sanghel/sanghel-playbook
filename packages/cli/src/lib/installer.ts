import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
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
