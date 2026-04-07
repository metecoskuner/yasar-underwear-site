import { useState } from 'react'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import SEO from '@/components/SEO'
import { MAP_PLACES } from '@/config/mapPlaces'
import { CONTACT } from '@/config/contactConfig'
import { useLanguage } from '@/contexts/LanguageContext'

const ContactMap = dynamic(() => import('@/components/ContactMap'), { ssr: false })

const ContactPage: NextPage = () => {
  const { t } = useLanguage()
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const tr = (key: string, fallback: string) => {
    try {
      const value = t(key)
      return value === key ? fallback : String(value)
    } catch {
      return fallback
    }
  }

  // Get translated title for a place
  const getTranslatedTitle = (placeId: string): string => {
    const key = `mapPlaces.${placeId}` as const
    const translated = t(key)
    return translated !== key ? (translated as string) : MAP_PLACES.find(p => p.id === placeId)?.title || ''
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setSubmitError('')

    // Send message to API
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(async (res) => {
        const data = await res.json()
        if (res.ok && data.ok) {
          setSuccess(true)
          setForm({ name: '', email: '', phone: '', message: '' })
          setSending(false)
          setTimeout(() => setSuccess(false), 4000)
        } else {
          setSubmitError(data?.message || tr('contact.errorMessage', 'Mesaj gönderilemedi. Lütfen tekrar deneyin.'))
          setSending(false)
        }
      })
      .catch(() => {
        setSubmitError(tr('contact.errorMessage', 'Mesaj gönderilemedi. Lütfen tekrar deneyin.'))
        setSending(false)
      })
  }

  return (
    <>
      <SEO
        title={tr('contact.pageTitle', 'İletişim - Yasar')}
        description={tr('contact.pageDescription', 'Yasar ile iletişime geçin.')}
        url="/contact"
      />

      <main className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">{tr('contact.heading', 'İletişim')}</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {tr('contact.subheading', 'Sorularınız, iş birlikleri ve talepleriniz için bizimle doğrudan iletişime geçebilirsiniz.')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Info Section */}
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200">
                <h2 className="text-2xl font-bold mb-6 text-slate-900">{tr('contact.infoTitle', 'İletişim Bilgileri')}</h2>
                
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
                    <h3 className="font-semibold text-slate-900">{tr('contact.emailLabel', 'E-posta')}</h3>
                    <a href={`mailto:${CONTACT.EMAIL}`} className="text-slate-600 mt-1 inline-block hover:text-slate-900 hover:underline">
                      {CONTACT.EMAIL}
                    </a>
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
                    <h3 className="font-semibold text-slate-900">{tr('contact.phoneLabel', 'Telefon')}</h3>
                    <a href={`tel:${CONTACT.PHONE_MAIN}`} className="text-slate-600 mt-1 inline-block hover:text-slate-900 hover:underline">
                      {CONTACT.PHONE_MAIN}
                    </a>
                    <a href={`tel:${CONTACT.PHONE_MOBILE}`} className="text-sm text-slate-500 mt-1 block hover:text-slate-800 hover:underline">
                      {CONTACT.PHONE_MOBILE}
                    </a>
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
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-3">
                      {tr('contact.addressLabel', 'Adresler')} ({MAP_PLACES.length})
                    </h3>
                    <div className="space-y-2">
                      {MAP_PLACES.map((place) => (
                        <div key={place.id} className="text-sm">
                          <p className="font-medium text-slate-800">{getTranslatedTitle(place.id)}</p>
                          <p className="text-slate-600 text-xs">{place.addr}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={`mailto:${CONTACT.EMAIL}`} className="flex-1 bg-black text-white px-4 py-3 rounded-lg font-medium hover:bg-slate-800 transition text-center">
                  {tr('contact.sendEmailButton', 'E-posta Gönder')}
                </a>
                <a href={`tel:${CONTACT.PHONE_MAIN}`} className="flex-1 border-2 border-black text-black px-4 py-3 rounded-lg font-medium hover:bg-slate-50 transition text-center">
                  {tr('contact.callButton', 'Bizi Ara')}
                </a>
              </div>
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">{tr('contact.formTitle', 'Form Gönder')}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-900 mb-2">
                    {tr('contact.nameLabel', 'İsim')}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    placeholder={tr('contact.namePlaceholder', 'Adınız soyadınız')}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-900 mb-2">
                    {tr('contact.emailFormLabel', 'E-posta')}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    placeholder={tr('contact.emailPlaceholder', 'ornek@mail.com')}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-900 mb-2">
                    {tr('contact.phoneFormLabel', 'Telefon')}
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    placeholder={tr('contact.phonePlaceholder', '+90 5xx xxx xx xx')}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-900 mb-2">
                    {tr('contact.messageLabel', 'Mesaj')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition resize-none"
                    placeholder={tr('contact.messagePlaceholder', 'Mesajınızı yazın')}
                  />
                </div>

                {submitError && (
                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-700 text-sm">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {sending ? tr('contact.sendingButton', 'Gönderiliyor...') : tr('contact.sendButton', 'Gönder')}
                </button>

                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
                    {tr('contact.successMessage', 'Mesajınız başarıyla gönderildi.')}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-16">
            <ContactMap />
          </div>
        </div>
      </main>
    </>
  )
}

export default ContactPage
