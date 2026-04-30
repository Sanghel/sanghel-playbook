import type { CalloutProps, CalloutVariant } from './types'

const variantConfig: Record<
  CalloutVariant,
  { icon: string; className: string; labelClassName: string; label: string }
> = {
  tip: {
    icon: '💡',
    label: 'Tip',
    className:
      'border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300',
    labelClassName: 'text-emerald-700 dark:text-emerald-400',
  },
  info: {
    icon: 'ℹ️',
    label: 'Info',
    className:
      'border-blue-500/40 bg-blue-500/10 text-blue-900 dark:text-blue-300',
    labelClassName: 'text-blue-700 dark:text-blue-400',
  },
  warning: {
    icon: '⚠️',
    label: 'Warning',
    className:
      'border-yellow-500/40 bg-yellow-500/10 text-yellow-900 dark:text-yellow-300',
    labelClassName: 'text-yellow-700 dark:text-yellow-400',
  },
  danger: {
    icon: '🚨',
    label: 'Danger',
    className:
      'border-red-500/40 bg-red-500/10 text-red-900 dark:text-red-300',
    labelClassName: 'text-red-700 dark:text-red-400',
  },
}

export function Callout({ variant = 'info', children }: CalloutProps) {
  const config = variantConfig[variant]

  return (
    <div className={`my-6 flex gap-3 rounded-lg border px-4 py-3 text-sm ${config.className}`}>
      <span className="shrink-0 text-base leading-5">{config.icon}</span>
      <div className="flex flex-col gap-1">
        <span className={`font-semibold text-xs uppercase tracking-wide ${config.labelClassName}`}>
          {config.label}
        </span>
        <div className="leading-relaxed [&_p]:m-0">{children}</div>
      </div>
    </div>
  )
}
