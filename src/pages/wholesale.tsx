import Link from 'next/link';
import Image from 'next/image';
import SEO from '@/components/SEO';
import B2BForm from '@/components/B2BForm';
import { useLanguage } from '@/contexts/LanguageContext';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://yasarunderwear.com').replace(/\/$/, '');

export default function WholesalePage() {
  const { t } = useLanguage();
  return (
    <>
  <SEO
    title={t('pages.wholesale.seo.title')}
    description={t('pages.wholesale.seo.description')}
    url="/wholesale"
    keywords={['toptan iç giyim', 'wholesale underwear turkey', 'textile distributor turkey', 'bulk underwear manufacturer']}
    jsonLd={{
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Wholesale underwear manufacturing',
      provider: {
        '@type': 'Organization',
        name: 'Yasar',
      },
      areaServed: 'Worldwide',
      url: `${SITE_URL}/wholesale`,
    }}
  />

      <main className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <section className="text-center mb-10">
          <Image
            src="/photos/yasarLogo2.jpg"
            alt="Yasar"
            width={200}
            height={100}
            priority={false}
            className="mx-auto mb-4 w-36 sm:w-44 md:w-[200px] h-auto object-contain"
          />
          <h1 className="text-3xl sm:text-4xl font-bold">{t('pages.wholesale.header.title')}</h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">{t('pages.wholesale.header.lead')}</p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/contact" className="inline-block bg-black text-white px-5 py-2 rounded">{t('pages.wholesale.header.contact')}</Link>
            <a href="#form" className="inline-block border border-gray-300 px-5 py-2 rounded">{t('pages.wholesale.header.apply')}</a>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">{t('pages.wholesale.sections.whoCanApply.title')}</h3>
            <p className="mt-2 text-sm text-gray-600">{t('pages.wholesale.sections.whoCanApply.body')}</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">{t('pages.wholesale.sections.howItWorks.title')}</h3>
            <p className="mt-2 text-sm text-gray-600">{t('pages.wholesale.sections.howItWorks.body')}</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">{t('pages.wholesale.sections.policies.title')}</h3>
            <p className="mt-2 text-sm text-gray-600">{t('pages.wholesale.sections.policies.body')}</p>
          </div>
        </section>

        <section id="form" className="mb-16 py-4 md:py-8 md:min-h-[70vh] flex items-center justify-center">
          <div className="w-full px-0 sm:px-4">
            <div className="max-w-3xl mx-auto text-center mb-6">
              <h2 className="text-2xl font-semibold">{t('pages.wholesale.form.title')}</h2>
            </div>
            <div className="flex items-center justify-center">
              <B2BForm />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
