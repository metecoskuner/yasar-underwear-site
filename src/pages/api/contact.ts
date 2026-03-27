import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import { isRateLimited } from '@/lib/rateLimiter';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';

type Data = { ok: boolean; message?: string; errors?: Record<string, string[]> };

const contactSchema = z.object({
  name: z.string().min(1, 'İsim zorunlu'),
  email: z.string().email('Geçerli bir e-posta girin'),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(1, 'Mesaj zorunlu'),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const ip = (req.headers['x-forwarded-for'] as string) || (req.socket.remoteAddress ?? 'unknown');
  if (isRateLimited(String(ip))) {
    return res.status(429).json({ ok: false, message: 'Too many requests' });
  }

  const parsed = contactSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    parsed.error.errors.forEach((err) => {
      const key = err.path[0] ? String(err.path[0]) : '_';
      fieldErrors[key] = fieldErrors[key] || [];
      fieldErrors[key].push(err.message);
    });
    return res.status(422).json({ ok: false, message: 'Validation failed', errors: fieldErrors });
  }

  const { name, email, phone, message, company } = parsed.data;

  // Honeypot: if the hidden 'company' field is filled, treat as spam and return success without processing
  if (company && String(company).trim().length > 0) {
    console.warn('[contact] honeypot triggered — logging and ignoring message', { ip, company });
    // Log honeypot hit to DB if available
    if (process.env.DATABASE_URL) {
      try {
        await prisma.honeypotLog.create({ data: { ip: String(ip), userAgent: String(req.headers['user-agent'] ?? ''), submittedValue: String(company) } });
      } catch (logErr) {
        console.error('[contact] failed to log honeypot hit', logErr);
      }
    }
    return res.status(200).json({ ok: true, message: 'Received.' });
  }

  const safeName = String(name).trim().slice(0, 200);
  const safeEmail = String(email).trim().slice(0, 200);
  const safePhone = phone ? String(phone).trim().slice(0, 200) : null;
  const safeMessage = String(message).trim().slice(0, 4000);

  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;
  const CONTACT_TO = process.env.CONTACT_TO || process.env.NEXT_PUBLIC_CONTACT_TO || 'info@yasarunderwear.com';

  // Persist message to DB if DATABASE_URL is configured. This runs before sending email
  // so we don't lose the message if sending fails.
  if (process.env.DATABASE_URL || process.env.SUPABASE_URL) {
    try {
      console.log('[contact] Attempting to save message to database', { name: safeName, email: safeEmail, hasPhone: !!safePhone })
      
      // Try Prisma first
      try {
        const created = await prisma.contactMessage.create({ data: { name: safeName, email: safeEmail, phone: safePhone ?? undefined, message: safeMessage } });
        console.log('[contact] DB save successful via Prisma', { id: created.id })
      } catch (prismaErr) {
        console.warn('[contact] Prisma save failed, falling back to Supabase:', prismaErr instanceof Error ? prismaErr.message : String(prismaErr))
        // Fallback to Supabase — generate ID manually since Supabase JS client doesn't auto-generate CUID
        const supabase = createClient(
          process.env.SUPABASE_URL || '',
          process.env.SUPABASE_SERVICE_KEY || ''
        )
        const generatedId = createId()
        const insertData = { id: generatedId, name: safeName, email: safeEmail, phone: safePhone ?? null, message: safeMessage }
        console.log('[contact] Supabase insert data:', JSON.stringify(insertData))
        const { data: created, error: supabaseErr } = await supabase
          .from('ContactMessage')
          .insert(insertData)
          .select()
        
        if (supabaseErr) {
          console.error('[contact] Supabase save failed - error details:', JSON.stringify(supabaseErr, null, 2))
          throw supabaseErr
        }
        console.log('[contact] DB save successful via Supabase', { created })
      }
    } catch (dbErr) {
      console.error('[contact] db save error (caught):', dbErr instanceof Error ? dbErr.message : String(dbErr))
      if (process.env.NODE_ENV === 'development') console.error('[contact] db save error', dbErr);
      // continue — do not block user because of DB errors
    }
  }

  // If SMTP not configured, log and return success so the UX behaves as delivered.
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn('[contact] SMTP not configured — message logged only', { safeName, safeEmail, safeMessage });
    return res.status(200).json({ ok: true, message: 'Received (no SMTP configured).' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

  const subject = `Yeni iletişim formu: ${safeName}`;
  const html = `<p><strong>İsim:</strong> ${safeName}</p><p><strong>E-posta:</strong> ${safeEmail}</p>${safePhone ? `<p><strong>Telefon:</strong> ${safePhone}</p>` : ''}<p><strong>Mesaj:</strong></p><div>${safeMessage.replace(/\n/g, '<br/>')}</div>`;

    await transporter.sendMail({
      from: `"Yasar Website" <${SMTP_USER}>`,
      to: CONTACT_TO,
      replyTo: safeEmail,
      subject,
      text: `${safeMessage}\n\nFrom: ${safeName} <${safeEmail}>${safePhone ? `\nPhone: ${safePhone}` : ''}`,
      html,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('[contact] sendMail error', err);
    return res.status(500).json({ ok: false, message: 'Failed to send message' });
  }
}
