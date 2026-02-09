import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { isAuthed } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'

const DATA_FILE = path.join(process.cwd(), 'data', 'admin-offers.json')

function readData(): { offers?: Record<string, unknown>[] } {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch { return { offers: [] } }
}

function writeData(obj: { offers?: Record<string, unknown>[] }) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2))
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthed(req)) return res.status(401).json({ error: 'unauth' })

  if (process.env.DATABASE_URL) {
    if (req.method === 'GET') {
      const items = await prisma.quoteRequest.findMany({ orderBy: { createdAt: 'desc' } })
      const out = items.map((o) => ({
        id: o.id,
        title: `${o.name}${o.company ? ' — ' + o.company : ''}`,
        summary: `${o.message ?? ''}${o.product ? `\nÜrün: ${o.product}` : ''}${o.qty ? `\nAdet: ${o.qty}` : ''}`.trim(),
        email: o.email,
        phone: o.phone ?? null,
        handled: o.handled,
        createdAt: (o.createdAt as Date).toISOString(),
      }))
      return res.status(200).json({ offers: out })
    }

    if (req.method === 'POST') {
      const payload = req.body as { name?: string; email?: string; company?: string; phone?: string; product?: string; qty?: number; message?: string }
      const created = await prisma.quoteRequest.create({ data: { name: payload.name as string, email: payload.email as string, company: payload.company ?? null, phone: payload.phone ?? null, product: payload.product ?? null, qty: Number(payload.qty ?? 0), message: payload.message ?? null } })
      const item = {
        id: created.id,
        title: `${created.name}${created.company ? ' — ' + created.company : ''}`,
        summary: `${created.message ?? ''}${created.product ? `\nÜrün: ${created.product}` : ''}${created.qty ? `\nAdet: ${created.qty}` : ''}`.trim(),
        email: created.email,
        phone: created.phone ?? null,
        handled: created.handled,
        createdAt: created.createdAt.toISOString(),
      }
      return res.status(200).json({ ok: true, item })
    }

    return res.status(405).end()
  }

  // Fallback: file-based behavior
  if (req.method === 'GET') {
    const d = readData()
    return res.status(200).json(d)
  }

  if (req.method === 'POST') {
    const d = readData()
    const payload = req.body as Record<string, unknown>
    const item = { id: String(Date.now()), ...payload, createdAt: new Date().toISOString(), handled: false }
    d.offers = [item as Record<string, unknown>, ...(d.offers || [])]
    writeData(d)
    return res.status(200).json({ ok: true, item })
  }

  return res.status(405).end()
}
