import SEO from '@/components/SEO';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/contexts/LanguageContext';

// Dynamically load WorldMap to avoid SSR issues (same pattern as home)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WorldMap = dynamic(() => import('@/components/WorldMap') as Promise<any>, { ssr: false });

export default function About() {
  const { t } = useLanguage();
  const tr = (key: string, fallback: string) => {
    try {
      const v = t(key);
      return v === key ? fallback : v;
    } catch (err) {
      void err;
      return fallback;
    }
  };
  return (
    <>
      <SEO title={tr('pages.about.title','Kurumsal - Yasar')} description={tr('pages.about.description','Yasar Tekstil hakkında, misyonumuz, vizyonumuz ve üretim altyapımız.')} url="/about" />

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Hero */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">{tr('pages.about.hero.title','Kurumsal')}</h1>
            <p className="mt-4 text-gray-700 max-w-prose">{tr('pages.about.hero.desc','Yasar olarak kalite, sürdürülebilirlik ve çalışan refahını merkeze alan üretim süreçleri ile iç giyim sektöründe öne çıkıyoruz. Türkiye’deki tesislerimizde modern üretim teknikleriyle dünya standartlarında ürünler geliştiriyoruz.')}</p>

            <div className="mt-6 flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
              <Link href="/uretim/tesisler" className="inline-flex items-center px-6 py-3 bg-amber-500 text-white rounded-full font-semibold shadow hover:opacity-95">{tr('pages.about.cta.facilities','Tesislerimiz')}</Link>
              <Link href="/uretim/kalite-surecleri" className="inline-flex items-center px-6 py-3 border border-gray-200 text-gray-800 rounded-full font-medium hover:bg-gray-50">{tr('pages.about.cta.quality','Kalite Süreçleri')}</Link>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg h-60 md:h-72 lg:h-80 relative">
            <Image src="/photos/deneme3.jpg" alt={tr('pages.about.imageAlt','Üretim Tesisleri')} fill className="object-cover" />
            <div className="absolute left-6 bottom-6 bg-white/85 backdrop-blur-sm rounded-lg p-3 shadow">
              <div className="text-sm text-gray-700">{tr('pages.about.isoLines','ISO uyumlu üretim hatları')}</div>
            </div>
          </div>
        </section>

        {/* Kurumsal alt sayfalarına yönlendirme */}
        <section className="grid md:grid-cols-1 gap-6">
          <Link href="/about/hakkimizda" className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold">{tr('pages.about.sections.about.title','Hakkımızda')}</h3>
            <p className="mt-2 text-sm text-gray-600">{tr('pages.about.sections.about.desc','Şirket geçmişimiz, üretim felsefemiz, misyon ve vizyonumuz hakkında detaylı bilgi alın.')}</p>
          </Link>
        </section>

        {/* Values / Why Us */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 text-amber-600 rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2l2 4 4 .5-3 2 1 4-3-2-3 2 1-4-3-2L10 6 12 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{tr('pages.about.values.design.title','Tasarım & Konfor')}</h3>
                <p className="text-sm text-gray-600 mt-1">{tr('pages.about.values.design.body','İyi tasarım, dayanıklılık ve kullanım rahatlığı bir arada.')}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 text-amber-600 rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M3 21v-8a1 1 0 011-1h3v9H3zM21 21h-8V8h3l2-2 3 2v13zM9 7V3l2-1 2 1v4H9z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{tr('pages.about.values.facilities.title','Modern Tesisler')}</h3>
                <p className="text-sm text-gray-600 mt-1">{tr('pages.about.values.facilities.body','Enerji verimli, izlenebilir üretim altyapısı.')}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 text-amber-600 rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2a7 7 0 100 14 7 7 0 000-14zM2 22c1-4 5-7 10-7s9 3 10 7H2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{tr('pages.about.values.responsibility.title','Sosyal Sorumluluk')}</h3>
                <p className="text-sm text-gray-600 mt-1">{tr('pages.about.values.responsibility.body','Çalışan sağlığı, adil ücretlendirme ve çevresel önlemler.')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats + WorldMap */}
        <section className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{tr('pages.about.quick.title','Hızlı Bakış')}</h2>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                <div className="text-2xl font-bold">15+</div>
                <div className="text-sm text-gray-500">{tr('pages.about.quick.labels.experience','Yıllık tecrübe')}</div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                <div className="text-2xl font-bold">20+</div>
                <div className="text-sm text-gray-500">{tr('pages.about.quick.labels.audits','Denetim / yıl')}</div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                <div className="text-2xl font-bold">%30</div>
                <div className="text-sm text-gray-500">{tr('pages.about.quick.labels.reducedWaste','Azaltılmış atık')}</div>
              </div>
            </div>
            <p className="text-gray-700">{tr('pages.about.contactPrompt','Daha fazla bilgi veya kurumsal iş birliği talepleri için bizimle iletişime geçin.')}</p>
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg h-64 md:h-72 lg:h-80 relative">
            <WorldMap />
          </div>
        </section>

        <section className="text-center">
          <h3 className="text-xl font-semibold">{tr('pages.about.collab.title','İş Birliği & Talepler')}</h3>
          <p className="mt-2 text-gray-600">{tr('pages.about.collab.body','Saha ziyaretleri, teknik sorular veya büyük hacimli sipariş talepleri için doğrudan iletişime geçebilirsiniz.')}</p>
          <div className="mt-4">
            <Link href="/contact" className="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold">{tr('pages.about.collab.cta','İletişime Geç')}</Link>
          </div>
        </section>
      </main>
    </>
  );
}
