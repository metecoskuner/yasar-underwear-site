import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

// To avoid bundling large static assets into the serverless function,
// read a small pre-generated index file (`public/media-index.json`) that
// lists media files. This prevents the build from including video/image
// binaries in the function bundle (which causes Vercel size limit errors).

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const idxPath = path.join(process.cwd(), 'public', 'media-index.json')
    if (fs.existsSync(idxPath)) {
      const raw = fs.readFileSync(idxPath, 'utf8')
      const parsed = JSON.parse(raw)
      return res.status(200).json(parsed)
    }
  } catch (err) {
    // fallthrough to safe empty response
    void err
  }

  // If index file doesn't exist, return empty lists to be safe.
  return res.status(200).json({ videos: [], uploads: [] })
}
