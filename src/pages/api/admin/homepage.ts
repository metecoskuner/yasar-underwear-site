import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs/promises'
import path from 'path'
import { isAuthed } from '@/lib/adminAuth'

const DATA_FILE = path.join(process.cwd(), 'data', 'homepage.json')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthed(req)) return res.status(401).json({ ok: false })

  if (req.method === 'GET') {
    try {
      const raw = await fs.readFile(DATA_FILE, 'utf8')
      const obj = JSON.parse(raw)
      return res.status(200).json({ ok: true, homepage: obj })
    } catch (err) {
      void err
      return res.status(200).json({ ok: true, homepage: { sections: [] } })
    }
  }

  if (req.method === 'POST') {
    // Prevent file writes in DB-enabled environments
    if (process.env.DATABASE_URL) {
      return res.status(501).json({ ok: false, message: 'Saving homepage to files is disabled when DATABASE_URL is set.' })
    }

    try {
      const body = req.body
      const homepage = body && body.homepage !== undefined ? body.homepage : body
      await fs.writeFile(DATA_FILE, JSON.stringify(homepage, null, 2), 'utf8')
      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ ok: false, message: 'write_failed' })
    }
  }

  return res.status(405).json({ ok: false })
}
