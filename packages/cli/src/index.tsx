import path from 'path'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { render, Box, Text, useApp } from 'ink'
import { MainMenu } from './ui/MainMenu.js'
import { StackMenu } from './ui/StackMenu.js'
import { PackageManagerMenu } from './ui/PackageManagerMenu.js'
import { ProjectNameInput } from './ui/ProjectNameInput.js'
import { CategoryMenu } from './ui/CategoryMenu.js'
import { ItemSelect } from './ui/ItemSelect.js'
import { IntegrationsSelect } from './ui/IntegrationsSelect.js'
import { InstallProgress } from './ui/InstallProgress.js'
import { loadCatalog, loadCategoryItems, loadItemsByStack, runInstall } from './commands/add.js'
import { createProject, applyTemplate } from './commands/create.js'
import type { CategoryRef, ManifestItem, InstallStep } from './types.js'
import type { PackageManager } from './lib/package-manager.js'
import type { Stack } from './commands/create.js'

type Screen =
  | { id: 'main-menu' }
  | { id: 'stack-menu' }
  | { id: 'pkg-manager'; stack: Stack }
  | { id: 'project-name'; stack: Stack; pkgManager: PackageManager }
  | { id: 'loading'; message: string }
  | { id: 'integrations-select'; stack: Stack; pkgManager: PackageManager; projectName: string; items: ManifestItem[] }
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

  const handleStackSelect = useCallback((stack: Stack) => {
    setScreen({ id: 'pkg-manager', stack })
  }, [])

  const handlePkgManagerSelect = useCallback((stack: Stack, pkgManager: PackageManager) => {
    setScreen({ id: 'project-name', stack, pkgManager })
  }, [])

  const handleProjectNameConfirm = useCallback((stack: Stack, pkgManager: PackageManager, name: string) => {
    setScreen({ id: 'loading', message: 'Cargando integraciones del catálogo...' })
    loadItemsByStack(stack)
      .then(async (items) => {
        // Fall back to all catalog items if none match this stack
        if (items.length === 0) {
          const categories = await loadCatalog()
          const all = await Promise.all(categories.map((c) => loadCategoryItems(c.id).catch(() => [] as ManifestItem[])))
          items = all.flat()
        }
        setScreen({ id: 'integrations-select', stack, pkgManager, projectName: name, items })
      })
      .catch(() => {
        // On error, skip integrations and create directly
        setScreen({ id: 'integrations-select', stack, pkgManager, projectName: name, items: [] })
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // spawnSync with stdio:'inherit' conflicts with Ink's TTY control.
  // Exit Ink first, defer createProject to let Ink finish teardown, then scaffold + extras.
  const handleCreateWithExtras = useCallback((stack: Stack, projectName: string, extras: ManifestItem[], pkgManager: PackageManager) => {
    exit()
    setImmediate(() => {
      void (async () => {
        const ok = createProject(stack, projectName, pkgManager)
        if (!ok) {
          console.error('\n✗ Error al crear el proyecto.')
          process.exit(1)
          return
        }

        const projectCwd = path.join(process.cwd(), projectName)
        const logStep = (step: { label: string; status: string }) => {
          const icon = step.status === 'done' ? '✓' : step.status === 'error' ? '✗' : step.status === 'skipped' ? '⊘' : '…'
          console.log(`  ${icon} ${step.label}`)
        }

        console.log('\nAplicando template Sanghel...')
        try {
          await applyTemplate(stack, projectCwd, pkgManager, logStep)
        } catch (err) {
          console.error(`  ✗ Error aplicando template: ${String(err)}`)
        }

        if (extras.length > 0) {
          console.log('\nInstalando integraciones...')
          try {
            await runInstall(extras, projectCwd, logStep)
          } catch (err) {
            console.error(`  ✗ Error instalando integraciones: ${String(err)}`)
          }
        }

        console.log(`\n✓ Proyecto "${projectName}" listo. Entra al directorio: cd ${projectName}`)
      })()
    })
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

  const handleItemSelectBack = useCallback(() => {
    setScreen({ id: 'category-menu', categories: categoriesRef.current })
  }, [])

  const handleInstall = useCallback(async (manifests: ManifestItem[]) => {
    if (manifests.length === 0) return
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

  const shouldLoadCatalog = screen.id === 'loading' && screen.message === 'Cargando catálogo...'

  // Load catalog when entering loading screen for 'add' flow
  useEffect(() => {
    if (!shouldLoadCatalog) return

    loadCatalog()
      .then((categories) => {
        categoriesRef.current = categories
        setScreen({ id: 'category-menu', categories })
      })
      .catch((err) => {
        setScreen({ id: 'error', message: `Error al cargar catálogo: ${String(err)}` })
      })
  }, [shouldLoadCatalog])

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

  if (screen.id === 'pkg-manager') {
    const { stack } = screen
    return (
      <PackageManagerMenu
        onSelect={(pm) => handlePkgManagerSelect(stack, pm)}
        onBack={() => setScreen({ id: 'stack-menu' })}
      />
    )
  }

  if (screen.id === 'project-name') {
    const { stack, pkgManager } = screen
    return (
      <ProjectNameInput
        stack={stack}
        onConfirm={(name) => handleProjectNameConfirm(stack, pkgManager, name)}
        onBack={() => setScreen({ id: 'pkg-manager', stack })}
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

  if (screen.id === 'integrations-select') {
    const { stack, pkgManager, projectName, items } = screen
    return (
      <IntegrationsSelect
        items={items}
        framework={stack}
        onConfirm={(selected) => handleCreateWithExtras(stack, projectName, selected, pkgManager)}
        onBack={() => setScreen({ id: 'project-name', stack, pkgManager })}
      />
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
        onBack={handleItemSelectBack}
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
      <Box flexDirection="column" padding={1}>
        <Text color="red">✗ {screen.message}</Text>
        <Text dimColor>Ctrl+C para salir</Text>
      </Box>
    )
  }

  return null
}

render(<App />)
