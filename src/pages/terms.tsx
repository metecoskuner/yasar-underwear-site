import React from 'react';
import Link from 'next/link';
import SEO from '../components/SEO';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TermsPage(): React.ReactElement {
  const { t } = useLanguage();
  const tr = (key: string, fallback: string) => {
    try {
      const v = t(key);
      return v === key ? fallback : v;
    } catch {
      return fallback;
    }
  };

  return (
    <>
      <SEO title={tr('pages.terms.seo.title', 'Kullanım Şartları - Yasar')} description={tr('pages.terms.seo.description', 'Yasar web sitesinin kullanım şartları ve ziyaretçi sorumlulukları.')} url="/terms" />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <nav className="text-sm text-slate-500 mb-4">
          <Link href="/" className="hover:underline">{tr('pages.terms.breadcrumb.home', 'Anasayfa')}</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800">{tr('pages.terms.breadcrumb.title', 'Kullanım Şartları')}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{tr('pages.terms.header.title', 'Kullanım Şartları')}</h1>
          <p className="text-slate-600 max-w-2xl">{tr('pages.terms.header.intro', 'Bu web sitesini kullanan ziyaretçiler aşağıdaki temel kullanım koşullarını kabul etmiş sayılır.')}</p>
        </header>

        <section>
          <div className="bg-white rounded-2xl p-8 shadow border text-sm">
            <div className="space-y-4 text-slate-700 leading-6">
              <p>Bu sitede yer alan içerikler, görseller, ürün bilgileri ve marka unsurları Yasar&apos;a veya ilgili hak sahiplerine aittir. Yazılı izin olmadan kopyalanamaz, çoğaltılamaz veya ticari amaçla kullanılamaz.</p>
              <p>Site üzerinde yer alan ürün, hizmet ve iletişim bilgileri bilgilendirme amacı taşır. Yasar, içerikleri önceden bildirim yapmadan güncelleme hakkını saklı tutar.</p>
              <p>Ziyaretçiler, siteyi hukuka aykırı, yanıltıcı veya sistemlere zarar verecek bir amaçla kullanmamayı kabul eder. Formlar üzerinden iletilen bilgilerin doğru ve güncel olması kullanıcının sorumluluğundadır.</p>
              <p>Bu koşullar hakkında ek bilgiye ihtiyaç duyarsanız bizimle iletişime geçebilirsiniz.</p>
            </div>
            <p>
              <Link href="/contact" className="text-amber-600 hover:underline">{tr('pages.terms.contactLink', 'İletişim sayfasına git')}</Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
