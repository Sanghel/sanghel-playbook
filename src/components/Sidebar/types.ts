export interface NavItem {
  title: string
  href: string
  slug: string[]
}

export interface NavSubSection {
  title: string
  items: NavItem[]
}

export interface NavGroup {
  title: string
  items: NavItem[]
  subsections: NavSubSection[]
}
