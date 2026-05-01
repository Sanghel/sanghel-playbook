export type TocItem = {
  id: string
  title: string
  level: number
}

export type TableOfContentsProps = {
  items: TocItem[]
}
