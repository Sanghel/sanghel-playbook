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
