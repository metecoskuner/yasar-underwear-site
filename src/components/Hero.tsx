import Link from 'next/link';
import HeroSlider from './HeroSlider';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <HeroSlider />
      <div className="relative max-w-6xl mx-auto px-4 py-28 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Konfor & Şıklık — Her Gün</h1>
        <p className="text-gray-700 max-w-2xl mb-6">Yumuşak, nefes alan iç giyim koleksiyonumuzla rahatlığı ve zarafeti keşfedin. Türkiye&apos;de tasarlandı.</p>
        <div className="flex space-x-3">
          <Link href="/collections" legacyBehavior>
            <a className="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold shadow hover:opacity-95">Koleksiyonları Gör</a>
          </Link>
          <Link href="/contact" legacyBehavior>
            <a className="inline-block border border-black text-black px-5 py-3 rounded-full font-medium hover:bg-black hover:text-white transition">İletişim</a>
          </Link>
        </div>
      </div>
    </section>
  );
}