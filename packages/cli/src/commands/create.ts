import { fetchManifest } from '../lib/fetcher.js'
import { installFiles } from '../lib/installer.js'
import { scaffold } from '../lib/scaffolder.js'
import type { PackageManager } from '../lib/package-manager.js'
import type { InstallStep } from '../types.js'
import type { Stack } from '../lib/scaffolder.js'

export type { Stack }

export function createProject(stack: Stack, projectName: string, pkgManager?: PackageManager): boolean {
  return scaffold(stack, projectName)
}

const TEMPLATE_MAP: Partial<Record<Stack, string>> = {
  'react-vite': 'react-vite',
  'nextjs': 'nextjs',
}

export async function applyTemplate(
  stack: Stack,
  projectCwd: string,
  pkgManager: PackageManager | undefined,
  onStep: (step: InstallStep) => void
): Promise<void> {
  const templateId = TEMPLATE_MAP[stack]
  if (!templateId) return

  let manifest
  try {
    manifest = await fetchManifest('templates', templateId)
  } catch {
    // No template found for this stack — skip silently
    return
  }

  const results = await installFiles(manifest, projectCwd)
  for (const result of results) {
    onStep({
      label: result.path,
      status: result.error ? 'error' : result.skipped ? 'skipped' : 'done',
    })
  }
}
