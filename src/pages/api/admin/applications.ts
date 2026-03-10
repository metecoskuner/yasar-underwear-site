import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { isAuthed } from '@/lib/adminAuth'

const DATA_FILE = path.join(process.cwd(), 'data', 'admin-applications.json')

function readData(): { applications?: Record<string, unknown>[] } {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch { return { applications: [] } }
}

function writeData(obj: { applications?: Record<string, unknown>[] }) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2))
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    if (!isAuthed(req)) return res.status(401).json({ error: 'unauth' })
    const d = readData()
    return res.status(200).json(d)
  }

  if (req.method === 'POST') {
    // public submission endpoint for wholesale / private-label forms
    const d = readData()
    const payload = req.body as Record<string, unknown> || {}
    const item = { id: String(Date.now()), ...payload, createdAt: new Date().toISOString(), read: false }
    d.applications = [item as Record<string, unknown>, ...(d.applications || [])]
    // ensure data dir exists
    try { writeData(d) } catch (err) { console.error('write applications failed', err) }
    return res.status(200).json({ ok: true, item })
  }

  return res.status(405).end()
}
