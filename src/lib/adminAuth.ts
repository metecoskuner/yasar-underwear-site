import type { NextApiResponse, NextApiRequest } from 'next'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

// Minimal env-backed auth helper.
// Environment variables expected:
// ADMIN_USER, ADMIN_PASS, ADMIN_SECRET
// This intentionally keeps dependencies small: we use an HMAC signed cookie.

const COOKIE_NAME = 'yasar_admin'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

function signPayload(payload: string, secret: string) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex')
}

function getAdminSecret() {
  return process.env.ADMIN_SECRET || (!IS_PRODUCTION ? 'dev-secret' : '')
}

function getExpectedAdminUser() {
  return process.env.ADMIN_USER || (!IS_PRODUCTION ? 'admin' : '')
}

export function setAuthCookie(res: NextApiResponse, user: string) {
  const secret = getAdminSecret()
  if (!secret) throw new Error('ADMIN_SECRET is not configured')
  const expires = Date.now() + COOKIE_MAX_AGE * 1000
  const payload = `${user}:${expires}`
  const sig = signPayload(payload, secret)
  const token = Buffer.from(`${payload}:${sig}`).toString('base64')

  const secure = process.env.NODE_ENV === 'production'
  const cookie = `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE};${secure ? ' Secure;' : ''}`
  res.setHeader('Set-Cookie', cookie)
}

export function clearAuthCookie(res: NextApiResponse) {
  const cookie = `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;` + (process.env.NODE_ENV === 'production' ? ' Secure;' : '')
  res.setHeader('Set-Cookie', cookie)
}

// Accept a minimal request shape so this can be called from getServerSideProps
export function isAuthed(req?: { headers?: Partial<Record<string, string | string[]>> } ): boolean {
  try {
    let cookieHeader: string | undefined
    if (!req || !req.headers) cookieHeader = undefined
    else {
      const h = req.headers.cookie as unknown
      if (Array.isArray(h)) cookieHeader = h.join(';')
      else if (typeof h === 'string') cookieHeader = h
      else cookieHeader = undefined
    }
    if (!cookieHeader) return false
    const cookies = Object.fromEntries(cookieHeader.split(';').map((c: string) => {
      const [k, ...rest] = c.trim().split('=')
      return [k, rest.join('=')]
    })) as Record<string, string>
    const token = cookies[COOKIE_NAME]
    if (!token) return false
    const decoded = Buffer.from(token, 'base64').toString('utf8')
    const parts = decoded.split(':')
    if (parts.length < 3) return false
    const user = parts[0]
    const expires = Number(parts[1])
    const sig = parts.slice(2).join(':')
    if (Number.isNaN(expires) || Date.now() > expires) return false
    const secret = getAdminSecret()
    if (!secret) return false
    const payload = `${user}:${expires}`
    const expected = signPayload(payload, secret)
    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return false
    // optional: verify user matches ADMIN_USER
    const adminUser = getExpectedAdminUser()
    if (adminUser && adminUser !== user) return false
    // fallback: check data/admin-settings.json if present
    try {
      const DATA_FILE = path.join(process.cwd(), 'data', 'admin-settings.json')
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8')
        const parsed = JSON.parse(raw) as unknown
        if (parsed && typeof parsed === 'object' && 'admin' in parsed) {
          const admin = (parsed as Record<string, unknown>).admin
          if (admin && typeof admin === 'object') {
            const adm = admin as Record<string, unknown>
            if (typeof adm.user === 'string' && adm.user.trim()) {
              if (adm.user !== user) return false
            }
          }
        }
      }
    } catch {
      // ignore
    }
    return true
  } catch (err) {
    void err
    return false
  }
}

// Backwards-compatible alias for older imports that expected `isAuthedApi`
// Some files or cached builds may still import that name; re-export as a
// thin wrapper to avoid runtime build errors.
export function isAuthedApi(req?: NextApiRequest | { headers?: Partial<Record<string, string | string[]>> }): boolean {
  // normalize to the shape expected by isAuthed
  return isAuthed(req as unknown as { headers?: Partial<Record<string, string | string[]>> })
}
