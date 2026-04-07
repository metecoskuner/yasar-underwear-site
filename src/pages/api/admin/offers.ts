import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Offers/quote feature has been removed. Return Gone to indicate endpoint is deprecated.
  return res.status(410).json({ error: 'offers feature removed' })
}
