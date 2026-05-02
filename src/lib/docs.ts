import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { NavGroup, NavSubSection, NavItem } from '@/components/Sidebar/types'

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

function formatTitle(raw: string): string {
  return raw.charAt(0).toUpperCase() + raw.slice(1).replace(/-/g, ' ')
}

export function getNavigation(): NavGroup[] {
  const docs = getAllDocs()
  const groups: Map<string, NavGroup> = new Map()

  for (const doc of docs) {
    const { slug, frontmatter: fm } = doc
    const item: NavItem = {
      title: fm.title ?? slug[slug.length - 1].replace(/-/g, ' '),
      href: `/docs/${slug.join('/')}`,
      slug,
    }

    if (slug.length === 1) {
      // Root file → "General" group, direct item
      const group = groups.get('General') ?? { title: 'General', items: [], subsections: [] }
      group.items.push(item)
      groups.set('General', group)
    } else if (slug.length === 2) {
      // tech/file → NavGroup from slug[0], direct item
      const groupTitle = formatTitle(slug[0])
      const group = groups.get(groupTitle) ?? { title: groupTitle, items: [], subsections: [] }
      group.items.push(item)
      groups.set(groupTitle, group)
    } else {
      // tech/topic/file → NavGroup from slug[0], NavSubSection from slug[1]
      const groupTitle = formatTitle(slug[0])
      const subTitle = formatTitle(slug[1])
      const group = groups.get(groupTitle) ?? { title: groupTitle, items: [], subsections: [] }
      let sub = group.subsections.find((s) => s.title === subTitle)
      if (!sub) {
        sub = { title: subTitle, items: [] }
        group.subsections.push(sub)
      }
      sub.items.push(item)
      groups.set(groupTitle, group)
    }
  }

  return Array.from(groups.values())
}
