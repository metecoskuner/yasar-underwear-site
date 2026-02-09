import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';
import { isRateLimited } from '@/lib/rateLimiter';

type Data = { ok: boolean; message?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const ip = (req.headers['x-forwarded-for'] as string) || (req.socket.remoteAddress ?? 'unknown');
  if (isRateLimited(String(ip))) {
    return res.status(429).json({ ok: false, message: 'Too many requests' });
  }

  const { name, email, message } = req.body ?? {};
  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, message: 'Missing fields' });
  }

  const safeName = String(name).trim().slice(0, 200);
  const safeEmail = String(email).trim().slice(0, 200);
  const safeMessage = String(message).trim().slice(0, 4000);

  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;
  const CONTACT_TO = process.env.CONTACT_TO || process.env.NEXT_PUBLIC_CONTACT_TO || 'info@yasarunderwear.com';

  // Persist message to DB if DATABASE_URL is configured. This runs before sending email
  // so we don't lose the message if sending fails.
  if (process.env.DATABASE_URL) {
    try {
      await prisma.contactMessage.create({ data: { name: safeName, email: safeEmail, message: safeMessage } });
    } catch (dbErr) {
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
    const html = `<p><strong>İsim:</strong> ${safeName}</p><p><strong>E-posta:</strong> ${safeEmail}</p><p><strong>Mesaj:</strong></p><div>${safeMessage.replace(/\n/g, '<br/>')}</div>`;

    await transporter.sendMail({
      from: `"Yasar Website" <${SMTP_USER}>`,
      to: CONTACT_TO,
      replyTo: safeEmail,
      subject,
      text: `${safeMessage}\n\nFrom: ${safeName} <${safeEmail}>`,
      html,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('[contact] sendMail error', err);
    return res.status(500).json({ ok: false, message: 'Failed to send message' });
  }
}
