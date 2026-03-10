import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

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

  try {
    // Log the submission server-side
    console.log('[/api/b2b] received', { body });

    // Persist to admin-applications.json so submissions appear in admin panel
    try {
      const d = readData();
      const item = { id: String(Date.now()), type: body.type || 'unknown', payload: body.payload || {}, createdAt: new Date().toISOString(), read: false };
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
