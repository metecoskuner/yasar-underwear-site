import SEO from '../components/SEO';

export default function ContactPage() {
  return (
    <>
      <SEO title="İletişim - Yasar" description="Bize ulaşın — Yasar müşteri hizmetleri ile iletişime geçin." url="/contact" />
      <main className="max-w-4xl mx-auto px-4 py-12 text-center">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold">İletişim</h1>
          <p className="text-slate-600 mt-2">Bize bir mesaj gönderin; form sayfanın altında, footer üstünde yer alır.</p>
        </header>

        <div className="space-y-6">
          <p className="text-lg text-slate-700">Formu görmek veya doldurmak için aşağıdaki butona tıklayabilirsiniz. Ayrıca iletişim bilgileri ve çalışma saatleri sayfanın altında yer alır.</p>
          <a href="#contact-form" className="inline-block bg-black text-white px-6 py-3 rounded-lg shadow hover:bg-neutral-800 transition">Formu Aç</a>
        </div>
      </main>
    </>
  );
}