export type DocLink = {
  title: string
  href: string
}

export type DocNavigationProps = {
  prev: DocLink | null
  next: DocLink | null
}
