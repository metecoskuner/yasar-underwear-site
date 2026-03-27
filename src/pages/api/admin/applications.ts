import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { isAuthed } from '@/lib/adminAuth'
import { createClient } from '@supabase/supabase-js'

const DATA_FILE = path.join(process.cwd(), 'data', 'admin-applications.json')

function readData(): { applications?: Record<string, unknown>[] } {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch { return { applications: [] } }
}

function writeData(obj: { applications?: Record<string, unknown>[] }) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2))
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    if (!isAuthed(req)) return res.status(401).json({ error: 'unauth' })
    
    // Try to get from Supabase first
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      try {
        const supabase = createClient(
          process.env.SUPABASE_URL,
          process.env.SUPABASE_SERVICE_KEY
        )
        const { data: apps, error } = await supabase
          .from('B2BApplication')
          .select('*')
          .order('createdAt', { ascending: false })

        if (error) throw error

        // Map database fields to expected shape
        const mappedApps = (apps || []).map((app: Record<string, unknown>) => ({
          id: app.id as string,
          type: app.type as string,
          payload: app.payload,
          read: app.read as boolean,
          createdAt: typeof app.createdAt === 'string' ? app.createdAt : new Date(app.createdAt as Date).toISOString(),
        }))

        // Also include file-based apps as fallback
        try {
          const fileData = readData()
          const fileApps = (fileData.applications || []).map((app: Record<string, unknown>) => ({
            id: (app.id as string) ?? `file-${app.createdAt ?? Date.now()}`,
            type: (app.type as string) ?? 'unknown',
            payload: app.payload,
            read: (app.read as boolean) ?? false,
            createdAt: (app.createdAt as string) ?? new Date().toISOString(),
          }))
          
          // Merge DB + file, prefer DB items when id matches
          const byId = new Map<string, Record<string, unknown>>()
          for (const app of fileApps) byId.set(String(app.id), app as Record<string, unknown>)
          for (const app of mappedApps) byId.set(String(app.id), app as Record<string, unknown>)
          const merged = Array.from(byId.values()).sort((a, b) => new Date(String(b.createdAt)).valueOf() - new Date(String(a.createdAt)).valueOf())
          return res.status(200).json({ applications: merged })
        } catch {
          // If file read fails, just return Supabase items
          return res.status(200).json({ applications: mappedApps })
        }
      } catch (err) {
        console.error('[APPLICATIONS GET] Supabase error:', err)
        // Fall through to file-based response
      }
    }

    // Fallback to file-based response
    const d = readData()
    return res.status(200).json(d)
  }

  if (req.method === 'POST') {
    // public submission endpoint for wholesale / private-label forms
    const d = readData()
    const payload = req.body as Record<string, unknown> || {}
    const item = { id: String(Date.now()), ...payload, createdAt: new Date().toISOString(), read: false }
    d.applications = [item as Record<string, unknown>, ...(d.applications || [])]
    // ensure data dir exists
    try { writeData(d) } catch (err) { console.error('write applications failed', err) }
    return res.status(200).json({ ok: true, item })
  }

  return res.status(405).end()
}
