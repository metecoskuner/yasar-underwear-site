import type { NextApiRequest, NextApiResponse } from 'next'
import { isAuthed } from '@/lib/adminAuth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (await isAuthed(req)) return res.status(200).json({ ok: true })
  return res.status(401).json({ ok: false })
}
