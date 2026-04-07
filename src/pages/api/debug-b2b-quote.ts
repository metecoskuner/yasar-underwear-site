import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

type Data = {
  b2b_applications?: Record<string, unknown>[]
  quotes?: Record<string, unknown>[]
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).end()
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_KEY || ''
    )

    // Get B2B applications
    const { data: b2bApps, error: b2bError } = await supabase
      .from('B2BApplication')
      .select('*')
      .order('createdAt', { ascending: false })
      .limit(5)

    // Get quotes
    const { data: quoteData, error: quoteError } = await supabase
      .from('Quote')
      .select('*')
      .order('createdAt', { ascending: false })
      .limit(5)

    if (b2bError || quoteError) {
      console.error('Errors:', { b2bError, quoteError })
    }

    return res.status(200).json({
      b2b_applications: b2bApps || [],
      quotes: quoteData || [],
    })
  } catch (err) {
    console.error('[debug-b2b-quote] error', err)
    return res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    })
  }
}
