import type { NextApiRequest, NextApiResponse } from 'next'
import { isAuthed } from '@/lib/adminAuth'

type Data = {
  supabase?: { configured: boolean; hasServiceKey: boolean; hasAnonKey: boolean; error?: string }
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

  result.supabase = {
    configured: !!supabaseUrl,
    hasServiceKey: !!supabaseServiceKey,
    hasAnonKey: !!supabaseAnonKey,
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
