import SEO from '../components/SEO';

export default function CartPage() {
  return (
    <>
      <SEO title="Sepet - Yasar" description="Sepetinizdeki ürünleri kontrol edin." url="/cart" />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-4">Sepet</h1>
        <p className="text-gray-600">Sepetiniz şu anda boş (demo).</p>
      </main>
    </>
  );
}
