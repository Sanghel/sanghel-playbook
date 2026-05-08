import Link from 'next/link'
import Image from 'next/image'
import { existsSync } from 'fs'
import { join } from 'path'
import { getAllDocs } from '@/lib/docs'
import { TerminalFrame, TerminalFramePlaceholder } from '@/components/TerminalFrame/TerminalFrame'

function hasDemoGif() {
  return existsSync(join(process.cwd(), 'public', 'demo.gif'))
}

export default function Home() {
  const docs = getAllDocs()
  const firstDoc = docs[0]
  const showDemo = hasDemoGif()

  return (
    <div className="flex flex-col items-start max-w-3xl mx-auto px-6 py-16">
      {/* Hero */}
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

      <div className="flex gap-3 mb-20">
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

      {/* Demo section */}
      <div className="w-full">
        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          CLI / TUI
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
          Instala patrones desde la terminal
        </h2>
        <p className="text-base text-zinc-500 dark:text-zinc-400 mb-8">
          Crea proyectos con tu stack favorito, aplica templates con branding propio
          y añade patrones al instante — sin copiar código.
        </p>

        {showDemo ? (
          <TerminalFrame>
            <Image
              src="/demo.gif"
              alt="Sanghel Playbook TUI demo"
              width={820}
              height={500}
              unoptimized
              priority
            />
          </TerminalFrame>
        ) : (
          <TerminalFramePlaceholder>
            <DemoPlaceholder />
          </TerminalFramePlaceholder>
        )}

        <p className="mt-4 text-sm text-zinc-400 dark:text-zinc-500">
          <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
            npx sanghel-playbook
          </code>
          {' '}— funciona con npm, pnpm y yarn.
        </p>
      </div>
    </div>
  )
}

function DemoPlaceholder() {
  return (
    <div className="flex flex-col gap-3 p-6 min-h-[260px] justify-center font-mono text-sm">
      <div className="flex gap-2 items-center">
        <span className="text-zinc-600">$</span>
        <span className="text-zinc-300">npx sanghel-playbook</span>
      </div>
      <div className="pl-4 flex flex-col gap-1 text-zinc-400">
        <div>
          <span className="text-green-400">▶</span>
          {' '}Crear nuevo proyecto
        </div>
        <div className="text-zinc-600">  Añadir a proyecto existente</div>
      </div>
      <div className="pl-4 flex flex-col gap-1 text-zinc-400 mt-1">
        <div className="text-zinc-500 text-xs">Selecciona el stack base:</div>
        <div>
          <span className="text-green-400">▶</span>
          {' '}React + Vite
          <span className="text-zinc-600 text-xs ml-2">Welcome module · components/ · hooks/</span>
        </div>
        <div className="text-zinc-600">  Next.js (create-next-app)</div>
        <div className="text-zinc-600">  Astro</div>
      </div>
      <div className="mt-3 text-zinc-600 text-xs italic">
        — Graba el GIF con: vhs demo.tape
      </div>
    </div>
  )
}
