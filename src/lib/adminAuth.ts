import type { NextApiRequest } from 'next'

// Lightweight auth stub for the admin scaffold.
// TODO: Replace with real auth (JWT/session, secure cookies, env-based admin user, etc.)

export function isAuthed(_req: NextApiRequest): boolean {
  // default: not authed. Replace with real checks.
  return false
}

export function setAuthCookie() {
  // stub
}

export function clearAuthCookie() {
  // stub
}
