import type { PropsTableProps } from './types'

export function PropsTable({ rows = [] }: PropsTableProps) {
  if (!rows || rows.length === 0) return null
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
            <th className="px-4 py-2.5 text-left font-semibold text-zinc-700 dark:text-zinc-300">Prop</th>
            <th className="px-4 py-2.5 text-left font-semibold text-zinc-700 dark:text-zinc-300">Type</th>
            <th className="px-4 py-2.5 text-left font-semibold text-zinc-700 dark:text-zinc-300">Required</th>
            <th className="px-4 py-2.5 text-left font-semibold text-zinc-700 dark:text-zinc-300">Default</th>
            <th className="px-4 py-2.5 text-left font-semibold text-zinc-700 dark:text-zinc-300">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.name}
              className={`border-b border-zinc-100 dark:border-zinc-800/60 last:border-0 ${
                i % 2 === 0 ? '' : 'bg-zinc-50/50 dark:bg-zinc-900/30'
              }`}
            >
              <td className="px-4 py-2.5 font-mono text-xs text-zinc-900 dark:text-zinc-100 font-medium">
                {row.name}
              </td>
              <td className="px-4 py-2.5 font-mono text-xs text-blue-600 dark:text-blue-400">
                {row.type}
              </td>
              <td className="px-4 py-2.5 text-center">
                {row.required ? (
                  <span className="text-red-500">✓</span>
                ) : (
                  <span className="text-zinc-400">—</span>
                )}
              </td>
              <td className="px-4 py-2.5 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                {row.default ?? '—'}
              </td>
              <td className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400">
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
