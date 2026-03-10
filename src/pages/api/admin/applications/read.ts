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
  if (!isAuthed(req)) return res.status(401).json({ error: 'unauth' })
  if (req.method !== 'POST') return res.status(405).end()
  const { id } = req.body || {}
  if (!id) return res.status(400).json({ error: 'missing id' })

  const d = readData()
  d.applications = (d.applications || []).map((m) => {
    const mid = (m as Record<string, unknown>)['id']
    return String(mid) === String(id) ? { ...(m as Record<string, unknown>), read: true } : m
  })
  writeData(d)
  return res.status(200).json({ ok: true })
}
