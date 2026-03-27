import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { isAuthed } from '@/lib/adminAuth'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthed(req)) return res.status(401).json({ ok: false, message: 'unauthorized' })
  try {
    if (req.method === 'POST') {
      const { content } = req.body || {}
      if (content === undefined) return res.status(400).json({ ok: false, message: 'missing_content' })
      
      const valueStr = typeof content === 'string' ? content : JSON.stringify(content)
      
      // Try Prisma first
      try {
        const existing = await prisma.siteContent.findUnique({ where: { key: 'site' } })
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
      } catch (prismaErr: unknown) {
        console.error('prisma siteContent error:', prismaErr)
        
        // Fallback to Supabase
        try {
          console.warn('[ADMIN/CONTENT POST] Prisma failed, falling back to Supabase')
          const supabase = createClient(
            process.env.SUPABASE_URL || '',
            process.env.SUPABASE_SERVICE_KEY || ''
          )
          
          // Try to find existing
          const { data: existing } = await supabase
            .from('SiteContent')
            .select('*')
            .eq('key', 'site')
            .maybeSingle()
          
          if (existing) {
            // Update existing
            const { data: updated, error } = await supabase
              .from('SiteContent')
              .update({ value: valueStr })
              .eq('key', 'site')
              .select()
              .single()
            
            if (error) throw error
            return res.status(200).json({ ok: true, content: updated.value })
          } else {
            // Create new
            const { data: created, error } = await supabase
              .from('SiteContent')
              .insert([{ key: 'site', value: valueStr }])
              .select()
              .single()
            
            if (error) throw error
            return res.status(201).json({ ok: true, content: created.value })
          }
        } catch (supabaseErr: unknown) {
          console.error('[ADMIN/CONTENT POST] Both Prisma and Supabase failed:', supabaseErr)
          const errRec = supabaseErr as { message?: unknown }
          const detail = errRec && errRec.message ? String(errRec.message) : String(supabaseErr)
          return res.status(500).json({ ok: false, message: 'server_error', detail })
        }
      }
    }
    return res.status(405).json({ ok: false })
  } catch (err) {
    console.error(err)
    const errRec = err as { message?: unknown }
    const detail = errRec && errRec.message ? String(errRec.message) : String(err)
    return res.status(500).json({ ok: false, message: 'server_error', detail })
  }
}
