export interface PropRow {
  name: string
  type: string
  required: boolean
  default?: string
  description: string
}

export interface PropsTableProps {
  rows: PropRow[]
}
