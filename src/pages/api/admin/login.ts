import type { NextApiRequest, NextApiResponse } from 'next'
import { setAuthCookie } from '@/lib/adminAuth'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow credentials in CORS context
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed' })

  const { user, pass } = req.body || {}
  const ADMIN_USER = process.env.ADMIN_USER || 'admin'
  const ADMIN_PASS = process.env.ADMIN_PASS || 'password'

  console.log('[LOGIN] Received:', { user, pass, ADMIN_USER, ADMIN_PASS })

  if (typeof user !== 'string' || typeof pass !== 'string') {
    return res.status(400).json({ ok: false, message: 'Kullanıcı adı ve şifre gerekli' })
  }

  // Trim whitespace
  const trimmedUser = user.trim()
  const trimmedPass = pass.trim()

  console.log('[LOGIN] After trim:', { trimmedUser, trimmedPass, ADMIN_USER, ADMIN_PASS })
  console.log('[LOGIN] Match check:', {
    userMatch: trimmedUser === ADMIN_USER,
    passMatch: trimmedPass === ADMIN_PASS,
  })

  if (trimmedUser === ADMIN_USER && trimmedPass === ADMIN_PASS) {
    setAuthCookie(res, trimmedUser)
    console.log('[LOGIN] SUCCESS')
    return res.status(200).json({ ok: true, message: 'Giriş başarılı' })
  }

  console.log('[LOGIN] FAILED')
  return res.status(401).json({ ok: false, message: 'Kullanıcı adı veya şifre hatalı' })
}
