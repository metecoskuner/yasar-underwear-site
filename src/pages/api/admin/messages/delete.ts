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
  if (!(await isAuthed(req))) return res.status(401).json({ error: 'unauth' })
  if (req.method !== 'POST') return res.status(405).end()
  const { id } = req.body || {}
  if (!id) return res.status(400).json({ error: 'missing id' })

  let deleted = false

  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    try {
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
      const { error } = await supabase.from('ContactMessage').delete().eq('id', String(id))
      if (error) throw error
    } catch (err) {
      console.error(err)
    }
    deleted = true
  }

  if (process.env.DATABASE_URL) {
    try {
      await prisma.contactMessage.delete({ where: { id: String(id) } })
      deleted = true
    } catch (err) {
      console.error(err)
    }
  }

  const d = readData()
  const prevLength = (d.messages || []).length
  d.messages = (d.messages || []).filter((m) => String((m as Record<string, unknown>).id) !== String(id))
  if ((d.messages || []).length !== prevLength) {
    writeData(d)
    deleted = true
  }

  if (!deleted) return res.status(404).json({ error: 'message_not_found' })
  return res.status(200).json({ ok: true })
}
