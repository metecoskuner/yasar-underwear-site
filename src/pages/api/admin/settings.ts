import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs/promises'
import path from 'path'
import { isAuthed } from '@/lib/adminAuth'

const DATA_FILE = path.join(process.cwd(), 'data', 'admin-settings.json')

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthed(_req)) return res.status(401).json({ ok: false })

  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    const obj = JSON.parse(raw)
    return res.status(200).json({ ok: true, settings: obj })
  } catch (err) {
    void err
    // if file missing, return defaults
    return res.status(200).json({ ok: true, settings: { users: [], site: {} } })
  }
}
