import type { NextApiRequest, NextApiResponse } from 'next'
import { isAuthed } from '@/lib/adminAuth'
import formidable from 'formidable'
import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary'
import { createClient } from '@supabase/supabase-js'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthed(req)) return res.status(401).json({ ok: false, message: 'unauthorized' })
  if (req.method !== 'POST') return res.status(405).json({ ok: false })
  
  const form = formidable({ multiples: false })

  form.parse(req, async (err: Error | null, fields: formidable.Fields, files: formidable.Files) => {
    if (err) {
      console.error('[UPLOAD] formidable parse error:', err?.message || err)
      return res.status(500).json({ ok: false, message: 'parse_failed', detail: String(err?.message || err) })
    }
    try {
      const rawFile = files.file
      const file = Array.isArray(rawFile) ? (rawFile[0] as formidable.File) : (rawFile as formidable.File | undefined)
      if (!file) {
        console.error('[UPLOAD] No file provided')
        return res.status(400).json({ ok: false, message: 'no_file' })
      }
      
      console.log('[UPLOAD] File received:', { name: file.originalFilename, size: file.size, type: file.mimetype })
      
      // Try Supabase first
      const supabaseUrl = process.env.SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
      
      if (supabaseUrl && supabaseKey) {
        try {
          console.log('[UPLOAD] Attempting Supabase upload...')
          const supabase = createClient(supabaseUrl, supabaseKey)
          const bucket = 'yasar-admin'
          const original = (file.originalFilename as string) || file.newFilename || path.basename(file.filepath)
          const safeName = `${Date.now()}-${original}`
          const buffer = fs.readFileSync(file.filepath)

          console.log('[UPLOAD] Uploading to Supabase bucket:', bucket, 'as:', safeName)
          const { data: upData, error: upErr } = await supabase.storage.from(bucket).upload(safeName, buffer, {
            contentType: (file.mimetype as string) || 'application/octet-stream',
            upsert: true,
          })
          if (upErr) {
            console.error('[UPLOAD] Supabase upload error:', upErr.message || upErr)
            throw new Error(String(upErr.message || upErr))
          }
          const { data: pubData } = supabase.storage.from(bucket).getPublicUrl(upData.path)
          console.log('[UPLOAD] Supabase SUCCESS:', pubData.publicUrl)
          try { fs.unlinkSync(file.filepath) } catch (unlinkErr) { console.warn('[UPLOAD] unlink failed', String(unlinkErr)) }
          return res.status(200).json({ ok: true, url: pubData.publicUrl })
        } catch (e) {
          console.error('[UPLOAD] Supabase failed, trying Cloudinary:', e)
        }
      }

      // Try Cloudinary
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        try {
          console.log('[UPLOAD] Attempting Cloudinary upload...')
          const result = await cloudinary.uploader.upload(file.filepath, { folder: 'yasar-admin' })
          try { fs.unlinkSync(file.filepath) } catch (unlinkErr) { console.warn('[UPLOAD] unlink failed', String(unlinkErr)) }
          console.log('[UPLOAD] Cloudinary SUCCESS:', result.secure_url)
          return res.status(200).json({ ok: true, url: result.secure_url })
        } catch (e) {
          console.error('[UPLOAD] Cloudinary failed, trying local fallback:', e)
        }
      }

      // Fallback: Save to local public/uploads directory
      try {
        console.log('[UPLOAD] Attempting local file fallback...')
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }
        const original = (file.originalFilename as string) || file.newFilename || `file-${Date.now()}`
        const safeName = `${Date.now()}-${original.replace(/[^a-z0-9.-]/gi, '_')}`
        const destPath = path.join(uploadDir, safeName)
        const buffer = fs.readFileSync(file.filepath)
        fs.writeFileSync(destPath, buffer)
        const publicUrl = `/uploads/${safeName}`
        console.log('[UPLOAD] Local save SUCCESS:', publicUrl)
        try { fs.unlinkSync(file.filepath) } catch (unlinkErr) { console.warn('[UPLOAD] unlink failed', String(unlinkErr)) }
        return res.status(200).json({ ok: true, url: publicUrl })
      } catch (localErr) {
        console.error('[UPLOAD] Local save failed:', localErr)
        return res.status(500).json({ 
          ok: false, 
          message: 'upload_failed',
          detail: 'All upload methods failed. Please configure Supabase or Cloudinary.'
        })
      }
    } catch (e: unknown) {
      const errRec = e as { message?: unknown }
      console.error('[UPLOAD] Unhandled error:', errRec && errRec.message ? errRec.message : e)
      return res.status(500).json({ 
        ok: false, 
        message: 'upload_failed', 
        detail: errRec && errRec.message ? String(errRec.message) : String(e) 
      })
    }
  })
}
