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

  const { name, email, company, phone, product, qty, message } = req.body ?? {};
  if (!name || !email || (qty === undefined || qty === null)) {
    return res.status(400).json({ ok: false, message: 'Eksik alan: isim, e-posta ve adet gereklidir.' });
  }

  // basic validation
  const safeName = String(name).trim().slice(0, 200);
  const safeEmail = String(email).trim().slice(0, 200);
  const safeCompany = company ? String(company).trim().slice(0, 200) : null;
  const safePhone = phone ? String(phone).trim().slice(0, 60) : null;
  const safeProduct = product ? String(product).trim().slice(0, 200) : null;
  const safeMessage = message ? String(message).trim().slice(0, 2000) : null;
  const qtyNum = typeof qty === 'string' ? parseInt(qty, 10) : Number(qty);
  if (!Number.isFinite(qtyNum) || qtyNum <= 0) {
    return res.status(400).json({ ok: false, message: 'Adet alanı pozitif bir sayı olmalıdır.' });
  }

  // Persist to DB if configured
  if (process.env.DATABASE_URL) {
    try {
      await prisma.quoteRequest.create({ data: { name: safeName, email: safeEmail, company: safeCompany, phone: safePhone, product: safeProduct, qty: Math.floor(qtyNum), message: safeMessage } });
    } catch (dbErr) {
      if (process.env.NODE_ENV === 'development') console.error('[quote] db save error', dbErr);
      // don't block user
    }
  }

  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;
  const CONTACT_TO = process.env.CONTACT_TO || process.env.NEXT_PUBLIC_CONTACT_TO || 'info@yasarunderwear.com';

  // If SMTP not configured just log and return success
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn('[quote] SMTP not configured - logging request only', { safeName, safeEmail, safeCompany, safePhone, safeProduct, qty: qtyNum, safeMessage });
    return res.status(200).json({ ok: true, message: 'Talebiniz alındı' });
  }

  try {
    const transporter = nodemailer.createTransport({ host: SMTP_HOST, port: SMTP_PORT, secure: SMTP_PORT === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } });
    const subject = `Yeni teklif talebi: ${safeName}`;
    const html = `<p><strong>İsim:</strong> ${safeName}</p><p><strong>E-posta:</strong> ${safeEmail}</p><p><strong>Şirket:</strong> ${safeCompany ?? ''}</p><p><strong>Telefon:</strong> ${safePhone ?? ''}</p><p><strong>Ürün:</strong> ${safeProduct ?? ''}</p><p><strong>Adet:</strong> ${qtyNum}</p><p><strong>Mesaj:</strong></p><div>${safeMessage ?? ''}</div>`;

    await transporter.sendMail({ from: `"Yasar Website" <${SMTP_USER}>`, to: CONTACT_TO, replyTo: safeEmail, subject, text: `${safeMessage ?? ''}\n\nFrom: ${safeName} <${safeEmail}>\nQty: ${qtyNum}`, html });

    return res.status(200).json({ ok: true, message: 'Talebiniz alındı' });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('[quote] sendMail error', err);
    return res.status(500).json({ ok: false, message: 'Sunucu hatası' });
  }
}
