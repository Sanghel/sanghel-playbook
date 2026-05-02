import { compileMDX } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import GithubSlugger from 'github-slugger'
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
  const slugger = new GithubSlugger()

  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const title = match[2].trim()
      const id = slugger.slug(title)
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
          rehypeSlug,
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
