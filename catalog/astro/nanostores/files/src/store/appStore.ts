import { atom, map } from 'nanostores'

// Simple atom (primitive value)
export const $count = atom(0)
export const $isLoading = atom(false)

// Map (object with multiple fields)
export const $settings = map({
  theme: 'light' as 'light' | 'dark',
  language: 'es',
})

// Actions
export function increment() { $count.set($count.get() + 1) }
export function decrement() { $count.set($count.get() - 1) }
export function toggleTheme() {
  $settings.setKey('theme', $settings.get().theme === 'light' ? 'dark' : 'light')
}
