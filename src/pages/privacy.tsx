import SEO from '@/components/SEO';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <>
      <SEO title="Gizlilik Politikası - Yasar" description="Yasar Gizlilik Politikası" url="/privacy" />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold mb-2 text-slate-900">Gizlilik Politikası</h1>
          <p className="text-slate-600">Yasar olarak kişisel verilerinizin gizliliğine önem veriyoruz. Aşağıda hangi verileri topladığımızı, nasıl kullandığımızı ve haklarınızı özetledik. Detay için bizimle <Link href="/contact" className="underline">iletişime</Link> geçebilirsiniz.</p>
        </header>

        <div className="space-y-6">
          <section className="bg-white rounded-2xl p-6 shadow-sm border">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Hangi verileri topluyoruz?</h2>
            <p className="text-slate-700">Adınız, e‑posta adresiniz, telefon numaranız ve iletişim formlarına girdiğiniz diğer bilgiler. Ayrıca site kullanımına ilişkin çerez ve teknik veriler (IP adresi, tarayıcı bilgisi, sayfa görüntüleme vb.) toplanabilir.</p>
          </section>

          <section className="bg-slate-50 rounded-2xl p-6 border">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Verileri neden kullanıyoruz?</h2>
            <p className="text-slate-700">Topladığımız veriler; taleplerinize yanıt vermek, hizmetlerimizi sunmak ve geliştirmek, sipariş/teklif süreçlerini yürütmek ve yasal yükümlülüklerimizi yerine getirmek için kullanılır.</p>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm border">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Veri paylaşımı</h2>
            <p className="text-slate-700">Verileriniz, açık rızanız veya kanuni zorunluluk olmadıkça üçüncü taraflarla paylaşılmaz. Hizmet sağlamak amacıyla alt yükleniciler (ör. kargo, ödeme sağlayıcıları) ile gerekli ve sınırlı paylaşım yapılabilir; bu aktarımlar güvenli şekilde gerçekleştirilir.</p>
          </section>

          <section className="bg-slate-50 rounded-2xl p-6 border">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Haklarınız</h2>
            <ul className="list-disc pl-5 text-slate-700">
              <li>Verilerinize erişme ve düzeltme hakkı</li>
              <li>Verilerin silinmesini ya da işlenmesinin kısıtlanmasını isteme hakkı</li>
              <li>Veri işlenmesine itiraz etme ve veri taşınabilirliği hakkı</li>
            </ul>
            <p className="mt-3 text-slate-700">Hak talebinizi <Link href="/contact" className="underline">iletişim</Link> formu üzerinden iletebilirsiniz.</p>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm border">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Çerezler ve izleme</h2>
            <p className="text-slate-700">Sitede performans ve analitik amaçlı çerezler kullanılabilir. Tarayıcı ayarlarından çerezleri yönetebilir veya devre dışı bırakabilirsiniz; bazı özellikler bu durumda düzgün çalışmayabilir.</p>
          </section>

          <section className="bg-rose-50/50 rounded-2xl p-6 border">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Güvenlik ve iletişim</h2>
            <p className="text-slate-700">Verilerinizi korumak için makul teknik ve idari önlemler uyguluyoruz. Gizlilik ile ilgili soru, talep veya şikâyetleriniz için lütfen <Link href="/contact" className="inline-block mt-2 bg-black text-white rounded-lg px-4 py-2 hover:opacity-95">iletişime geçin</Link>.</p>
          </section>
        </div>
      </main>
    </>
  );
}
