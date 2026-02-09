import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs/promises'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'admin-content.json')

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    const obj = JSON.parse(raw)
    return res.status(200).json({ content: obj })
  } catch (err) {
    void err
    return res.status(200).json({ content: {} })
  }
}
