import React from 'react'
import SEO from '@/components/SEO'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function PrivacyPage(): React.ReactElement {
  const { t } = useLanguage()
  const tr = (key: string, fallback = '') => {
    try {
      const v = t(key)
      return v === key ? fallback : v
    } catch {
      return fallback
    }
  }

  return (
    <>
      <SEO title={tr('privacy.seoTitle', 'Gizlilik Politikası - Yasar')} description={tr('privacy.intro', 'Yasar Gizlilik Politikası')} url="/privacy" />

      <main className="max-w-5xl mx-auto px-4 py-16">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">{tr('privacy.headerTitle', 'Gizlilik Politikası')}</h1>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">{tr('privacy.intro', 'Kişisel verilerinizin korunması, şeffaf ve güvenli işlenmesi bizim için önemlidir. Bu sayfada hangi verileri topladığımızı, nasıl kullandığımızı ve haklarınızı özetliyoruz.')}</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="col-span-1 bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">{tr('privacy.quickSummary', 'Hızlı Özet')}</h3>
            <ul className="text-sm text-slate-700 space-y-2">
              <li>{tr('privacy.sections.personalData', 'Toplanan: İsim, e‑posta, telefon, form verileri ve teknik çerez verileri.')}</li>
              <li>{tr('privacy.sections.whyUse', 'Kullanım: Taleplerinizi yanıtlamak, hizmet sunmak ve geliştirmek.')}</li>
              <li>{tr('privacy.sections.sharing', 'Paylaşım: Sınırlı ve amaç odaklı, alt yükleniciler ile güvenli aktarım.')}</li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-4">
            <article className="bg-white rounded-2xl p-6 shadow-sm border">
              <h2 className="text-xl font-semibold mb-2">{tr('privacy.sections.personalData', 'Hangi verileri topluyoruz?')}</h2>
              <p className="text-slate-700">{tr('privacy.sections.personalData', 'Adınız, e‑posta adresiniz, telefon numaranız ve iletişim formlarına girdiğiniz diğer bilgiler. Ayrıca site kullanımına ilişkin çerez ve teknik veriler (IP adresi, tarayıcı bilgisi, sayfa görüntüleme vb.) toplanabilir.')}</p>
            </article>

            <article className="bg-white rounded-2xl p-6 shadow-sm border">
              <h2 className="text-xl font-semibold mb-2">{tr('privacy.sections.whyUse', 'Verileri neden kullanıyoruz?')}</h2>
              <p className="text-slate-700">{tr('privacy.sections.whyUse', 'Topladığımız veriler; taleplerinize yanıt vermek, hizmetlerimizi sunmak ve geliştirmek, sipariş ve bilgi talebi süreçlerini yürütmek ve yasal yükümlülüklerimizi yerine getirmek için kullanılır.')}</p>
            </article>
          </div>
        </section>

        <section className="space-y-6 mb-10">
          <div className="bg-slate-50 rounded-2xl p-6 border">
            <h3 className="text-lg font-semibold mb-2">{tr('privacy.sections.sharing', 'Veri paylaşımı')}</h3>
            <p className="text-slate-700">{tr('privacy.sections.sharing', 'Verileriniz, açık rızanız veya kanuni zorunluluk olmadıkça üçüncü taraflarla paylaşılmaz. Hizmet sağlamak amacıyla alt yükleniciler (ör. kargo, ödeme sağlayıcıları) ile gerekli ve sınırlı paylaşım yapılabilir; bu aktarımlar güvenli şekilde gerçekleştirilir.')}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">{tr('privacy.sections.rights', 'Haklarınız')}</h3>
            <ul className="list-disc pl-5 text-slate-700 space-y-1">
              <li>{tr('privacy.sections.rights', 'Verilerinize erişme ve düzeltme hakkı')}</li>
              <li>{tr('privacy.sections.rights', 'Verilerin silinmesini ya da işlenmesinin kısıtlanmasını isteme hakkı')}</li>
              <li>{tr('privacy.sections.rights', 'Veri işlenmesine itiraz etme ve veri taşınabilirliği hakkı')}</li>
            </ul>
            <p className="mt-3 text-slate-700">{tr('privacy.sections.securityContact', 'Hak talebinizi iletişime formu üzerinden iletebilirsiniz.')}</p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">{tr('privacy.sections.cookies', 'Çerezler ve izleme')}</h3>
            <p className="text-slate-700">{tr('privacy.sections.cookies', 'Sitede performans ve analitik amaçlı çerezler kullanılabilir. Tarayıcı ayarlarından çerezleri yönetebilir veya devre dışı bırakabilirsiniz; bazı özellikler bu durumda düzgün çalışmayabilir.')}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">{tr('privacy.sections.securityContact', 'Güvenlik')}</h3>
            <p className="text-slate-700">{tr('privacy.sections.securityContact', 'Verilerinizi korumak için makul teknik ve idari önlemler uyguluyoruz. Erişim kontrolleri, şifreleme ve düzenli güvenlik taramaları gibi uygulamalarla veri güvenliğini sağlamaya çalışıyoruz.')}</p>
          </div>
        </section>

        <section className="text-center">
          <p className="text-slate-700">{tr('privacy.sections.securityContact', 'Gizlilik ile ilgili soru, talep veya şikâyetleriniz için lütfen')} <Link href="/contact" className="inline-block mt-2 bg-black text-white rounded-lg px-4 py-2 hover:opacity-95">{tr('privacy.sections.securityContact', 'iletişime geçin')}</Link>.</p>
        </section>
      </main>
    </>
  )
}
