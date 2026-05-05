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
