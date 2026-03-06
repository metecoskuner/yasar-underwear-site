import type { NextApiRequest, NextApiResponse } from 'next'

// Quote endpoint removed. Return 410 Gone for any requests to signal removal.
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json')
  return res.status(410).json({ ok: false, message: 'Quote endpoint removed' })
}
