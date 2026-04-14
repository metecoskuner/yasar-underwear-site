import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import { createId } from '@paralleldrive/cuid2';

type Body = { type?: string; payload?: Record<string, unknown> };

const DATA_FILE = path.join(process.cwd(), 'data', 'admin-applications.json');

function readData(): { applications?: Record<string, unknown>[] } {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { applications: [] };
  }
}

function writeData(obj: { applications?: Record<string, unknown>[] }) {
  try { fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2)); } catch (err) { void err; }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const body = req.body as Body;
  const id = createId();
  const createdAt = new Date().toISOString();
  const type = body.type || 'unknown';
  const payload = body.payload || {};

  try {
    // Persist to database (with Supabase fallback)
    if (process.env.DATABASE_URL || process.env.SUPABASE_URL) {
      try {
        // Try Prisma first
        try {
          await prisma.b2BApplication.create({
            data: {
              id,
              type,
              createdAt: new Date(createdAt),
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              payload: payload as unknown as any,
            },
          });
        } catch {
          console.warn('[b2b] Prisma save failed, falling back to Supabase');
          const supabase = createClient(
            process.env.SUPABASE_URL || '',
            process.env.SUPABASE_SERVICE_KEY || ''
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const insertData = { id, type, payload: payload as unknown as any, createdAt };
          const { error: supabaseErr } = await supabase
            .from('B2BApplication')
            .insert(insertData)
            .select();

          if (supabaseErr) {
            console.error('[b2b] Supabase save failed');
            throw supabaseErr;
          }
        }
      } catch (dbErr) {
        console.error('[b2b] db save error (caught):', dbErr instanceof Error ? dbErr.message : String(dbErr));
        // continue — do not block user because of DB errors
      }
    }

    // Also persist to admin-applications.json for backward compatibility
    try {
      const d = readData();
      const item = { id, type, payload, createdAt, read: false };
      d.applications = [item as Record<string, unknown>, ...(d.applications || [])];
      writeData(d);
    } catch (err) {
      console.warn('Failed to write application to file', err);
    }

    // If a webhook is configured, forward the payload (best-effort)
    const webhook = process.env.B2B_WEBHOOK || process.env.NEXT_PUBLIC_B2B_WEBHOOK;
    if (webhook) {
      try {
        await fetch(webhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      } catch (err) {
        console.warn('Failed to forward to B2B webhook', err);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[/api/b2b] error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
