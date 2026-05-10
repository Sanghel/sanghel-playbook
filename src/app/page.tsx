import Link from 'next/link'
import Image from 'next/image'
import { existsSync } from 'fs'
import { join } from 'path'
import { getAllDocs } from '@/lib/docs'
import { TerminalFrame, TerminalFramePlaceholder } from '@/components/TerminalFrame/TerminalFrame'
import { UseCaseCard } from '@/components/UseCaseCard'
import { CopyButton } from '@/components/CopyButton'

const NPX_COMMAND = 'npx sanghel-playbook'
const showDemo = existsSync(join(process.cwd(), 'public', 'demo.gif'))

export default function Home() {
  const docs = getAllDocs()
  const firstDoc = docs[0]

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">

      {/* ── Left 50%: scrollable content ── */}
      <section className="w-full lg:w-1/2 px-10 py-20 xl:px-16 flex flex-col gap-16 overflow-y-auto">

        {/* Hero */}
        <div className="flex flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            CLI · Scaffolding
          </span>

          {/* Brand name */}
          <div className="flex flex-col gap-1 select-none">
            <span className="font-mono font-bold text-3xl xl:text-4xl tracking-[6px] uppercase text-cyan-400">
              Sanghel
            </span>
            <span className="font-mono font-bold text-3xl xl:text-4xl tracking-[6px] uppercase text-indigo-400">
              Scaffolding
            </span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
            Arranca tu proyecto<br />con todo lo que necesitas
          </h1>
          <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md">
            Crea proyectos Next.js, React+Vite y Astro con las integraciones que elijas, configuradas y listas para usar.
          </p>

          {/* npx box + copy button */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center bg-zinc-900 dark:bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden">
              <code className="font-mono text-sm text-green-400 px-4 py-2">
                {NPX_COMMAND}
              </code>
              <CopyButton text={NPX_COMMAND} />
            </div>
            {firstDoc && (
              <Link
                href={`/documentacion/${firstDoc.slug.join('/')}`}
                className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
              >
                Ver documentación →
              </Link>
            )}
          </div>
        </div>

        {/* Use case cards */}
        <div className="flex flex-col gap-5">
          <UseCaseCard
            title="Next.js con autenticación completa"
            description="Proyecto listo con NextAuth v5, sesiones y Credentials provider configurado. Solo añade tu base de datos."
            chips={['NextAuth v5', 'App Router', 'TypeScript']}
          />
          <UseCaseCard
            title="React + Vite con estado y formularios"
            description="Zustand para estado global, React Hook Form con validación y React Query para fetching de datos."
            chips={['Zustand', 'React Query', 'Hook Form']}
          />
          <UseCaseCard
            title="Next.js internacionalizado"
            description="i18next configurado con archivos de traducción en español e inglés y detección automática de idioma."
            chips={['i18next', 'Next.js', 'ES · EN']}
          />
          <UseCaseCard
            title="React + Vite con UI y routing"
            description="React Router DOM con rutas base, Ant Design con tema global y utilidades de formato."
            chips={['React Router', 'Ant Design', 'Day.js']}
          />
          <UseCaseCard
            title="Astro con auth y estado"
            description="Lucia Auth con sesiones basadas en cookies, Nanostores para estado reactivo entre islas."
            chips={['Lucia Auth', 'Nanostores', 'Astro']}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 text-sm text-zinc-400 dark:text-zinc-500 pb-8">
          <a
            href="https://github.com/Sanghel/sanghel-playbook"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            GitHub
          </a>
          {firstDoc && (
            <>
              <span>·</span>
              <Link
                href={`/documentacion/${firstDoc.slug.join('/')}`}
                className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                Documentación
              </Link>
            </>
          )}
          <span>·</span>
          <span>npm · pnpm · yarn</span>
        </div>
      </section>

      {/* ── Right 50%: sticky terminal ── */}
      <aside className="hidden lg:flex lg:w-1/2 sticky top-0 h-screen items-center justify-center bg-zinc-950 dark:bg-[#0a0a0a] p-10 border-l border-zinc-800">
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
      </aside>

    </div>
  )
}

function DemoPlaceholder() {
  return (
    <div className="flex flex-col gap-3 p-6 min-h-[320px] justify-center font-mono text-sm">
      <div className="flex gap-2 items-center">
        <span className="text-zinc-600">$</span>
        <span className="text-zinc-300">npx sanghel-playbook</span>
      </div>
      <div className="pl-4 flex flex-col gap-1 text-zinc-400 mt-1">
        <div><span className="text-green-400">▶</span>{' '}Crear nuevo proyecto</div>
        <div className="text-zinc-600">  Añadir a proyecto existente</div>
      </div>
      <div className="pl-4 flex flex-col gap-1 text-zinc-400 mt-2">
        <div className="text-zinc-500 text-xs">Elige el stack base:</div>
        <div><span className="text-green-400">▶</span>{' '}Next.js</div>
        <div className="text-zinc-600">  React + Vite</div>
        <div className="text-zinc-600">  Astro</div>
      </div>
      <div className="pl-4 flex flex-col gap-1 text-zinc-400 mt-2">
        <div className="text-zinc-500 text-xs">Integraciones:</div>
        <div><span className="text-green-400 text-xs">[✓]</span>{' '}<span className="text-green-400">React Query</span></div>
        <div><span className="text-green-400 text-xs">[✓]</span>{' '}<span className="text-green-400">Zustand</span></div>
        <div><span className="text-zinc-500 text-xs">[ ]</span>{' '}<span className="text-zinc-400">NextAuth v5</span></div>
      </div>
    </div>
  )
}
