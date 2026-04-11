import SEO from '../components/SEO';
import Link from 'next/link';

export default function AccountPage() {
  return (
    <>
      <SEO title="Hesabım - Yasar" description="Hesabınızla ilgili işlemler." url="/account" />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-4">Hesabım</h1>
        <p className="text-gray-600">Hesap ve sipariş süreçleri şu an doğrudan müşteri temsilcimiz üzerinden yürütülmektedir. Hesabınızla ilgili destek almak için bizimle iletişime geçebilirsiniz.</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/urunler" className="inline-block px-4 py-2 bg-black text-white rounded-md">Ürünleri Gör</Link>
          <Link href="/contact" className="inline-block px-4 py-2 border border-gray-200 rounded-md">İletişime Geç</Link>
          <Link href="/about" className="inline-block px-4 py-2 text-amber-600">Kurumsal Bilgi</Link>
        </div>
      </main>
    </>
  );
}
