import { useState } from 'react';
import SEO from '../components/SEO';

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      alert('Mesaj gönderildi (demo).\n' + JSON.stringify(form));
      setSending(false);
      setForm({ name: '', email: '', message: '' });
    }, 700);
  }

  return (
    <>
      <SEO title="İletişim - Yasar" description="Bize ulaşın — Yasar müşteri hizmetleri ile iletişime geçin." url="/contact" />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-2">İletişim</h2>
        <p className="text-gray-600 mb-6">Bize bir mesaj gönderin, en kısa sürede dönüş yapalım.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">İsim</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm mb-1">E-posta</label>
            <input name="email" value={form.email} onChange={handleChange} type="email" className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Mesaj</label>
            <textarea name="message" value={form.message} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={6} required />
          </div>
          <button type="submit" disabled={sending} className="bg-black text-white px-4 py-2 rounded">
            {sending ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </form>
      </main>
    </>
  );
}