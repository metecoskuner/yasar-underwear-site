import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Try to query the database
    const count = await prisma.contactMessage.count()
    return res.status(200).json({
      success: true,
      dbConnected: true,
      messageCount: count,
      databaseUrl: process.env.DATABASE_URL ? '***SET***' : 'NOT SET',
      env: process.env.NODE_ENV,
    })
  } catch (error) {
    const err = error as Error
    return res.status(500).json({
      success: false,
      dbConnected: false,
      error: err.message,
      databaseUrl: process.env.DATABASE_URL ? '***SET***' : 'NOT SET',
      env: process.env.NODE_ENV,
    })
  }
}
