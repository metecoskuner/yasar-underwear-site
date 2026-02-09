import type { NextApiRequest, NextApiResponse } from 'next'
import { isAuthed } from '@/lib/adminAuth'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (isAuthed(req)) return res.status(200).json({ ok: true })
  return res.status(401).json({ ok: false })
}
