import type { NextApiRequest, NextApiResponse } from 'next'
import { isAuthedApi } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'

function csvEscape(v: unknown) {
  if (v === null || v === undefined) return ''
  const s = String(v)
  // Escape double quotes by doubling them, wrap in quotes
  return '"' + s.replace(/"/g, '""') + '"'
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!isAuthedApi(req)) return res.status(401).json({ ok: false, message: 'Unauthorized' })

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
    if (ip) where.ip = { contains: ip }

  type HoneypotClient = { honeypotLog?: { findMany: (opts: unknown) => Promise<Record<string, unknown>[]> } }
  const client = prisma as unknown as HoneypotClient
  const rows = client.honeypotLog ? await client.honeypotLog.findMany({ where, orderBy: { createdAt: 'desc' } } as unknown) : []

    // Build CSV
    const header = ['Date', 'IP', 'User Agent', 'Submitted Value']
    const lines = [header.map(csvEscape).join(',')]
    for (const r of rows as Array<Record<string, unknown>>) {
      const date = r.createdAt ? (r.createdAt as Date).toISOString() : ''
      const ipv = r.ip ?? ''
      const ua = r.userAgent ?? ''
      const val = r.submittedValue ?? ''
      lines.push([date, ipv, ua, val].map(csvEscape).join(','))
    }

    const csv = lines.join('\n')
    const filename = `honeypot_hits_${new Date().toISOString().slice(0,10)}.csv`
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.status(200).send(csv)
  } catch (err) {
    console.error('/api/admin/honeypot_export error', err)
    return res.status(500).json({ ok: false, message: 'Server error' })
  }
}
