import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Offers feature removed
  return res.status(410).json({ error: 'offers feature removed' })
}
