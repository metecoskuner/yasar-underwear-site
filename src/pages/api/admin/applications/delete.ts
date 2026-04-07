import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { isAuthed } from '@/lib/adminAuth'
import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthed(req)) return res.status(401).json({ error: 'unauth' })
  if (req.method !== 'POST') return res.status(405).end()
  const { id } = req.body || {}
  if (!id) return res.status(400).json({ error: 'missing id' })

  let deleted = false

  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
    const { error } = await supabase
      .from('B2BApplication')
      .delete()
      .eq('id', String(id))

    if (error) {
      console.error(error)
    } else {
      deleted = true
    }
  }

  if (process.env.DATABASE_URL) {
    try {
      await prisma.b2BApplication.delete({ where: { id: String(id) } })
      deleted = true
    } catch (err) {
      console.error(err)
    }
  }

  const d = readData()
  const prevLength = (d.applications || []).length
  d.applications = (d.applications || []).filter((m) => String((m as Record<string, unknown>).id) !== String(id))
  if ((d.applications || []).length !== prevLength) {
    writeData(d)
    deleted = true
  }

  if (!deleted) return res.status(404).json({ error: 'application_not_found' })
  return res.status(200).json({ ok: true })
}
