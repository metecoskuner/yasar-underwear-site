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
    // Persist to database (with Supabase fallback)
    if (process.env.DATABASE_URL || process.env.SUPABASE_URL) {
      try {
        // Try Prisma first
        try {
          await prisma.quote.create({
            data: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              payload: (payload || {}) as unknown as any,
            },
          })
        } catch {
          console.warn('[quote] Prisma save failed, falling back to Supabase')
          const supabase = createClient(
            process.env.SUPABASE_URL || '',
            process.env.SUPABASE_SERVICE_KEY || ''
          )
          const generatedId = createId()
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const insertData = { id: generatedId, payload: (payload || {}) as unknown as any }
          const { error: supabaseErr } = await supabase
            .from('Quote')
            .insert(insertData)
            .select()

          if (supabaseErr) {
            console.error('[quote] Supabase save failed')
            throw supabaseErr
          }
        }
      } catch (dbErr) {
        console.error('[quote] db save error (caught):', dbErr instanceof Error ? dbErr.message : String(dbErr))
        // continue — do not block user because of DB errors
      }
    }

    return res.status(200).json({ ok: true, message: 'Request received successfully' })
  } catch (err) {
    console.error('[quote] error', err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
