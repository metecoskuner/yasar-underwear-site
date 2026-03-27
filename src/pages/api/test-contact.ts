import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'

type Data = { 
  ok: boolean
  message?: string
  env?: Record<string, string | boolean>
  prisma?: { success: boolean; error?: string; id?: string }
  supabase?: { success: boolean; error?: string; id?: string }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Test both database methods
  const testData = {
    name: `TEST_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    phone: '5551234567',
    message: 'Production test message',
  }

  const result: Data = {
    ok: false,
    env: {
      DATABASE_URL_set: !!process.env.DATABASE_URL,
      SUPABASE_URL_set: !!process.env.SUPABASE_URL,
      SUPABASE_SERVICE_KEY_set: !!process.env.SUPABASE_SERVICE_KEY,
      NODE_ENV: process.env.NODE_ENV || 'unknown',
    },
    prisma: { success: false },
    supabase: { success: false },
  }

  // Test Prisma
  try {
    console.log('[test-contact] Testing Prisma...')
    const created = await prisma.contactMessage.create({
      data: testData,
    })
    result.prisma = { success: true, id: created.id }
    console.log('[test-contact] Prisma success:', created.id)
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err)
    result.prisma = { success: false, error: errMsg }
    console.error('[test-contact] Prisma failed:', errMsg)
  }

  // Test Supabase
  try {
    console.log('[test-contact] Testing Supabase...')
    const supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_KEY || ''
    )
    const { data: created, error } = await supabase
      .from('ContactMessage')
      .insert(testData)
      .select()

    if (error) {
      result.supabase = { success: false, error: JSON.stringify(error) }
      console.error('[test-contact] Supabase error:', error)
    } else {
      const id = Array.isArray(created) && created[0]?.id ? created[0].id : 'unknown'
      result.supabase = { success: true, id }
      console.log('[test-contact] Supabase success:', id)
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err)
    result.supabase = { success: false, error: errMsg }
    console.error('[test-contact] Supabase catch:', errMsg)
  }

  result.ok = !!(result.prisma?.success || result.supabase?.success)
  result.message = result.ok
    ? 'At least one method succeeded'
    : 'Both methods failed'

  return res.status(200).json(result)
}
