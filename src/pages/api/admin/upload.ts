import type { NextApiRequest, NextApiResponse } from 'next'
import { isAuthed } from '@/lib/adminAuth'
import formidable from 'formidable'
import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary'
import { createClient } from '@supabase/supabase-js'
import path from 'path'

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024

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
  
  const form = formidable({
    multiples: false,
    maxFileSize: MAX_UPLOAD_BYTES,
    filter: (part) => !part.mimetype || part.mimetype.startsWith('image/'),
  })

  form.parse(req, async (err: Error | null, fields: formidable.Fields, files: formidable.Files) => {
    if (err) {
      console.error('[UPLOAD] formidable parse error:', err?.message || err)
      const detail = String(err?.message || err)
      const status = detail.toLowerCase().includes('maxfilesize') || detail.toLowerCase().includes('max file size') ? 413 : 500
      return res.status(status).json({ ok: false, message: status === 413 ? 'file_too_large' : 'parse_failed', detail })
    }
    try {
      const rawFile = files.file
      const file = Array.isArray(rawFile) ? (rawFile[0] as formidable.File) : (rawFile as formidable.File | undefined)
      if (!file) {
        console.error('[UPLOAD] No file provided')
        return res.status(400).json({ ok: false, message: 'no_file' })
      }
      
      // Try Supabase first
      const supabaseUrl = process.env.SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
      
      if (supabaseUrl && supabaseKey) {
        try {
          const supabase = createClient(supabaseUrl, supabaseKey)
          const bucketName = 'yasar-admin'
          const original = (file.originalFilename as string) || file.newFilename || path.basename(file.filepath)
          const safeName = `${Date.now()}-${original}`
          const buffer = fs.readFileSync(file.filepath)

          // Try to upload - Supabase will auto-create bucket if it doesn't exist with service role key
          const { data: upData, error: upErr } = await supabase.storage.from(bucketName).upload(safeName, buffer, {
            contentType: (file.mimetype as string) || 'application/octet-stream',
            upsert: true,
          })
          
          if (upErr) {
            console.error('[UPLOAD] Supabase upload error:', upErr.message || upErr)
            // If bucket doesn't exist, try to create it first
            if (upErr.message && upErr.message.includes('not found')) {
              const { data: createData, error: createErr } = await supabase.storage.createBucket(bucketName, {
                public: true,
              })
              if (createErr) {
                console.error('[UPLOAD] Failed to create bucket:', createErr)
                throw new Error(String(createErr.message || createErr))
              }
              void createData
              
              // Try upload again
              const { data: upData2, error: upErr2 } = await supabase.storage.from(bucketName).upload(safeName, buffer, {
                contentType: (file.mimetype as string) || 'application/octet-stream',
                upsert: true,
              })
              if (upErr2) {
                throw new Error(String(upErr2.message || upErr2))
              }
              const { data: pubData2 } = supabase.storage.from(bucketName).getPublicUrl(upData2.path)
              try { fs.unlinkSync(file.filepath) } catch (unlinkErr) { console.warn('[UPLOAD] unlink failed', String(unlinkErr)) }
              return res.status(200).json({ ok: true, url: pubData2.publicUrl })
            }
            throw new Error(String(upErr.message || upErr))
          }
          const { data: pubData } = supabase.storage.from(bucketName).getPublicUrl(upData.path)
          try { fs.unlinkSync(file.filepath) } catch (unlinkErr) { console.warn('[UPLOAD] unlink failed', String(unlinkErr)) }
          return res.status(200).json({ ok: true, url: pubData.publicUrl })
        } catch (e) {
          console.error('[UPLOAD] Supabase failed, trying Cloudinary:', e)
        }
      }

      // Try Cloudinary
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        try {
          const result = await cloudinary.uploader.upload(file.filepath, { folder: 'yasar-admin' })
          try { fs.unlinkSync(file.filepath) } catch (unlinkErr) { console.warn('[UPLOAD] unlink failed', String(unlinkErr)) }
          return res.status(200).json({ ok: true, url: result.secure_url })
        } catch (e) {
          console.error('[UPLOAD] Cloudinary failed, trying local fallback:', e)
        }
      }

      // Fallback: Save to local public/uploads directory
      try {
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
