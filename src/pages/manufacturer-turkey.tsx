import SEO from '@/components/SEO';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ManufacturerTurkey() {
  const { t } = useLanguage();
  const tr = (key: string, fallback: string) => {
    try {
      const value = t(key);
      return value === key ? fallback : String(value);
    } catch {
      return fallback;
    }
  };
  return (
    <>
      <SEO
        title={tr('manufacturerTurkey.seo.title',"Türkiye'de İç Giyim Üreticisi — OEM & Özel Marka")}
        description={tr('manufacturerTurkey.seo.description',"Yasar, Türkiye'de OEM ve özel marka üretimi sunan deneyimli bir iç giyim üreticisidir. Güvenilir kalite, esnek üretim planlama ve anahtar teslim üretim çözümleri sunuyoruz.")}
        url="/manufacturer-turkey"
        keywords={['underwear manufacturer turkey', 'OEM turkey textile', 'private label turkey', 'underwear supplier turkey']}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: tr('manufacturerTurkey.seo.title',"Türkiye'de İç Giyim Üreticisi — OEM & Özel Marka"),
          about: {
            '@type': 'Organization',
            name: 'Yasar Underwear',
            alternateName: ['Yaşar Çamaşır', 'Yasar Textile'],
          },
        }}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: tr('manufacturerTurkey.hero.title',"Türkiye'de İç Giyim Üreticisi"), item: '/manufacturer-turkey' },
        ]}
      />

      <main className="max-w-6xl mx-auto px-4 py-16">
        <article className="prose max-w-none">
          <h1>{tr('manufacturerTurkey.hero.title',"Türkiye'de İç Giyim Üreticisi — OEM & Özel Marka")}</h1>
          <p>
            {tr('manufacturerTurkey.hero.body',"Yasar, Türkiye merkezli bir iç giyim üreticisidir; gecelik, pijama ve iç giyim alanında uluslararası markalar, perakendeciler ve özel marka iş ortaklarına üretim yapmaktadır.")}
          </p>

          <h2>{tr('manufacturerTurkey.why.title',"Neden Türkiye'de üretim?")}</h2>
          <ul>
            <li>{tr('manufacturerTurkey.why.items.0','Rekabetçi üretim maliyetleri ve yüksek kaliteli tekstil tedarik zincirine erişim.')}</li>
            <li>{tr('manufacturerTurkey.why.items.1','Deneyimli iş gücü ve Avrupa ile Orta Doğu pazarlarına ihracat tecrübesi.')}</li>
            <li>{tr('manufacturerTurkey.why.items.2','Sıkı kalite kontrol ve sektör standartlarına uygunluk.')}</li>
          </ul>

          <h2>{tr('manufacturerTurkey.services.title','OEM & Özel Marka Hizmetlerimiz')}</h2>
          <p>
            {tr('manufacturerTurkey.services.body','Numune geliştirme, prototip, üretim planlama, ambalaj tasarımı ve sevkiyat desteği sağlıyoruz. Minimum sipariş miktarları kumaş ve tasarım karmaşıklığına göre değişir.')}
          </p>

          <h2>{tr('manufacturerTurkey.cta.title','Üretim bilgisi alın')}</h2>
          <p>
            {tr('manufacturerTurkey.cta.prefix',"Türkiye'den OEM üretimi veya özel marka hizmetleri için")} <Link href="/private-label">{tr('manufacturerTurkey.cta.privateLabel','Özel Marka')}</Link> {tr('manufacturerTurkey.cta.middle','veya')} <Link href="/wholesale">{tr('manufacturerTurkey.cta.wholesale','Toptan')}</Link> {tr('manufacturerTurkey.cta.suffix','sayfalarımızdaki formu doldurarak bize ulaşabilirsiniz. Ekibimiz zaman çizelgesi ve üretim detaylarıyla dönüş yapacaktır.')}
          </p>
        </article>
      </main>
    </>
  );
}
