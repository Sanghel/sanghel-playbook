import Link from 'next/link'
import { getAllDocs } from '@/lib/docs'

export default function Home() {
  const docs = getAllDocs()
  const firstDoc = docs[0]

  return (
    <div className="flex flex-col items-start max-w-2xl mx-auto px-6 py-16">
      <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        Personal Playbook
      </div>

      <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
        Sanghel Playbook
      </h1>

      <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-10">
        Patterns, components, architectural decisions, and lessons learned.
        A living reference built in the open.
      </p>

      <div className="flex gap-3">
        {firstDoc ? (
          <Link
            href={`/docs/${firstDoc.slug.join('/')}`}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:opacity-80 transition-opacity"
          >
            Get started
            <span>→</span>
          </Link>
        ) : (
          <span className="text-sm text-zinc-400 dark:text-zinc-500 italic">
            No docs yet — add an .mdx file to src/content/docs/ to get started.
          </span>
        )}

        <a
          href="https://github.com/Sanghel/sanghel-playbook"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
        >
          GitHub
        </a>
      </div>
    </div>
  )
}
