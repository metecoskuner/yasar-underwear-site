import type { NextApiRequest, NextApiResponse } from 'next'
import { setAuthCookie } from '@/lib/adminAuth'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { user, pass } = req.body || {}
  const ADMIN_USER = process.env.ADMIN_USER || 'admin'
  const ADMIN_PASS = process.env.ADMIN_PASS || 'password'

  if (typeof user !== 'string' || typeof pass !== 'string') {
    return res.status(400).json({ ok: false, message: 'invalid' })
  }

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    setAuthCookie(res, user)
    return res.status(200).json({ ok: true })
  }

  return res.status(401).json({ ok: false, message: 'unauthorized' })
}
