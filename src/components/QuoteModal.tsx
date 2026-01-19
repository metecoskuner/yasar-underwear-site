import React, { useState } from 'react';
import FocusLock from 'react-focus-lock';

export default function QuoteModal({
  open,
  onClose,
  initialProduct,
}: {
  open: boolean;
  onClose: () => void;
  initialProduct?: string;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [product, setProduct] = useState(initialProduct ?? '');
  const [qty, setQty] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setSuccess(null);
      setError(null);
      // prefill product if provided
      if (initialProduct) setProduct(initialProduct);
    }
  }, [open, initialProduct]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name || !email || !qty) {
      setError('Lütfen isim, e-posta ve adet bilgisini doldurun.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, phone, product, qty, message }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || 'Sunucu hatası');
      setSuccess('Talebiniz alındı — en kısa sürede dönüş yapılacaktır.');
      // clear form except product
      setName('');
      setEmail('');
      setCompany('');
      setPhone('');
      setQty('');
      setMessage('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'Gönderilirken hata oluştu');
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <FocusLock>
        <div
          role="dialog"
          aria-modal="true"
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl mx-4 p-6 ring-1 ring-black/5 transform-gpu transition-all duration-250"
        >
          <button
            aria-label="Kapat"
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-rose-400 hover:bg-rose-50 p-1 rounded-full transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
          >
            ✕
          </button>
          <h3 className="text-lg font-semibold mb-2">Teklif Talebi Gönder</h3>
          <p className="text-sm text-gray-600 mb-4">Kısa bilgi verin, teklif ekibimiz size dönüş yapsın.</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adınız ve Soyadınız"
                className="border rounded px-3 py-2 w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 transition"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta (you@firma.com)"
                type="email"
                className="border rounded px-3 py-2 w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Firma (opsiyonel)"
                className="border rounded px-3 py-2 w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 transition"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Telefon / WhatsApp"
                className="border rounded px-3 py-2 w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="İlgili Ürün (opsiyonel)"
                className="border rounded px-3 py-2 w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 transition"
              />
              <input
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="Tahmini Adet (ör. 1000)"
                className="border rounded px-3 py-2 w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 transition"
              />
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Detaylar / özel istekler"
              className="border rounded px-3 py-2 w-full h-24 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 transition"
            />

            {error && <div className="text-sm text-rose-600">{error}</div>}
            {success && <div className="text-sm text-emerald-600">{success}</div>}

            <div className="flex items-center justify-end space-x-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded border hover:bg-gray-50 transition cursor-pointer">
                İptal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-full bg-amber-400 text-black font-semibold shadow-sm hover:bg-amber-500 transition-colors duration-150 cursor-pointer disabled:opacity-60"
              >
                {submitting ? 'Gönderiliyor...' : 'Teklif İste'}
              </button>
            </div>
          </form>
        </div>
      </FocusLock>
    </div>
  );
}
