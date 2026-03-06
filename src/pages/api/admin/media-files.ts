import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

// To avoid bundling large static assets into the serverless function,
// read a small pre-generated index file (`public/media-index.json`) that
// lists media files. In production, convert local `/uploads` or `/media`
// URLs to Cloudinary public URLs (derived from CLOUDINARY_CLOUD_NAME) so
// the function does not rely on local binaries or directory scans.

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const idxPath = path.join(process.cwd(), 'public', 'media-index.json')
    if (fs.existsSync(idxPath)) {
      const raw = fs.readFileSync(idxPath, 'utf8')
      const parsed = JSON.parse(raw)

      // If Cloudinary is configured, convert local URLs to Cloudinary URLs in production.
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME
      const isProd = process.env.NODE_ENV === 'production'
      if (isProd && cloudName) {
        const base = `https://res.cloudinary.com/${cloudName}/image/upload/`

        const mapEntry = (e: any) => {
          if (!e || typeof e.url !== 'string') return e
          // Only remap local relative URLs that start with a slash
          if (e.url.startsWith('/')) {
            // remove leading slash and encode path segments
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
