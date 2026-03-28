import type { NextApiRequest, NextApiResponse } from 'next'
import { isAuthed } from '@/lib/adminAuth'
import { createClient } from '@supabase/supabase-js'

type Data = {
  supabase?: { 
    configured: boolean
    hasServiceKey: boolean
    hasAnonKey: boolean
    keyUsed?: string
    buckets?: Record<string, unknown>[]
    error?: string
  }
  cloudinary?: { configured: boolean }
  local?: { configured: boolean }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!isAuthed(req)) return res.status(401).json({})

  const result: Data = {}

  // Check Supabase keys
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
  const keyUsed = supabaseServiceKey ? 'SERVICE_KEY' : supabaseAnonKey ? 'ANON_KEY' : 'NONE'

  result.supabase = {
    configured: !!supabaseUrl,
    hasServiceKey: !!supabaseServiceKey,
    hasAnonKey: !!supabaseAnonKey,
    keyUsed,
  }

  // Try to list buckets
  if (supabaseUrl && (supabaseServiceKey || supabaseAnonKey)) {
    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey || '')
      const { data: buckets, error } = await supabase.storage.listBuckets()
      if (error) {
        result.supabase.error = `Error: ${error.message}`
      } else {
        result.supabase.buckets = (buckets || []) as unknown as Record<string, unknown>[]
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
