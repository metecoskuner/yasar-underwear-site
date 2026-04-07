import type { NextApiRequest, NextApiResponse } from 'next'
import { setAuthCookie } from '@/lib/adminAuth'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow credentials in CORS context
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed' })

  const { user, pass } = req.body || {}
  const ADMIN_USER = process.env.ADMIN_USER || 'admin'
  const ADMIN_PASS = process.env.ADMIN_PASS || 'password'

  if (typeof user !== 'string' || typeof pass !== 'string') {
    return res.status(400).json({ ok: false, message: 'Kullanıcı adı ve şifre gerekli' })
  }

  // Trim whitespace
  const trimmedUser = user.trim()
  const trimmedPass = pass.trim()

  if (trimmedUser === ADMIN_USER && trimmedPass === ADMIN_PASS) {
    setAuthCookie(res, trimmedUser)
    return res.status(200).json({ ok: true, message: 'Giriş başarılı' })
  }

  return res.status(401).json({ ok: false, message: 'Kullanıcı adı veya şifre hatalı' })
}
