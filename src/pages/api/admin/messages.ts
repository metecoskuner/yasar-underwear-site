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

  // Use DB-backed storage when DATABASE_URL is present (production or local dev with DB)
  if (process.env.DATABASE_URL) {
    if (req.method === 'GET') {
      const msgs = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })
      // Map DB fields to the shape the admin UI expects (from/email/phone/message/read/createdAt)
      const out = msgs.map((m) => ({
        id: m.id,
        from: m.name,
        email: m.email,
        phone: ((m as Record<string, unknown>).phone as string) ?? null,
        message: m.message,
        read: m.read,
        createdAt: (m.createdAt as Date).toISOString(),
      }))

      // Also include any messages that were stored in the file-based fallback (migrated or pre-DB)
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
        // if file read fails, just return DB items
        return res.status(200).json({ messages: out })
      }
    }

    if (req.method === 'POST') {
      const payload = req.body as { name?: string; email?: string; phone?: string; message?: string }
      const created = await prisma.contactMessage.create({ data: { name: payload.name as string, email: payload.email as string, phone: payload.phone ?? undefined, message: payload.message as string } })
      const item = { id: created.id, from: created.name, email: created.email, phone: created.phone ?? null, message: created.message, read: created.read, createdAt: created.createdAt.toISOString() }
      return res.status(200).json({ ok: true, item })
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
