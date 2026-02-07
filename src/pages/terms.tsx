import SEO from '@/components/SEO';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <>
      <SEO title="Kullanım Şartları - Yasar" description="Yasar Kullanım Şartları" url="/terms" />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold mb-4">Kullanım Şartları</h1>
        <p className="text-gray-700">Bu sayfa yakında eklenecek. Daha fazla bilgi için <Link href="/contact">iletişime</Link> geçin.</p>
      </main>
    </>
  );
}
