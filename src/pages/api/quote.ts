import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const { name, email, company, phone, product, qty, message } = req.body ?? {};
  if (!name || !email || !qty) {
    return res.status(400).json({ ok: false, message: 'Eksik alan: isim, e-posta ve adet gereklidir.' });
  }

  // TODO: Replace with real persistence (DB, Sheets, or email)
  console.log('New quote request:', { name, email, company, phone, product, qty, message });

  // Return a simple success response for now
  return res.status(200).json({ ok: true, message: 'Talebiniz alındı' });
}
