import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

type Data = {
  buckets?: Record<string, unknown>[]
  error?: string
  configured?: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).end()
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        configured: false,
        error: 'Supabase URL or SERVICE_KEY not configured',
      })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data: buckets, error } = await supabase.storage.listBuckets()

    if (error) {
      return res.status(500).json({
        configured: true,
        error: `Error listing buckets: ${error.message}`,
      })
    }

    return res.status(200).json({
      configured: true,
      buckets: (buckets || []) as unknown as Record<string, unknown>[],
    })
  } catch (err) {
    return res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    })
  }
}
