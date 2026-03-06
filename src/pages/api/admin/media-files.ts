import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'

// To avoid bundling large static assets into the serverless function,
// read a small pre-generated index file (`public/media-index.json`) that
// lists media files. In production, convert local `/uploads` or `/media`
// URLs to Cloudinary public URLs (derived from CLOUDINARY_CLOUD_NAME) so
// the function does not rely on local binaries or directory scans.

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const idxPath = path.join(process.cwd(), 'public', 'media-index.json')
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const cloudKey = process.env.CLOUDINARY_API_KEY
    const cloudSecret = process.env.CLOUDINARY_API_SECRET
    const isProd = process.env.NODE_ENV === 'production'

    // In production, if Cloudinary credentials are available, list resources
    // from the Cloudinary folder used by admin uploads (yasar-admin) and
    // return those. This avoids relying on a writable local manifest which
    // isn't persistent on serverless platforms.
    if (isProd && cloudName && cloudKey && cloudSecret) {
      try {
        cloudinary.config({
          cloud_name: cloudName,
          api_key: cloudKey,
          api_secret: cloudSecret,
        })

        // fetch uploaded resources in the `yasar-admin` folder
        const resp = await cloudinary.api.resources({
          type: 'upload',
          prefix: 'yasar-admin/',
          max_results: 500,
        })

        const uploads = Array.isArray(resp.resources)
          ? resp.resources.map((r: any) => ({ name: r.public_id, url: r.secure_url }))
          : []

        // Keep videos empty for now (could query videos separately if needed)
        return res.status(200).json({ videos: [], uploads })
      } catch (e) {
        console.warn('cloudinary list failed, falling back to local index', e)
        // fallthrough to local index behavior
      }
    }

    if (fs.existsSync(idxPath)) {
      const raw = fs.readFileSync(idxPath, 'utf8')
      const parsed = JSON.parse(raw)

      // If Cloudinary is configured but we couldn't list resources, still
      // map any local-relative URLs to Cloudinary URLs so links resolve.
      if (isProd && cloudName) {
        const base = `https://res.cloudinary.com/${cloudName}/image/upload/`

        const mapEntry = (e: any) => {
          if (!e || typeof e.url !== 'string') return e
          if (e.url.startsWith('/')) {
            const fname = e.url.replace(/^\//, '')
            const encoded = fname.split('/').map(encodeURIComponent).join('/')
            const cloudUrl = `${base}${encoded}`
            return { ...e, url: cloudUrl }
          }
          return e
        }

        if (Array.isArray(parsed.videos)) parsed.videos = parsed.videos.map(mapEntry)
        if (Array.isArray(parsed.uploads)) parsed.uploads = parsed.uploads.map(mapEntry)
      }

      return res.status(200).json(parsed)
    }
  } catch (err) {
    // fallthrough to safe empty response
    void err
  }

  // If index file doesn't exist, return empty lists to be safe.
  return res.status(200).json({ videos: [], uploads: [] })
}
