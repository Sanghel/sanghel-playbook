import { compileMDX } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import { CodeBlock } from '@/components/CodeBlock'
import { Callout } from '@/components/Callout'
import { PropsTable } from '@/components/PropsTable'
import type { DocFrontmatter } from './docs'

const components = {
  pre: CodeBlock,
  Callout,
  PropsTable,
}

export interface TocItem {
  id: string
  title: string
  level: number
}

export function extractToc(rawContent: string): TocItem[] {
  const lines = rawContent.split('\n')
  const toc: TocItem[] = []

  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const title = match[2].trim()
      const id = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
      toc.push({ id, title, level })
    }
  }

  return toc
}

export async function renderMDX(source: string) {
  const { content, frontmatter } = await compileMDX<DocFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: 'github-dark',
              keepBackground: false,
            },
          ],
        ],
      },
    },
    components,
  })

  return { content, frontmatter }
}
