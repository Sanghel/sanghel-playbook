import { create } from 'zustand'

interface AppState {
  count: number
  user: { name: string; email: string } | null
  increment: () => void
  decrement: () => void
  setUser: (user: AppState['user']) => void
  reset: () => void
}

export const useAppStore = create<AppState>((set) => ({
  count: 0,
  user: null,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setUser: (user) => set({ user }),
  reset: () => set({ count: 0, user: null }),
}))

// Selector hooks for optimized re-renders
export const useCount = () => useAppStore((state) => state.count)
export const useUser = () => useAppStore((state) => state.user)
