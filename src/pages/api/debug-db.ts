import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Product tablosundan örnek 5 ürün al
    const { data: products, error: productError } = await supabase
      .from('Product')
      .select('*')
      .limit(5);
    if (productError) throw productError;

    // ContactMessage tablosundan örnek 5 mesaj al
    const { data: messages, error: messageError } = await supabase
      .from('ContactMessage')
      .select('*')
      .limit(5);
    if (messageError) throw messageError;

    res.status(200).json({ products, messages });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
}
