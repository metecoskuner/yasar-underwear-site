import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { isAuthed } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'

const DATA_FILE = path.join(process.cwd(), 'data', 'admin-messages.json')

function readData(): { messages?: Record<string, unknown>[] } {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch { return { messages: [] } }
}

function writeData(obj: { messages?: Record<string, unknown>[] }) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2))
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthed(req)) return res.status(401).json({ error: 'unauth' })
  if (req.method !== 'POST') return res.status(405).end()
  const { id } = req.body || {}
  if (!id) return res.status(400).json({ error: 'missing id' })

  if (process.env.DATABASE_URL) {
    try {
      await prisma.contactMessage.update({ where: { id: String(id) }, data: { read: true } as unknown as Record<string, unknown> })
      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'db_update_failed' })
    }
  }

  const d = readData()
  d.messages = (d.messages || []).map((m) => {
    const mid = (m as Record<string, unknown>)['id']
    return String(mid) === String(id) ? { ...(m as Record<string, unknown>), read: true } : m
  })
  writeData(d)
  return res.status(200).json({ ok: true })
}
