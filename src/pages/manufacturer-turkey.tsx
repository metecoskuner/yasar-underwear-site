import SEO from '@/components/SEO';
import Link from 'next/link';

export default function ManufacturerTurkey() {
  return (
    <>
      <SEO
        title="Türkiye&apos;de İç Giyim Üreticisi — OEM & Özel Marka"
        description="Yasar, Türkiye&apos;de OEM ve özel marka üretimi sunan deneyimli bir iç giyim üreticisidir. Rekabetçi fiyat, güvenilir kalite ve anahtar teslim üretim çözümleri sunuyoruz."
        url="/manufacturer-turkey"
      />

      <main className="max-w-6xl mx-auto px-4 py-16">
        <article className="prose max-w-none">
          <h1>Türkiye&apos;de İç Giyim Üreticisi — OEM & Özel Marka</h1>
          <p>
            Yasar, Türkiye merkezli bir iç giyim üreticisidir; gecelik, pijama ve iç giyim alanında uluslararası markalar, perakendeciler ve özel marka iş ortaklarına üretim yapmaktadır.
          </p>

          <h2>Neden Türkiye&apos;de üretim?</h2>
          <ul>
            <li>Rekabetçi üretim maliyetleri ve yüksek kaliteli tekstil tedarik zincirine erişim.</li>
            <li>Deneyimli iş gücü ve Avrupa ile Orta Doğu pazarlarına ihracat tecrübesi.</li>
            <li>Sıkı kalite kontrol ve sektör standartlarına uygunluk.</li>
          </ul>

          <h2>OEM & Özel Marka Hizmetlerimiz</h2>
          <p>
            Numune geliştirme, prototip, üretim planlama, ambalaj tasarımı ve sevkiyat desteği sağlıyoruz. Minimum sipariş miktarları kumaş ve tasarım karmaşıklığına göre değişir.
          </p>

          <h2>Teklif alın</h2>
          <p>
            Türkiye&apos;den OEM üretimi veya özel marka hizmetleri için <Link href="/private-label">Özel Marka</Link> veya <Link href="/wholesale">Toptan</Link> sayfalarımızdaki formu doldurarak bize ulaşabilirsiniz. Ekibimiz zaman çizelgesi ve fiyatlandırma bilgileriyle dönüş yapacaktır.
          </p>
        </article>
      </main>
    </>
  );
}
