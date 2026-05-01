import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { NavSection, NavItem } from '@/components/Sidebar/types'

const DOCS_DIR = path.join(process.cwd(), 'src/content/docs')

export interface DocFrontmatter {
  title: string
  description?: string
  order?: number
}

export interface Doc {
  slug: string[]
  frontmatter: DocFrontmatter
  content: string
}

function getMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) return getMdxFiles(full)
      if (entry.isFile() && entry.name.endsWith('.mdx')) return [full]
      return []
    })
}

function pathToSlug(filePath: string): string[] {
  const relative = path.relative(DOCS_DIR, filePath)
  return relative.replace(/\.mdx$/, '').split(path.sep)
}

export function getAllDocs(): Doc[] {
  const files = getMdxFiles(DOCS_DIR)
  return files
    .map((file) => {
      const raw = fs.readFileSync(file, 'utf-8')
      const { data, content } = matter(raw)
      return {
        slug: pathToSlug(file),
        frontmatter: data as DocFrontmatter,
        content,
      }
    })
    .sort((a, b) => (a.frontmatter.order ?? 99) - (b.frontmatter.order ?? 99))
}

export function getDocBySlug(slug: string[]): Doc | null {
  const filePath = path.join(DOCS_DIR, ...slug) + '.mdx'
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return { slug, frontmatter: data as DocFrontmatter, content }
}

export function getAdjacentDocs(slug: string[]): {
  prev: { title: string; href: string } | null
  next: { title: string; href: string } | null
} {
  const docs = getAllDocs()
  const currentHref = `/docs/${slug.join('/')}`
  const index = docs.findIndex((doc) => `/docs/${doc.slug.join('/')}` === currentHref)

  const prev = index > 0 ? docs[index - 1] : null
  const next = index < docs.length - 1 ? docs[index + 1] : null

  return {
    prev: prev ? { title: prev.frontmatter.title, href: `/docs/${prev.slug.join('/')}` } : null,
    next: next ? { title: next.frontmatter.title, href: `/docs/${next.slug.join('/')}` } : null,
  }
}

export function getNavigation(): NavSection[] {
  const files = getMdxFiles(DOCS_DIR)
  const sections: Map<string, NavItem[]> = new Map()

  for (const file of files) {
    const slug = pathToSlug(file)
    const raw = fs.readFileSync(file, 'utf-8')
    const { data } = matter(raw)
    const fm = data as DocFrontmatter

    const rawSection = slug.length > 1 ? slug[0] : 'General'
    const sectionTitle =
      rawSection.charAt(0).toUpperCase() + rawSection.slice(1).replace(/-/g, ' ')

    const item: NavItem = {
      title: fm.title ?? slug[slug.length - 1].replace(/-/g, ' '),
      href: `/docs/${slug.join('/')}`,
      slug,
    }

    const existing = sections.get(sectionTitle) ?? []
    sections.set(sectionTitle, [...existing, item])
  }

  return Array.from(sections.entries()).map(([title, items]) => ({ title, items }))
}
