import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Try to query the database
    const count = await prisma.contactMessage.count()
    return NextResponse.json({
      success: true,
      dbConnected: true,
      messageCount: count,
      databaseUrl: process.env.DATABASE_URL ? '***SET***' : 'NOT SET',
      env: process.env.NODE_ENV,
    })
  } catch (error) {
    const err = error as Error
    return NextResponse.json(
      {
        success: false,
        dbConnected: false,
        error: err.message,
        databaseUrl: process.env.DATABASE_URL ? '***SET***' : 'NOT SET',
        env: process.env.NODE_ENV,
      },
      { status: 500 }
    )
  }
}
