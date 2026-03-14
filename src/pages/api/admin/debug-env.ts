import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Return env values so we can debug
  return res.status(200).json({
    ADMIN_USER: process.env.ADMIN_USER || '(not set)',
    ADMIN_PASS: process.env.ADMIN_PASS || '(not set)',
    ADMIN_SECRET: process.env.ADMIN_SECRET || '(not set)',
    NODE_ENV: process.env.NODE_ENV || '(not set)',
    DATABASE_URL: process.env.DATABASE_URL
      ? `postgresql://postgres:***@${process.env.DATABASE_URL.split('@')[1] || '(error)'}`
      : '(not set)',
  })
}
