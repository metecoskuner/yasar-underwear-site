import type { NextApiRequest, NextApiResponse } from 'next'
import { clearAuthCookie } from '@/lib/adminAuth'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  clearAuthCookie(res)
  return res.status(200).json({ ok: true })
}
