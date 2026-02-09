import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

function listFilesSafe(dir: string) {
  try {
    const files = fs.readdirSync(dir)
    return files.filter(f => f !== '.DS_Store')
  } catch (e) {
    return []
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const root = process.cwd()
  const videosDir = path.join(root, 'public', 'videos')
  const uploadsDir = path.join(root, 'public', 'uploads')

  const videos = listFilesSafe(videosDir).map(f => ({ name: f, url: `/videos/${f}` }))
  const uploads = listFilesSafe(uploadsDir).map(f => ({ name: f, url: `/uploads/${f}` }))

  res.status(200).json({ videos, uploads })
}
