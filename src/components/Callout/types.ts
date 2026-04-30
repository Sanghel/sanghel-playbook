export type CalloutVariant = 'tip' | 'warning' | 'danger' | 'info'

export interface CalloutProps {
  variant?: CalloutVariant
  children: React.ReactNode
}
