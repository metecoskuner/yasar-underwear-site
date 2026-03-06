import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { isAuthed } from '@/lib/adminAuth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthed(req)) return res.status(401).json({ ok: false, message: 'unauthorized' })
  try {
    if (req.method === 'POST') {
      const { content } = req.body || {}
      if (content === undefined) return res.status(400).json({ ok: false, message: 'missing_content' })
      // upsert site content with key 'site'
      const existing = await prisma.siteContent.findUnique({ where: { key: 'site' } })
      const valueStr = typeof content === 'string' ? content : JSON.stringify(content)
      if (existing) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore TS: prisma client generated types may differ in developer environment
        const updated = await prisma.siteContent.update({ where: { key: 'site' }, data: { value: valueStr } })
        return res.status(200).json({ ok: true, content: updated.value })
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore TS: prisma client generated types may differ in developer environment
      const created = await prisma.siteContent.create({ data: { key: 'site', value: valueStr } })
      return res.status(201).json({ ok: true, content: created.value })
    }
    return res.status(405).json({ ok: false })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, message: 'server_error' })
  }
}
