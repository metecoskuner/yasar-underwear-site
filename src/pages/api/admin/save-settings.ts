import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs/promises'
import path from 'path'
import { isAuthed } from '@/lib/adminAuth'

const DATA_FILE = path.join(process.cwd(), 'data', 'admin-settings.json')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthed(req)) return res.status(401).json({ ok: false })
  if (req.method !== 'POST') return res.status(405).json({ ok: false })
  // Prevent file writes in production environments (when DATABASE_URL is set).
  if (process.env.DATABASE_URL) {
    return res.status(501).json({ ok: false, message: 'Saving settings to files is disabled when DATABASE_URL is set.' })
  }

  try {
    const body = req.body
    const settings = body && body.settings !== undefined ? body.settings : body
    await fs.writeFile(DATA_FILE, JSON.stringify(settings, null, 2), 'utf8')
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, message: 'write_failed' })
  }
}
