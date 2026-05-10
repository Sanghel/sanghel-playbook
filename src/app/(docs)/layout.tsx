import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { SearchModal } from '@/components/SearchModal'
import { getNavigation, getAllDocs } from '@/lib/docs'

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const groups = getNavigation()
  const searchDocs = getAllDocs().map((doc) => ({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description ?? '',
    href: `/documentacion/${doc.slug.join('/')}`,
  }))

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar groups={groups} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <SearchModal docs={searchDocs} />
    </div>
  )
}
