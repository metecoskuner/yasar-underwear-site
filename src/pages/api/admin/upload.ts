import type { NextApiRequest, NextApiResponse } from 'next'
import { isAuthed } from '@/lib/adminAuth'
import formidable from 'formidable'
import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary'

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
  // sanity check Cloudinary env vars early to provide a clearer error
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('cloudinary env vars missing')
    return res.status(500).json({ ok: false, message: 'cloudinary_not_configured' })
  }

  const form = formidable({ multiples: false })

  form.parse(req, async (err: Error | null, fields: formidable.Fields, files: formidable.Files) => {
    if (err) {
      console.error('formidable parse error:', err?.message || err)
      return res.status(500).json({ ok: false, message: 'parse_failed', detail: String(err?.message || err) })
    }
    try {
      const rawFile = files.file
      const file = Array.isArray(rawFile) ? (rawFile[0] as formidable.File) : (rawFile as formidable.File | undefined)
      if (!file) return res.status(400).json({ ok: false, message: 'no_file' })
      // upload to cloudinary using local filepath
      const result = await cloudinary.uploader.upload(file.filepath, { folder: 'yasar-admin' })
      // remove temp file
      try { fs.unlinkSync(file.filepath) } catch (unlinkErr) { console.warn('unlink temp file failed', String(unlinkErr)) }
      return res.status(200).json({ ok: true, url: result.secure_url })
    } catch (e: unknown) {
      const errRec = e as { message?: unknown }
      console.error('cloudinary upload error:', errRec && errRec.message ? errRec.message : e)
      // include non-sensitive error text to aid debugging
      return res.status(500).json({ ok: false, message: 'upload_failed', detail: errRec && errRec.message ? String(errRec.message) : String(e) })
    }
  })
}
