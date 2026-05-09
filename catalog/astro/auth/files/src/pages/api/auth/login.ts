import type { APIRoute } from 'astro'
import { lucia } from '../../../lib/auth'
import { generateId } from 'lucia'
import { db } from '../../../lib/db'

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData()
  const email = form.get('email')?.toString() ?? ''

  if (!email) {
    return new Response('Email requerido', { status: 400 })
  }

  // TODO: replace with real user lookup + password verification
  let user = db.prepare('SELECT * FROM user WHERE email = ?').get(email) as { id: string } | undefined

  if (!user) {
    const userId = generateId(15)
    db.prepare('INSERT INTO user (id, email) VALUES (?, ?)').run(userId, email)
    user = { id: userId }
  }

  const session = await lucia.createSession(user.id, {})
  const sessionCookie = lucia.createSessionCookie(session.id)
  cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

  return redirect('/')
}
