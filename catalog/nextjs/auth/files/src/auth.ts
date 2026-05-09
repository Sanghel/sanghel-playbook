import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // TODO: replace with real DB lookup
        if (credentials.email === 'user@example.com' && credentials.password === 'password') {
          return { id: '1', email: credentials.email as string, name: 'Demo User' }
        }
        return null
      },
    }),
  ],
})
