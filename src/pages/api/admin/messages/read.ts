import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { isAuthed } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'

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

  let updated = false

  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    try {
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
      const { error } = await supabase.from('ContactMessage').update({ read: true }).eq('id', String(id))
      if (error) throw error
    } catch {}
    updated = true
  }

  if (process.env.DATABASE_URL) {
    try {
      await prisma.contactMessage.update({ where: { id: String(id) }, data: { read: true } as unknown as Record<string, unknown> })
      updated = true
    } catch {}
  }

  const d = readData()
  const nextMessages = (d.messages || []).map((m) => {
    const mid = (m as Record<string, unknown>)['id']
    return String(mid) === String(id) ? { ...(m as Record<string, unknown>), read: true } : m
  })
  const fileChanged = nextMessages.some((m) => String((m as Record<string, unknown>).id) === String(id) && Boolean((m as Record<string, unknown>).read))
  d.messages = nextMessages
  if (fileChanged) {
    writeData(d)
    updated = true
  }

  if (!updated) return res.status(404).json({ error: 'message_not_found' })
  return res.status(200).json({ ok: true })
}
