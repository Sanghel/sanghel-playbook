import { atom } from 'nanostores'

export interface User {
  id: string
  email: string
  name: string
}

export const $user = atom<User | null>(null)
export const $isAuthenticated = atom(false)

export function setUser(user: User) {
  $user.set(user)
  $isAuthenticated.set(true)
}

export function clearUser() {
  $user.set(null)
  $isAuthenticated.set(false)
}
