import type { NextApiRequest, NextApiResponse } from 'next'
import { isAuthed } from '@/lib/adminAuth'
import { createClient } from '@supabase/supabase-js'

type Data = {
  supabase?: { configured: boolean; error?: string }
  cloudinary?: { configured: boolean; error?: string }
  local?: { configured: boolean; error?: string }
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!isAuthed(req)) return res.status(401).json({ message: 'unauthorized' })

  const result: Data = {}

  // Check Supabase
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY

  result.supabase = {
    configured: !!(supabaseUrl && supabaseKey),
  }

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { data: buckets, error } = await supabase.storage.listBuckets()
      if (error) {
        result.supabase.error = `listBuckets error: ${error.message}`
      } else {
        result.supabase.error = `Buckets: ${buckets.map((b: any) => b.name).join(', ')}`
      }
    } catch (e) {
      result.supabase.error = e instanceof Error ? e.message : String(e)
    }
  }

  // Check Cloudinary
  result.cloudinary = {
    configured: !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ),
  }

  // Check local
  result.local = {
    configured: true,
  }

  return res.status(200).json(result)
}
