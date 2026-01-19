import SEO from '@/components/SEO';
import Link from 'next/link';

export default function MisyonVizyon() {
  return (
    <>
      <SEO title="Misyon & Vizyon - Yasar" description="Yasar'ın misyonu ve vizyonu; kalite, sürdürülebilirlik ve uluslararası hedeflerimiz." url="/about/misyon-vizyon" />

      <main className="max-w-5xl mx-auto px-4 py-12">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold">Misyon &amp; Vizyon</h1>
          <p className="mt-2 text-gray-600">Misyonumuz ve vizyonumuz; kaliteli, sorumlu ve yenilikçi üretimle iç giyimde güvenilir bir marka olmaktır.</p>
        </header>

        <section className="prose">
          <h2 className="text-lg font-semibold">Misyon</h2>
          <p>
            Misyonumuz, sürdürülebilir yöntemlerle yüksek kalite standartlarına sahip iç giyim ürünleri üretmektir. Kaynak verimliliği, tedarik şeffaflığı ve çalışan güvenliği misyonumuzun temel bileşenleridir.
          </p>

          <h2 className="text-lg font-semibold mt-4">Vizyon</h2>
          <p>
            Vizyonumuz, bölgesel kökenimizden güç alarak uluslararası pazarlarda tercih edilen, sürdürülebilir üretim konusunda örnek gösterilen bir marka olmaktır. Yenilikçi tasarım ve proses optimizasyonu ile sektörde fark yaratmayı hedefliyoruz.
          </p>

          <p>
            Kurumsal iş birlikleri, saha ziyaretleri veya teknik talepler için <Link href="/contact" className="text-amber-600">iletişime geçebilirsiniz</Link>.
          </p>
        </section>
      </main>
    </>
  );
}
