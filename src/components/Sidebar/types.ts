export interface NavItem {
  title: string
  href: string
  slug: string[]
}

export interface NavSection {
  title: string
  items: NavItem[]
}
