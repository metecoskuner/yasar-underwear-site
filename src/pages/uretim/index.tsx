import Link from 'next/link';
import SEO from '@/components/SEO';
import Card from '@/components/Card';
import { useLanguage } from '@/contexts/LanguageContext';

export default function UretimIndex() {
  const { t } = useLanguage();

  return (
    <>
      <SEO
        title={t('pages.uretim_index.title')}
        description={t('pages.uretim_index.pageDescription')}
        url="/uretim"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: t('pages.uretim_index.title'), item: '/uretim' },
        ]}
      />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold">{t('pages.uretim_index.title')}</h1>
          <p className="mt-2 text-gray-600">{t('pages.uretim_index.lead')}</p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <Link href="/uretim/tesisler" className="no-underline">
            <Card title={t('pages.uretim_index.cards.facilities.title')} desc={t('pages.uretim_index.cards.facilities.desc')} />
          </Link>

          <Link href="/uretim/kalite-surecleri" className="no-underline">
            <Card title={t('pages.uretim_index.cards.quality.title')} desc={t('pages.uretim_index.cards.quality.desc')} />
          </Link>
        </section>
      </main>
    </>
  );
}
