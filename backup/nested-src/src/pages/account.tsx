import SEO from '../components/SEO';

export default function AccountPage() {
  return (
    <>
      <SEO title="Hesabım - Yasar" description="Hesabınızla ilgili işlemler." url="/account" />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-4">Hesabım</h1>
        <p className="text-gray-600">Hesap giriş / kayıt işlemleri demo olarak burada yer alacak.</p>
      </main>
    </>
  );
}
