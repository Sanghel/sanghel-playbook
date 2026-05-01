import { notFound } from 'next/navigation'
import { getDocBySlug, getAllDocs, getAdjacentDocs } from '@/lib/docs'
import { renderMDX, extractToc } from '@/lib/mdx'
import { TableOfContents } from '@/components/TableOfContents'
import { DocNavigation } from '@/components/DocNavigation'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string[] }>
}

export async function generateStaticParams() {
  const docs = getAllDocs()
  return docs.map((doc) => ({ slug: doc.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const doc = getDocBySlug(slug)
  if (!doc) return {}
  return {
    title: `${doc.frontmatter.title} — Sanghel Playbook`,
    description: doc.frontmatter.description,
    openGraph: {
      title: doc.frontmatter.title,
      description: doc.frontmatter.description,
      type: 'article',
    },
  }
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params
  const doc = getDocBySlug(slug)

  if (!doc) notFound()

  const { content } = await renderMDX(doc.content)
  const toc = extractToc(doc.content)
  const { prev, next } = getAdjacentDocs(slug)

  return (
    <div className="flex gap-8 w-full max-w-5xl mx-auto px-6 py-10">
      <article className="flex-1 min-w-0">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {doc.frontmatter.title}
          </h1>
          {doc.frontmatter.description && (
            <p className="mt-2 text-lg text-zinc-500 dark:text-zinc-400">
              {doc.frontmatter.description}
            </p>
          )}
        </header>
        <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-code:before:content-none prose-code:after:content-none">
          {content}
        </div>
        <DocNavigation prev={prev} next={next} />
      </article>

      <TableOfContents items={toc} />
    </div>
  )
}
