import { notFound } from 'next/navigation'
import { getDocBySlug, getAllDocs } from '@/lib/docs'
import { renderMDX, extractToc } from '@/lib/mdx'
import type { Metadata } from 'next'
import Link from 'next/link'

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
      </article>

      {toc.length > 0 && (
        <aside className="hidden xl:block w-52 shrink-0">
          <div className="sticky top-20">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              On this page
            </p>
            <ul className="flex flex-col gap-1.5">
              {toc.map((item) => (
                <li
                  key={item.id}
                  style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                >
                  <Link
                    href={`#${item.id}`}
                    className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </div>
  )
}
