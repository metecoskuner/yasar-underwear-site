import type { NextApiRequest, NextApiResponse } from 'next'
import { isAuthedApi } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'

type Data = { ok: boolean; logs?: Array<{ id: string; ip: string; userAgent?: string | null; submittedValue?: string | null; createdAt: string }>; total?: number; message?: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    if (!isAuthedApi(req)) return res.status(401).json({ ok: false, message: 'Unauthorized' })

    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(200, Math.max(5, Number(req.query.limit) || 25))
    const skip = (page - 1) * limit

    // Optional filters
  const { startDate, endDate, ip } = req.query as Record<string, string | undefined>
  const where: Record<string, unknown> = {}
    if (startDate) {
      const s = new Date(startDate)
      if (!isNaN(s.getTime())) where.createdAt = { ...(where.createdAt || {}), gte: s }
    }
    if (endDate) {
      const e = new Date(endDate)
      if (!isNaN(e.getTime())) where.createdAt = { ...(where.createdAt || {}), lte: e }
    }
    if (ip) {
      // simple contains match
      where.ip = { contains: ip }
    }

    // If prisma client doesn't yet include the typed model (dev scenario), fall back to any
    type HoneypotClient = { honeypotLog?: { count: (opts: unknown) => Promise<number>; findMany: (opts: unknown) => Promise<Record<string, unknown>[]> } }
    const client = prisma as unknown as HoneypotClient
    const [total, rows] = await Promise.all([
      client.honeypotLog ? client.honeypotLog.count({ where } as unknown) : 0,
      client.honeypotLog ? client.honeypotLog.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit } as unknown) : [],
    ])

    const logs = (rows as Array<Record<string, unknown>>).map((r) => ({ id: String(r.id ?? ''), ip: String(r.ip ?? ''), userAgent: r.userAgent as string | undefined, submittedValue: r.submittedValue as string | undefined, createdAt: r.createdAt ? (r.createdAt as Date).toISOString() : '' }))
    return res.status(200).json({ ok: true, logs, total })
  } catch (err) {
    console.error('/api/admin/honeypot error', err)
    return res.status(500).json({ ok: false, message: 'Server error' })
  }
}
