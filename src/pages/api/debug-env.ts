import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const dbUrl = process.env.DATABASE_URL;
  
  res.status(200).json({
    hasDatabase: !!dbUrl,
    dbUrlPrefix: dbUrl ? dbUrl.substring(0, 50) : 'NOT SET',
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
}
