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
      <SEO title={tr('pages.terms.seo.title', 'Kullanım Şartları - Yasar')} description={tr('pages.terms.seo.description', 'Kullanım şartları yakında eklenecek. Daha fazla bilgi için iletişime geçin.')} url="/terms" />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <nav className="text-sm text-slate-500 mb-4">
          <Link href="/" className="hover:underline">{tr('pages.terms.breadcrumb.home', 'Anasayfa')}</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800">{tr('pages.terms.breadcrumb.title', 'Kullanım Şartları')}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{tr('pages.terms.header.title', 'Kullanım Şartları')}</h1>
          <p className="text-slate-600 max-w-2xl">{tr('pages.terms.header.intro', 'Bu sayfa yakında eklenecek. Daha fazla bilgi için lütfen bizimle iletişime geçin: info@yasarunderwear.com')}</p>
        </header>

        <section>
          <div className="bg-white rounded-2xl p-8 shadow border text-sm">
            <p className="mb-4">{tr('pages.terms.placeholder', 'Bu sayfa yakında eklenecek. Daha fazla bilgi için lütfen bizimle iletişime geçin: info@yasarunderwear.com')}</p>
            <p>
              <Link href="/contact" className="text-amber-600 hover:underline">{tr('pages.terms.contactLink', 'İletişim sayfasına git')}</Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

