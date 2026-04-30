import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import { getNavigation } from '@/lib/docs'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Sanghel Playbook',
  description: 'Personal playbook of patterns, components, and decisions.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const sections = getNavigation()

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
        <ThemeProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar sections={sections} />
            <div className="flex flex-1 flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
