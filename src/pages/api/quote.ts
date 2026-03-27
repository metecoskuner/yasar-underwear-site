import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'
import { createId } from '@paralleldrive/cuid2'

type Data = { ok?: boolean; message?: string; error?: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const payload = req.body || {}

  try {
    console.log('[quote] received submission', { hasPayload: !!payload })

    // Persist to database (with Supabase fallback)
    if (process.env.DATABASE_URL || process.env.SUPABASE_URL) {
      try {
        // Try Prisma first
        try {
          const created = await prisma.quote.create({
            data: {
              payload: (payload || {}) as any,
            },
          })
          console.log('[quote] DB save successful via Prisma', { id: created.id })
        } catch (prismaErr) {
          console.warn('[quote] Prisma save failed, falling back to Supabase:', prismaErr instanceof Error ? prismaErr.message : String(prismaErr))
          const supabase = createClient(
            process.env.SUPABASE_URL || '',
            process.env.SUPABASE_SERVICE_KEY || ''
          )
          const generatedId = createId()
          const insertData = { id: generatedId, payload: (payload || {}) as any }
          console.log('[quote] Supabase insert data prepared')
          const { data: created, error: supabaseErr } = await supabase
            .from('Quote')
            .insert(insertData)
            .select()

          if (supabaseErr) {
            console.error('[quote] Supabase save failed - error details:', JSON.stringify(supabaseErr, null, 2))
            throw supabaseErr
          }
          console.log('[quote] DB save successful via Supabase', { created })
        }
      } catch (dbErr) {
        console.error('[quote] db save error (caught):', dbErr instanceof Error ? dbErr.message : String(dbErr))
        // continue — do not block user because of DB errors
      }
    }

    return res.status(200).json({ ok: true, message: 'Quote received successfully' })
  } catch (err) {
    console.error('[quote] error', err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
