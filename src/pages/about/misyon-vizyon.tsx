import SEO from '@/components/SEO';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MisyonVizyon() {
  const { t } = useLanguage();
  const tr = (key: string, fallback: string) => {
    try {
      const value = t(key);
      return value === key ? fallback : value;
    } catch {
      return fallback;
    }
  };

  return (
    <>
      <SEO title={tr('pages.aboutMissionVision.seoTitle', 'Misyon & Vizyon - Yasar')} description={tr('pages.aboutMissionVision.seoDescription', "Yasar'ın misyonu ve vizyonu; kalite, sürdürülebilirlik ve uluslararası hedeflerimiz.")} url="/about/misyon-vizyon" />

      <main className="max-w-5xl mx-auto px-4 py-12">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold">{tr('pages.aboutMissionVision.title', 'Misyon & Vizyon')}</h1>
          <p className="mt-2 text-gray-600">{tr('pages.aboutMissionVision.lead', 'Misyonumuz ve vizyonumuz; kaliteli, sorumlu ve yenilikçi üretimle iç giyimde güvenilir bir marka olmaktır.')}</p>
        </header>

        <section className="prose">
          <h2 className="text-lg font-semibold">{tr('pages.aboutMissionVision.missionTitle', 'Misyon')}</h2>
          <p>
            {tr('pages.aboutMissionVision.missionBody', 'Misyonumuz, sürdürülebilir yöntemlerle yüksek kalite standartlarına sahip iç giyim ürünleri üretmektir. Kaynak verimliliği, tedarik şeffaflığı ve çalışan güvenliği misyonumuzun temel bileşenleridir.')}
          </p>

          <h2 className="text-lg font-semibold mt-4">{tr('pages.aboutMissionVision.visionTitle', 'Vizyon')}</h2>
          <p>
            {tr('pages.aboutMissionVision.visionBody', 'Vizyonumuz, bölgesel kökenimizden güç alarak uluslararası pazarlarda tercih edilen, sürdürülebilir üretim konusunda örnek gösterilen bir marka olmaktır. Yenilikçi tasarım ve proses optimizasyonu ile sektörde fark yaratmayı hedefliyoruz.')}
          </p>

          <p>
            {tr('pages.aboutMissionVision.contactLead', 'Kurumsal iş birlikleri, saha ziyaretleri veya teknik talepler için')} <Link href="/contact" className="text-amber-600">{tr('pages.aboutMissionVision.contactLink', 'iletişime geçebilirsiniz')}</Link>.
          </p>
        </section>
      </main>
    </>
  );
}
