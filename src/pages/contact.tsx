import { useState } from 'react'
import type { NextPage } from 'next'
import SEO from '@/components/SEO'

const ContactPage: NextPage = () => {
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)

    setTimeout(() => {
      setSuccess(true)
      setForm({ name: '', email: '', phone: '', message: '' })
      setSending(false)
      setTimeout(() => setSuccess(false), 4000)
    }, 700)
  }

  return (
    <>
      <SEO
        title="İletişim - Yasar Tekstil"
        description="Yasar Tekstil ile iletişime geçin. Sorularınız, teklifleriniz ve talepleriniz için bize yazın."
        url="/contact"
      />

      <main className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">İletişime Geçin</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Sorularınız, talepleriniz veya önerileriniz için bize ulaşın. En kısa sürede dönüş yapacağız.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Info Section */}
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200">
                <h2 className="text-2xl font-bold mb-6 text-slate-900">İletişim Bilgileri</h2>
                
                {/* Email */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-black text-white">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">E-posta</h3>
                    <p className="text-slate-600 mt-1">info@yasarunderwear.com</p>
                    <p className="text-sm text-slate-500 mt-2">24 saat içinde dönüş yapılır</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-black text-white">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Telefon</h3>
                    <p className="text-slate-600 mt-1">+90 212 520 92 99</p>
                    <p className="text-sm text-slate-500 mt-2">Hafta içi 09:00 - 18:00</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-black text-white">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Adres</h3>
                    <p className="text-slate-600 mt-1">İstanbul, Türkiye</p>
                    <p className="text-sm text-slate-500 mt-2">Tekstil ve iç giyim üreticisi</p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="flex gap-3">
                <a href="mailto:info@yasarunderwear.com" className="flex-1 bg-black text-white px-4 py-3 rounded-lg font-medium hover:bg-slate-800 transition text-center">
                  E-posta Gönder
                </a>
                <a href="tel:+902125209299" className="flex-1 border-2 border-black text-black px-4 py-3 rounded-lg font-medium hover:bg-slate-50 transition text-center">
                  Bizi Ara
                </a>
              </div>
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">Mesaj Gönder</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-900 mb-2">
                    İsim *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    placeholder="Adınız"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-900 mb-2">
                    E-posta *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    placeholder="ornek@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-900 mb-2">
                    Telefon
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    placeholder="+90 555 123 4567"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-900 mb-2">
                    Mesaj *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition resize-none"
                    placeholder="Mesajınızı yazın..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {sending ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                </button>

                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
                    ✓ Mesajınız başarıyla gönderildi! En kısa sürede size geri dönüş yapacağız.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default ContactPage
