import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { isAuthed } from '@/lib/adminAuth'
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

  // Use Supabase when env variables are present
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    )

    if (req.method === 'GET') {
      try {
        const { data: msgs, error } = await supabase
          .from('ContactMessage')
          .select('*')
          .order('createdAt', { ascending: false })

        if (error) throw error

        // Map Supabase fields to the shape the admin UI expects
        const out = (msgs || []).map((m: Record<string, unknown>) => ({
          id: m.id as string,
          from: m.name as string,
          email: m.email as string,
          phone: (m.phone as string) ?? null,
          message: m.message as string,
          read: m.read as boolean,
          createdAt: typeof m.createdAt === 'string' ? m.createdAt : new Date(m.createdAt as Date).toISOString(),
        }))

        // Also try to include file-based messages as fallback
        try {
          const file = readData()
          const fileMsgs = (file.messages || []) as Record<string, unknown>[]
          const mappedFile = fileMsgs.map((fm) => {
            const f = fm as Record<string, unknown>
            return {
              id: (f.id as string) ?? `file-${f.createdAt ?? Date.now()}`,
              from: (f.name as string) ?? (f.from as string) ?? 'Anonim',
              email: (f.email as string) ?? null,
              phone: (f.phone as string) ?? null,
              message: (f.message as string) ?? (f.body as string) ?? '',
              read: (f.read as boolean) ?? false,
              createdAt: (f.createdAt as string) ?? new Date().toISOString(),
            }
          })
          // merge DB + file, prefer DB items when id matches
          const byId = new Map<string, Record<string, unknown>>()
          for (const i of mappedFile) byId.set(String(i.id), i as Record<string, unknown>)
          for (const i of out) byId.set(String(i.id), i as Record<string, unknown>)
          const merged = Array.from(byId.values()).sort((a, b) => new Date(String(b.createdAt)).valueOf() - new Date(String(a.createdAt)).valueOf())
          return res.status(200).json({ messages: merged })
        } catch {
          // if file read fails, just return Supabase items
          return res.status(200).json({ messages: out })
        }
      } catch (err) {
        console.error('[MESSAGES GET] Error:', err)
        return res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' })
      }
    }

    if (req.method === 'POST') {
      try {
        const payload = req.body as { name?: string; email?: string; phone?: string; message?: string }
        const { data: createdArray, error } = await supabase
          .from('ContactMessage')
          .insert({ name: payload.name, email: payload.email, phone: payload.phone ?? null, message: payload.message })
          .select()

        if (error) {
          console.error('[MESSAGES POST] Supabase error:', error)
          throw error
        }

        if (!createdArray || !Array.isArray(createdArray) || createdArray.length === 0) {
          throw new Error('No data returned from insert')
        }

        const created = createdArray[0] as Record<string, unknown>
        const item = {
          id: String(created.id ?? ''),
          from: String(created.name ?? ''),
          email: String(created.email ?? ''),
          phone: (created.phone as string) ?? null,
          message: String(created.message ?? ''),
          read: !!created.read,
          createdAt: typeof created.createdAt === 'string' ? created.createdAt : new Date(created.createdAt as Date).toISOString(),
        }
        return res.status(200).json({ ok: true, item })
      } catch (err) {
        console.error('[MESSAGES POST] Error:', err)
        return res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' })
      }
    }

    return res.status(405).end()
  }

  // Fallback: file-based behavior for environments without DATABASE_URL
  if (req.method === 'GET') {
    const d = readData()
    return res.status(200).json(d)
  }

  if (req.method === 'POST') {
    const d = readData()
    const payload = req.body as Record<string, unknown>
    const item = { id: String(Date.now()), ...payload, createdAt: new Date().toISOString(), read: false }
    d.messages = [item as Record<string, unknown>, ...(d.messages || [])]
    writeData(d)
    return res.status(200).json({ ok: true, item })
  }

  return res.status(405).end()
}
