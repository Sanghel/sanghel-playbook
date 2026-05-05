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
